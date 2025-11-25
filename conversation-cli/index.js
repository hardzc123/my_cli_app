#!/usr/bin/env node

import { readFileSync } from 'fs';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

// Function to display a conversation and get user choice
function showConversation(nodeId) {
  const node = data.conversations[nodeId];

  if (!node) {
    console.log(colorize('\nError: Conversation node not found!', colors.red));
    rl.close();
    return;
  }

  console.log('\n' + colorize('='.repeat(60), colors.cyan));
  console.log(bold(colorize(node.text, colors.white)));
  console.log(colorize('='.repeat(60), colors.cyan));

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
  rl.question(colorize('\nEnter your choice (number): ', colors.cyan), (answer) => {
    const choiceIndex = parseInt(answer) - 1;

    if (isNaN(choiceIndex) || choiceIndex < 0 || choiceIndex >= node.choices.length) {
      console.log(colorize('\n❌ Invalid choice. Please try again.', colors.red));
      showConversation(nodeId);
      return;
    }

    const nextNode = node.choices[choiceIndex].next;
    showConversation(nextNode);
  });
}

// Start the conversation
console.log('\n' + bold(colorize('🎮 Welcome to Conversation CLI! 🎮', colors.magenta)));
console.log(colorize('━'.repeat(60), colors.blue) + '\n');
showConversation(data.start);
