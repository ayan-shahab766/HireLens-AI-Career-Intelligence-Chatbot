import google.generativeai as genai
from django.conf import settings
from .evidence import retrieve_cv_evidence

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

def get_ai_response(cv_content, question):
    """
    Get AI response based on CV content and user question.
    """
    citations = retrieve_cv_evidence(cv_content, question)
    context = "\n\n".join(f"[{item['id']}] {item['excerpt']}" for item in citations)
    prompt = f"""
    You are an AI assistant that answers questions about the CV/resume provided.
    Please provide accurate, helpful, and concise responses. Cite factual claims using
    the available [CV-n] evidence identifiers. Do not invent experience or qualifications.
    
    RETRIEVED CV EVIDENCE:
    {context or cv_content[:4000]}
    
    USER QUESTION:
    {question}
    
    Please answer the question based only on the information provided in the CV.
    If the information isn't in the CV, kindly state that it's not mentioned.
    """
    
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(prompt)
        return {"answer": response.text, "citations": citations}
    except Exception as e:
        print(f"Error generating AI response: {e}")
        return {
            "answer": "I'm sorry, I couldn't process your request. Please try again later.",
            "citations": citations,
        }
