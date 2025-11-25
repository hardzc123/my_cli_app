# Conversation CLI

A simple, interactive CLI application with conversation branches controlled by a JSON file.

## Features

- Easy-to-modify conversation flows via JSON
- Interactive command-line interface
- Choice-based branching narratives
- No external dependencies (uses only Node.js built-ins)

## Installation

No installation needed! Just run it with Node.js (v14 or higher recommended).

## Usage

Run the CLI app:

```bash
node index.js
```

Or make it executable and run directly:

```bash
npm start
```

## How to Modify Conversations

Edit the `conversations.json` file to create your own conversation trees. The structure is simple:

```json
{
  "start": "welcome",
  "conversations": {
    "welcome": {
      "text": "Your conversation text here",
      "choices": [
        {
          "text": "Choice 1 text",
          "next": "node_id_1"
        },
        {
          "text": "Choice 2 text",
          "next": "node_id_2"
        }
      ]
    },
    "node_id_1": {
      "text": "Next conversation text",
      "choices": []
    }
  }
}
```

### JSON Structure

- **start**: The ID of the starting conversation node
- **conversations**: Object containing all conversation nodes
  - **[node_id]**: Unique identifier for each conversation
    - **text**: The text to display to the user
    - **choices**: Array of available choices
      - **text**: The choice text shown to the user
      - **next**: The ID of the next conversation node
    - Empty choices array `[]` means this is an ending

## Example

The included example has:
- Starting point with 2 choices (mountain or village)
- Each path has 2 additional choices
- 4 possible endings

## Tips for Creating Your Own

1. Start with a simple flow and expand gradually
2. Give each conversation node a descriptive ID
3. Make sure all "next" references point to existing nodes
4. Leave choices array empty `[]` for endings
5. Test each branch to ensure it works as expected

## Requirements

- Node.js v14 or higher

## License

MIT
