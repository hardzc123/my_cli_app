#!/usr/bin/env node

import { readFileSync } from 'fs';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ANSI color codes for better visual display
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  // Foreground colors
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Background colors
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
};

// Helper functions for colored text
const colorize = (text, color) => `${color}${text}${colors.reset}`;
const bold = (text) => `${colors.bright}${text}${colors.reset}`;

// Load conversations from JSON file
const conversationsPath = join(__dirname, 'conversations.json');
const data = JSON.parse(readFileSync(conversationsPath, 'utf8'));

// Create readline interface for user input
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to execute Python script using uv
function executePythonScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    const fullPath = join(__dirname, scriptPath);

    // Use 'uv run' to execute Python script with uv-managed environment
    const pythonProcess = spawn('uv', ['run', fullPath, ...args], {
      cwd: __dirname,
      stdio: 'inherit' // This allows the Python script's output to be displayed directly
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Python script exited with code ${code}`));
      }
    });

    pythonProcess.on('error', (error) => {
      reject(error);
    });
  });
}

// Function to display a conversation and get user choice
async function showConversation(nodeId) {
  const node = data.conversations[nodeId];

  if (!node) {
    console.log(colorize('\nError: Conversation node not found!', colors.red));
    rl.close();
    return;
  }

  console.log('\n' + colorize('='.repeat(60), colors.cyan));
  console.log(bold(colorize(node.text, colors.white)));
  console.log(colorize('='.repeat(60), colors.cyan));

  // Execute Python script if specified
  if (node.pythonScript) {
    try {
      await executePythonScript(node.pythonScript);
    } catch (error) {
      console.log(colorize(`\n⚠️  Error executing Python script: ${error.message}`, colors.red));
    }
  }

  // Check if this is an ending (no choices)
  if (!node.choices || node.choices.length === 0) {
    console.log(colorize('\n✨ [THE END] ✨\n', colors.magenta));
    rl.close();
    return;
  }

  // Display choices
  console.log(colorize('\nWhat do you want to do?\n', colors.yellow));
  node.choices.forEach((choice, index) => {
    console.log(colorize(`${index + 1}.`, colors.green) + ' ' + choice.text);
  });

  // Get user input
  rl.question(colorize('\nEnter your choice (number): ', colors.cyan), async (answer) => {
    const choiceIndex = parseInt(answer) - 1;

    if (isNaN(choiceIndex) || choiceIndex < 0 || choiceIndex >= node.choices.length) {
      console.log(colorize('\n❌ Invalid choice. Please try again.', colors.red));
      await showConversation(nodeId);
      return;
    }

    const nextNode = node.choices[choiceIndex].next;
    await showConversation(nextNode);
  });
}

// Start the conversation
console.log('\n' + bold(colorize('🎮 Welcome to Conversation CLI! 🎮', colors.magenta)));
console.log(colorize('━'.repeat(60), colors.blue) + '\n');

// Run the conversation
(async () => {
  await showConversation(data.start);
})();
