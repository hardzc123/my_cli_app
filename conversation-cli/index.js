#!/usr/bin/env node

import { readFileSync } from 'fs';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    console.log('\nError: Conversation node not found!');
    rl.close();
    return;
  }

  console.log('\n' + '='.repeat(60));
  console.log(node.text);
  console.log('='.repeat(60));

  // Check if this is an ending (no choices)
  if (!node.choices || node.choices.length === 0) {
    console.log('\n[THE END]\n');
    rl.close();
    return;
  }

  // Display choices
  console.log('\nWhat do you want to do?\n');
  node.choices.forEach((choice, index) => {
    console.log(`${index + 1}. ${choice.text}`);
  });

  // Get user input
  rl.question('\nEnter your choice (number): ', (answer) => {
    const choiceIndex = parseInt(answer) - 1;

    if (isNaN(choiceIndex) || choiceIndex < 0 || choiceIndex >= node.choices.length) {
      console.log('\nInvalid choice. Please try again.');
      showConversation(nodeId);
      return;
    }

    const nextNode = node.choices[choiceIndex].next;
    showConversation(nextNode);
  });
}

// Start the conversation
console.log('\n🎮 Welcome to Conversation CLI!\n');
showConversation(data.start);
