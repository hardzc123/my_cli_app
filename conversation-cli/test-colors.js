#!/usr/bin/env node

// Simple script to test color output

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

const colorize = (text, color) => `${color}${text}${colors.reset}`;
const bold = (text) => `${colors.bright}${text}${colors.reset}`;

console.log('\n' + colorize('Color Test Preview:', colors.magenta));
console.log(colorize('━'.repeat(60), colors.blue));
console.log('\n' + bold(colorize('This is how your conversation text will look!', colors.white)));
console.log(colorize('='.repeat(60), colors.cyan));
console.log('\n' + colorize('What do you want to do?\n', colors.yellow));
console.log(colorize('1.', colors.green) + ' Take the path to the left');
console.log(colorize('2.', colors.green) + ' Take the path to the right');
console.log('\n' + colorize('Enter your choice (number): ', colors.cyan) + '[User input here]');
console.log('\n' + colorize('✨ [THE END] ✨', colors.magenta));
console.log('\n' + colorize('❌ Error messages look like this', colors.red));
console.log('\n' + colorize('━'.repeat(60), colors.blue) + '\n');
