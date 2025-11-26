# Conversation CLI

A simple, interactive CLI application with conversation branches controlled by a JSON file, with support for executing Python scripts.

## Features

- Easy-to-modify conversation flows via JSON
- Interactive command-line interface with colorful output
- Choice-based branching narratives
- **Python script integration** - Execute Python scripts at any conversation node
- **uv-managed Python environment** - Python dependencies managed by uv
- No external Node.js dependencies (uses only Node.js built-ins)
- Color-coded display for better readability:
  - Cyan borders and separators
  - Bold white text for conversations
  - Green numbered choices
  - Yellow prompts
  - Magenta endings
  - Red error messages

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

### Preview Colors

To see how the colors look, run the test script:

```bash
node test-colors.js
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
    - **pythonScript** (optional): Path to a Python script to execute (e.g., "scripts/script.py")
    - **choices**: Array of available choices
      - **text**: The choice text shown to the user
      - **next**: The ID of the next conversation node
    - Empty choices array `[]` means this is an ending

## Example

The included example has:
- Starting point with 3 choices (mountain, village, or fortune teller)
- Python script integration at key points:
  - Welcome screen shows player stats (greet_player.py)
  - Fortune teller displays random fortune (fortune_teller.py)
  - Dice rolling challenge (dice_roller.py)
- Multiple branching paths
- 4 possible endings

## Tips for Creating Your Own

1. Start with a simple flow and expand gradually
2. Give each conversation node a descriptive ID
3. Make sure all "next" references point to existing nodes
4. Leave choices array empty `[]` for endings
5. Test each branch to ensure it works as expected

## Requirements

- Node.js v14 or higher
- **uv** (for Python script execution) - [Install uv](https://github.com/astral-sh/uv)
- Python 3.12+ (managed automatically by uv)

## Python Script Integration

### Overview

You can execute Python scripts at any conversation node by adding a `pythonScript` field to your conversation JSON.

### Adding Python Scripts to Conversations

```json
{
  "node_id": {
    "text": "Your conversation text",
    "pythonScript": "scripts/your_script.py",
    "choices": [...]
  }
}
```

The Python script will execute after displaying the conversation text and before showing the choices.

### Example Python Scripts

The project includes three example scripts in the `scripts/` directory:

1. **greet_player.py** - Greets the player with random stats
2. **fortune_teller.py** - Displays a random fortune
3. **dice_roller.py** - Rolls virtual dice with results

### Creating Your Own Python Scripts

1. Create your Python script in the `scripts/` directory
2. Add the shebang line: `#!/usr/bin/env python3`
3. Make it executable: `chmod +x scripts/your_script.py`
4. Reference it in your conversation JSON with the `pythonScript` field

Example:

```python
#!/usr/bin/env python3
import sys

def main():
    print("\n\033[36mHello from Python!\033[0m\n")
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

### Python Environment Management

This project uses **uv** to manage Python dependencies:

- Virtual environment is automatically created in `.venv/`
- Add dependencies to `pyproject.toml` if needed
- Scripts run via `uv run` which handles the environment automatically

To add a Python dependency:

```bash
uv add package-name
```

### Testing Python Scripts

You can test Python scripts independently:

```bash
uv run scripts/fortune_teller.py
uv run scripts/dice_roller.py
uv run scripts/greet_player.py YourName
```

## License

MIT
