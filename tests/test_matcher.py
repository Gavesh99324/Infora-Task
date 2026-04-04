from pathlib import Path

from faq_assistant.chatbot import FAQAssistant


def test_matcher_returns_expected_answer_for_known_question() -> None:
    assistant = FAQAssistant(Path("data/faqs.json"))

    response = assistant.get_response("What is your selection process?")

    assert "application review" in response.lower()
    assert "confidence=" in response


def test_matcher_returns_fallback_for_unknown_question() -> None:
    assistant = FAQAssistant(Path("data/faqs.json"))

    response = assistant.get_response("What is the weather in Paris?")

    assert "could not find an exact answer" in response.lower()
