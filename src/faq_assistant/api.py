"""FastAPI service for FAQ Assistant."""

from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .chatbot import FAQAssistant

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_FAQ_PATH = PROJECT_ROOT / "data" / "faqs.json"

assistant = FAQAssistant(DEFAULT_FAQ_PATH)

app = FastAPI(title="Infora FAQ Assistant API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    """Incoming chat request payload."""

    message: str = Field(min_length=1, max_length=500)


class ChatResponse(BaseModel):
    """Outgoing chatbot payload for UI rendering."""

    status: str
    message: str
    matched_question: str | None = None
    confidence: float | None = None


@app.get("/health")
def health() -> dict[str, str]:
    """Liveness endpoint."""
    return {"status": "ok"}


@app.get("/api/faqs")
def list_faqs() -> dict[str, list[dict[str, str]]]:
    """Return FAQ questions for suggested prompts in UI."""
    faqs = [
        {"id": entry.id, "question": entry.question}
        for entry in assistant.knowledge_base.entries
    ]
    return {"faqs": faqs}


@app.post("/api/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    """Return chatbot response with optional match metadata."""
    result = assistant.get_response_payload(payload.message)
    return ChatResponse(**result)
