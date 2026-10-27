"""Explainable resume/job matching and interview-coaching helpers."""
from __future__ import annotations

import re

from chatbot.evidence import retrieve_cv_evidence

_STOPWORDS = {"about", "and", "are", "for", "from", "have", "into", "must", "our", "that", "the", "this", "with", "you", "your"}


def _terms(text: str) -> set[str]:
    return {term for term in re.findall(r"[a-z0-9+#.-]+", text.lower()) if len(term) > 2 and term not in _STOPWORDS}


def analyze_fit(cv_content: str, job_content: str) -> dict:
    """Compute a reproducible first-pass match score and its supporting evidence."""
    cv_terms, job_terms = _terms(cv_content), _terms(job_content)
    matched = sorted(job_terms & cv_terms)
    missing = sorted(job_terms - cv_terms)
    score = round(100 * len(matched) / max(1, len(job_terms)))
    evidence = retrieve_cv_evidence(cv_content, " ".join(matched), limit=3)
    strengths = matched[:12]
    gaps = missing[:12]
    summary = (
        f"The resume covers {len(matched)} of {len(job_terms)} extracted job terms "
        f"({score}% lexical alignment). Treat this as an explainable screening signal, "
        "not an employment decision; verify the cited experience and the missing requirements."
    )
    return {"match_score": score, "strengths": strengths, "gaps": gaps, "evidence": evidence, "summary": summary}


def next_interview_question(session) -> dict:
    analysis = analyze_fit(session.cv.content, session.job.content)
    focus_terms = analysis["gaps"] or analysis["strengths"] or [session.target_role]
    skill = focus_terms[0]
    return {
        "question": f"Tell me about a project where you applied {skill} in a way relevant to the {session.target_role} role.",
        "rationale": f"Tests evidence for {skill}, a priority term from the target job description.",
        "expected_signals": ["specific context", "actions taken", "measurable outcome", skill],
    }


def evaluate_interview_answer(answer: str, expected_signals: list[str]) -> dict:
    answer_terms = _terms(answer)
    matched = [signal for signal in expected_signals if _terms(signal) & answer_terms]
    score = min(100, 25 + len(matched) * 18 + min(len(answer.split()), 120) // 6)
    missing = [signal for signal in expected_signals if signal not in matched]
    feedback = (
        f"Score: {score}/100. You covered {', '.join(matched) or 'limited role-specific evidence'}. "
        f"Strengthen the answer by adding: {', '.join(missing) or 'a sharper quantified outcome'}."
    )
    return {"score": score, "feedback": feedback}
