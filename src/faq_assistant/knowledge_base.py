"""Knowledge base loader for FAQ entries."""

from __future__ import annotations

import json
from pathlib import Path

from .models import FAQEntry


class FAQKnowledgeBase:
    """Loads and validates FAQ entries from a JSON file."""

    def __init__(self, faq_file: Path) -> None:
        self._faq_file = faq_file
        self._entries: list[FAQEntry] = []

    @property
    def entries(self) -> list[FAQEntry]:
        """Return loaded FAQ entries."""
        return self._entries

    def load(self) -> None:
        """Load and validate FAQ entries from disk."""
        raw_data = json.loads(self._faq_file.read_text(encoding="utf-8"))

        if not isinstance(raw_data, list):
            raise ValueError("FAQ data must be a list of entries.")

        entries: list[FAQEntry] = []
        for index, item in enumerate(raw_data, start=1):
            if not isinstance(item, dict):
                raise ValueError(f"FAQ entry #{index} must be a JSON object.")

            required_fields = ["id", "question", "answer", "keywords"]
            missing = [field for field in required_fields if field not in item]
            if missing:
                raise ValueError(
                    f"FAQ entry #{index} is missing required fields: {missing}"
                )

            if not isinstance(item["keywords"], list):
                raise ValueError(
                    f"FAQ entry #{index} field 'keywords' must be a list.")

            entries.append(
                FAQEntry(
                    id=str(item["id"]),
                    question=str(item["question"]),
                    answer=str(item["answer"]),
                    keywords=[str(k).strip().lower()
                              for k in item["keywords"]],
                )
            )

        self._entries = entries
