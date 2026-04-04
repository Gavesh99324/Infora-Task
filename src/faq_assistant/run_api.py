"""Run API server entrypoint for local development."""

from __future__ import annotations

import uvicorn


def main() -> None:
    """Run FastAPI app on localhost:8000."""
    uvicorn.run(
        "faq_assistant.api:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
    )


if __name__ == "__main__":
    main()
