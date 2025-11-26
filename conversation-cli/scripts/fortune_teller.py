#!/usr/bin/env python3
"""
Fortune teller script - generates a random fortune
"""
import random
import sys


def main():
    fortunes = [
        "You will find great treasure in the cave!",
        "A wise friend will guide you on your journey.",
        "Beware of the shadows in the forest.",
        "Your courage will be rewarded.",
        "An unexpected adventure awaits you.",
        "The stars align in your favor today.",
        "Trust your instincts, they will not fail you."
    ]

    fortune = random.choice(fortunes)

    # Print with color codes
    print("\n\033[35m" + "="*50 + "\033[0m")
    print("\033[1;33m🔮 Your Fortune:\033[0m")
    print(f"\033[36m{fortune}\033[0m")
    print("\033[35m" + "="*50 + "\033[0m\n")

    return 0


if __name__ == "__main__":
    sys.exit(main())
