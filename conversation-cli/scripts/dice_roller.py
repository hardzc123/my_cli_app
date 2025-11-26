#!/usr/bin/env python3
"""
Dice roller script - rolls virtual dice
"""
import random
import sys


def main():
    print("\n\033[1;36m🎲 Rolling the dice...\033[0m\n")

    # Roll two dice
    die1 = random.randint(1, 6)
    die2 = random.randint(1, 6)
    total = die1 + die2

    # Visual representation
    print(f"  Die 1: \033[32m[{die1}]\033[0m")
    print(f"  Die 2: \033[32m[{die2}]\033[0m")
    print(f"  \033[1;33mTotal: {total}\033[0m\n")

    # Add some flavor text
    if total == 12:
        print("\033[1;35m✨ Snake eyes reversed! Maximum roll!\033[0m")
    elif total == 2:
        print("\033[31m🐍 Snake eyes! Minimum roll!\033[0m")
    elif total >= 10:
        print("\033[32m🎉 Excellent roll!\033[0m")
    elif total >= 7:
        print("\033[33m👍 Good roll!\033[0m")
    else:
        print("\033[36mNot bad!\033[0m")

    print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
