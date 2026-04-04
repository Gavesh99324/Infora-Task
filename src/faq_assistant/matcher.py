"""Matching logic for mapping user queries to FAQ entries."""

from __future__ import annotations

import re
from difflib import SequenceMatcher

from .models import FAQEntry


class FAQMatcher:
    """Computes relevance scores and returns best FAQ match."""

    def __init__(self, entries: list[FAQEntry]) -> None:
        self._entries = entries

    @staticmethod
    def _normalize(text: str) -> str:
        text = text.lower().strip()
        return re.sub(r"[^a-z0-9\s]", " ", text)

    @staticmethod
    def _tokenize(text: str) -> set[str]:
        normalized = FAQMatcher._normalize(text)
        return {token for token in normalized.split() if token}

    def _score(self, query: str, entry: FAQEntry) -> float:
        query_tokens = self._tokenize(query)
        if not query_tokens:
            return 0.0

        keyword_matches = sum(
            1 for keyword in entry.keywords if keyword in query_tokens)
        keyword_score = keyword_matches / max(len(entry.keywords), 1)

        semantic_text = f"{entry.question} {' '.join(entry.keywords)}"
        text_similarity = SequenceMatcher(
            a=self._normalize(query), b=self._normalize(semantic_text)
        ).ratio()

        token_overlap = len(
            query_tokens.intersection(self._tokenize(semantic_text))
        ) / max(len(query_tokens), 1)

        # Weighted score balances keyword intent and fuzzy similarity.
        return (
            (0.45 * keyword_score)
            + (0.35 * token_overlap)
            + (0.20 * text_similarity)
        )

    def find_best_match(self, query: str) -> tuple[FAQEntry | None, float]:
        """Return best matching FAQ and confidence score."""
        best_entry: FAQEntry | None = None
        best_score = 0.0

        for entry in self._entries:
            score = self._score(query, entry)
            if score > best_score:
                best_score = score
                best_entry = entry

        return best_entry, best_score
