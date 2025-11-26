#!/usr/bin/env python3
"""
Greet player script - demonstrates argument passing
"""
import sys


def main():
    # Get player name from arguments or use default
    player_name = sys.argv[1] if len(sys.argv) > 1 else "Adventurer"

    print("\n\033[1;35m" + "="*60 + "\033[0m")
    print(f"\033[1;36m👋 Welcome, {player_name}!\033[0m")
    print("\033[33mYour journey through this mystical land begins now...\033[0m")
    print("\033[1;35m" + "="*60 + "\033[0m\n")

    # Some stats
    import random
    stats = {
        "Courage": random.randint(5, 10),
        "Wisdom": random.randint(5, 10),
        "Luck": random.randint(5, 10)
    }

    print("\033[32mYour starting stats:\033[0m")
    for stat, value in stats.items():
        bar = "█" * value + "░" * (10 - value)
        print(f"  {stat:10s}: \033[36m{bar}\033[0m {value}/10")

    print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
