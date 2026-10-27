# HireLens — AI Career Intelligence Chatbot

HireLens is a full-stack AI career intelligence chatbot that turns a resume and a target job description into an explainable role-fit analysis, evidence-grounded CV chat, and interview-practice workflow.

## What makes it different

- **Evidence-grounded resume chat**: questions are answered from relevant resume chunks and return `[CV-n]` source citations.
- **Explainable role-fit analysis**: a deterministic lexical matching pipeline reports an alignment score, matched signals, missing requirements, and supporting resume excerpts.
- **Interview readiness lab**: generates role-specific practice questions from the CV/job pair and evaluates answers against explicit expected signals.
- **Privacy-aware ownership model**: JWT-protected resources are scoped to the authenticated user; uploads are restricted to PDF/DOCX and capped at 8 MB.
- **Separation of concerns**: React/Redux client, Django REST API, Gemini generation layer, and dedicated career-intelligence domain models.

## Architecture

```text
PDF/DOCX Resume ──> text extraction ──> chunk-level evidence retrieval ──┐
                                                                         ├─> cited CV chat
Job Description ──> requirement term extraction ──> fit analysis ──────┤
                                                                         └─> interview question + answer rubric
```

The initial role-fit score is an explainable lexical-alignment signal, not an automated hiring decision. Users should review the cited material and make their own decisions.

## Stack

- Frontend: React, Redux Toolkit, React Router, Tailwind CSS, Axios
- Backend: Django 5, Django REST Framework, JWT authentication, PostgreSQL/SQLite
- AI: Gemini API for CV chat; deterministic retrieval and scoring for auditable job matching

## API highlights

| Endpoint | Purpose |
| --- | --- |
| `POST /api/cvs/` | Upload a PDF or DOCX resume. |
| `POST /api/chatbot/sessions/{id}/ask/` | Ask a cited question about a resume. |
| `POST /api/intelligence/jobs/` | Store a target job description. |
| `POST /api/intelligence/analyses/analyze/` | Create an evidence-grounded CV/job analysis. |
| `POST /api/intelligence/interviews/{id}/next_question/` | Generate an interview-practice question. |
| `POST /api/intelligence/interviews/{id}/questions/{question_id}/answer/` | Score and coach an interview answer. |

## Local setup

### Backend

```bash
cd backend
python -m venv venv
# Windows: .\venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
copy .env.example .env  # Windows
python manage.py migrate
python manage.py runserver
```

Set `GEMINI_API_KEY` in `backend/.env` to enable generative CV chat. The role-fit analysis and interview feedback have deterministic fallbacks and do not require model training.

### Frontend

```bash
cd frontend
npm install
copy .env.example .env  # Windows
npm start
```

## Project structure

```text
backend/
  chatbot/        # cited CV-chat sessions
  cvs/            # resume upload and extraction
  intelligence/   # job descriptions, analyses, interview coaching
  hirelens_rag/   # Django configuration and routes
frontend/
  src/components/pages/CareerIntelligence.js  # Role Fit & Interview Lab
```

## Responsible use

HireLens is a career-preparation tool. It must not be used to automatically rank, reject, or make employment decisions about people.

## License and attribution

This codebase began from the public `Saadidream/CV-Chatbot` project. Confirm its license and retain required attribution before publishing or distributing a derivative.
