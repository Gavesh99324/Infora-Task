from pathlib import Path

from faq_assistant.chatbot import FAQAssistant


def test_should_exit() -> None:
    assistant = FAQAssistant(Path("data/faqs.json"))

    assert assistant.should_exit("exit") is True
    assert assistant.should_exit("bye") is True
    assert assistant.should_exit("continue") is False


def test_empty_input_message() -> None:
    assistant = FAQAssistant(Path("data/faqs.json"))

    response = assistant.get_response("   ")

    assert "type a question" in response.lower()
