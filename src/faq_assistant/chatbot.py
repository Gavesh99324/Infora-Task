"""Main FAQ Assistant orchestration module."""

from __future__ import annotations

from pathlib import Path

from .config import AssistantConfig
from .knowledge_base import FAQKnowledgeBase
from .matcher import FAQMatcher


class FAQAssistant:
    """A simple AI-inspired FAQ chatbot."""

    def __init__(
        self,
        faq_path: Path,
        config: AssistantConfig | None = None,
    ) -> None:
        self.config = config or AssistantConfig()
        self.knowledge_base = FAQKnowledgeBase(faq_path)
        self.knowledge_base.load()
        self.matcher = FAQMatcher(self.knowledge_base.entries)

    def should_exit(self, user_input: str) -> bool:
        """Return True when the user wants to end the conversation."""
        return user_input.strip().lower() in self.config.exit_phrases

    def get_response_payload(
        self, user_input: str
    ) -> dict[str, str | float | None]:
        """Generate structured response payload for API and UI clients."""
        cleaned_input = user_input.strip()
        if not cleaned_input:
            return {
                "status": "empty",
                "message": "Please type a question so I can help you.",
                "matched_question": None,
                "confidence": None,
            }

        if cleaned_input.lower() in {"hi", "hello", "hey"}:
            return {
                "status": "greeting",
                "message": self.config.greeting_response,
                "matched_question": None,
                "confidence": None,
            }

        best_entry, confidence = self.matcher.find_best_match(cleaned_input)
        if best_entry and confidence >= self.config.confidence_threshold:
            return {
                "status": "matched",
                "message": best_entry.answer,
                "matched_question": best_entry.question,
                "confidence": round(confidence, 2),
            }

        return {
            "status": "fallback",
            "message": self.config.fallback_response,
            "matched_question": None,
            "confidence": None,
        }

    def get_response(self, user_input: str) -> str:
        """Generate response using FAQ matching and fallback strategy."""
        payload = self.get_response_payload(user_input)
        if payload["status"] == "matched":
            matched_question = payload["matched_question"]
            confidence = float(payload["confidence"])
            return (
                f"Answer: {payload['message']}\n"
                f"(Matched FAQ: '{matched_question}' | "
                f"confidence={confidence:.2f})"
            )

        return str(payload["message"])
