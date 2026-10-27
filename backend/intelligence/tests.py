from django.test import SimpleTestCase

from chatbot.evidence import retrieve_cv_evidence
from intelligence.utils import analyze_fit, evaluate_interview_answer


class CareerIntelligenceUtilityTests(SimpleTestCase):
    def test_analysis_reports_matched_terms_and_evidence(self):
        cv = "Built Python and Django APIs for a data analytics platform."
        job = "Seeking a Python Django engineer with API development experience."

        result = analyze_fit(cv, job)

        self.assertGreater(result["match_score"], 0)
        self.assertIn("python", result["strengths"])
        self.assertTrue(result["evidence"])

    def test_evidence_returns_stable_cv_identifiers(self):
        evidence = retrieve_cv_evidence("Python developer with Django API experience.", "What Python experience is listed?")

        self.assertEqual(evidence[0]["id"], "CV-1")

    def test_interview_feedback_rewards_specific_signals(self):
        result = evaluate_interview_answer("I led a Python API migration and reduced latency by 30%.", ["specific context", "actions taken", "measurable outcome", "python"])

        self.assertGreaterEqual(result["score"], 25)
        self.assertIn("Score:", result["feedback"])
