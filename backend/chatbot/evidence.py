"""Small, dependency-free retrieval layer for evidence-grounded CV answers."""
from __future__ import annotations

import re

_STOPWORDS = {"about", "after", "and", "are", "for", "from", "have", "into", "is", "of", "the", "this", "to", "what", "with"}


def _terms(text: str) -> set[str]:
    return {term for term in re.findall(r"[a-z0-9+#.-]+", text.lower()) if len(term) > 2 and term not in _STOPWORDS}


def retrieve_cv_evidence(cv_content: str, question: str, limit: int = 3) -> list[dict]:
    """Rank resume chunks by lexical relevance and expose stable citation IDs."""
    query_terms = _terms(question)
    sections = [section.strip() for section in re.split(r"\n\s*\n", cv_content) if section.strip()]
    chunks = [
        section[start:start + 700]
        for section in sections
        for start in range(0, len(section), 700)
    ]
    ranked = []
    for index, chunk in enumerate(chunks, start=1):
        overlap = len(query_terms & _terms(chunk))
        ranked.append((overlap, index, chunk))
    ranked.sort(key=lambda item: item[0], reverse=True)
    return [
        {
            "id": f"CV-{index}",
            "source": "resume",
            "excerpt": chunk[:600],
            "relevance": score,
        }
        for score, index, chunk in ranked[:limit]
        if score > 0
    ]
