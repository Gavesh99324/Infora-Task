# AI FAQ Assistant

A complete beginner-friendly FAQ chatbot with:

- Python backend (chatbot engine + API)
- React.js + MUI frontend 

## Features

- Responsive React + MUI chat interface
- FastAPI backend with chat endpoint
- FAQ data loaded from JSON
- AI-style intent matching with confidence scoring
- Fallback response for unknown questions
- Suggested FAQ chips in UI
- CLI mode still available
- Unit tests for chatbot behavior

## Tech Stack

- Backend: Python 3.10+, FastAPI, Uvicorn
- Frontend: React (Vite), MUI
- Testing: pytest

## Project Structure

```text
.
|-- data/
|   `-- faqs.json
|-- frontend/
|   |-- index.html
|   |-- package.json
|   |-- vite.config.js
|   `-- src/
|       |-- App.jsx
|       |-- main.jsx
|       `-- theme.js
|-- src/
|   `-- faq_assistant/
|       |-- api.py
|       |-- chatbot.py
|       |-- cli.py
|       |-- config.py
|       |-- knowledge_base.py
|       |-- matcher.py
|       |-- models.py
|       `-- run_api.py
|-- tests/
|   |-- test_chatbot.py
|   `-- test_matcher.py
|-- pyproject.toml
|-- requirements.txt
`-- README.md
```

## Setup

### 1) Backend setup

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 2) Frontend setup

```powershell
cd frontend
npm install
cd ..
```

## Run the App

Open two terminals from project root.

### Terminal A: Start backend API

```powershell
$env:PYTHONPATH="src"
python -m faq_assistant.run_api
```

Backend runs at `http://localhost:8000`.

### Terminal B: Start frontend

```powershell
cd frontend
npm run dev
```

Frontend runs at `http://localhost:5173`.

## API Endpoints

- `GET /health` -> service health check
- `GET /api/faqs` -> returns FAQ questions for suggestion chips
- `POST /api/chat` -> chatbot response payload

Example request:

```json
{
  "message": "What is the selection process?"
}
```

## AI Matching Logic

Final confidence score is a weighted sum:

```text
0.45 * keyword_score + 0.35 * token_overlap + 0.20 * text_similarity
```

If score is below threshold, fallback response is returned.

## CLI Mode (Optional)

```powershell
$env:PYTHONPATH="src"
python -m faq_assistant.cli
```

## Run Tests

```powershell
$env:PYTHONPATH="src"
pytest
```
