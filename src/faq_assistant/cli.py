"""Command-line interface for FAQ Assistant."""

from __future__ import annotations

import argparse
from pathlib import Path

from .chatbot import FAQAssistant


def parse_args() -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(
        description="Run the FAQ Assistant chatbot.")
    parser.add_argument(
        "--faq-file",
        type=Path,
        default=Path("data/faqs.json"),
        help="Path to FAQ JSON file.",
    )
    return parser.parse_args()


def main() -> None:
    """Run interactive chatbot session in terminal."""
    args = parse_args()
    assistant = FAQAssistant(args.faq_file)

    print("Infora FAQ Assistant is running.")
    print("Type your question. Use 'exit' to quit.\n")

    while True:
        user_input = input("You: ").strip()
        if assistant.should_exit(user_input):
            print("Bot: Thanks for chatting. Goodbye!")
            break

        print(f"Bot: {assistant.get_response(user_input)}\n")


if __name__ == "__main__":
    main()
