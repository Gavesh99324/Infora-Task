"""Configuration values for the FAQ Assistant."""

from dataclasses import dataclass


@dataclass(frozen=True)
class AssistantConfig:
    """Runtime configuration for matching and fallback behavior."""

    confidence_threshold: float = 0.35
    fallback_response: str = (
        "I could not find an exact answer for that yet. "
        "Please rephrase your question or contact support@infora-demo.com."
    )
    greeting_response: str = (
        "Hello! I am your FAQ Assistant. "
        "Ask me about internship process, timelines, or requirements."
    )
    exit_phrases: tuple[str, ...] = ("exit", "quit", "bye")
