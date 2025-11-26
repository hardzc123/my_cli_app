# Python Script Examples

This file contains examples of Python scripts you can use in your conversation CLI app.

## Basic Script Template

```python
#!/usr/bin/env python3
"""
Script description
"""
import sys

def main():
    # Your code here
    print("\n\033[36mYour message here\033[0m\n")
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

## Using Arguments

You can pass arguments to your Python scripts through the conversation JSON (future enhancement) or read from stdin.

```python
#!/usr/bin/env python3
import sys

def main():
    # Get arguments
    if len(sys.argv) > 1:
        player_name = sys.argv[1]
    else:
        player_name = "Adventurer"

    print(f"\n\033[36mHello, {player_name}!\033[0m\n")
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

## Using Python Packages

1. Add the package to your project:
```bash
uv add requests
```

2. Use it in your script:
```python
#!/usr/bin/env python3
import requests

def main():
    # Use the package
    response = requests.get("https://api.example.com/data")
    print(f"\n\033[36mData: {response.json()}\033[0m\n")
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

## ANSI Color Codes Reference

Use these codes for colored output:

```python
# Colors
RESET = '\033[0m'
BOLD = '\033[1m'
RED = '\033[31m'
GREEN = '\033[32m'
YELLOW = '\033[33m'
BLUE = '\033[34m'
MAGENTA = '\033[35m'
CYAN = '\033[36m'

# Usage
print(f"{GREEN}Success!{RESET}")
print(f"{BOLD}{CYAN}Important message{RESET}")
```

## Example: Random Event Generator

```python
#!/usr/bin/env python3
import random

def main():
    events = [
        ("You found a treasure chest!", "🎁", "\033[33m"),
        ("A wild beast appears!", "🐺", "\033[31m"),
        ("You meet a friendly merchant.", "🧙", "\033[36m"),
        ("The path splits in two directions.", "🛤️", "\033[35m"),
    ]

    event, emoji, color = random.choice(events)
    print(f"\n{color}{emoji} {event}\033[0m\n")
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

## Example: Simple Quiz

```python
#!/usr/bin/env python3
import random

def main():
    questions = [
        ("What is 2 + 2?", "4"),
        ("What color is the sky?", "blue"),
        ("How many sides does a triangle have?", "3"),
    ]

    question, answer = random.choice(questions)
    print(f"\n\033[1;33m❓ Riddle: {question}\033[0m")
    print(f"\033[2m(The answer is: {answer})\033[0m\n")
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

## Example: Progress Bar

```python
#!/usr/bin/env python3
import time
import sys

def progress_bar(duration=2):
    total = 20
    for i in range(total + 1):
        progress = "█" * i + "░" * (total - i)
        percent = int((i / total) * 100)
        sys.stdout.write(f"\r\033[36mLoading: [{progress}] {percent}%\033[0m")
        sys.stdout.flush()
        time.sleep(duration / total)
    print("\n")

def main():
    print("\n\033[1;35mPreparing your adventure...\033[0m\n")
    progress_bar(2)
    print("\033[32m✓ Ready!\033[0m\n")
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

## Best Practices

1. **Always return proper exit codes**: 0 for success, non-zero for errors
2. **Use color codes sparingly**: Don't overdo it
3. **Add newlines**: Print `\n` before and after output for spacing
4. **Handle errors gracefully**: Use try/except blocks
5. **Keep scripts focused**: Each script should do one thing well
6. **Test independently**: Use `uv run scripts/your_script.py` to test

## Troubleshooting

### Script doesn't execute
- Check file permissions: `chmod +x scripts/your_script.py`
- Verify the path in conversations.json is correct
- Make sure the shebang line is present

### Import errors
- Add missing packages: `uv add package-name`
- Check your Python version: `uv run python --version`

### Colors not showing
- Some terminals don't support ANSI colors
- Test in a different terminal emulator
