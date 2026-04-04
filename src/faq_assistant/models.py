"""Data models for FAQ Assistant."""

from dataclasses import dataclass


@dataclass(frozen=True)
class FAQEntry:
    """Represents one FAQ item with matching hints."""

    id: str
    question: str
    answer: str
    keywords: list[str]
