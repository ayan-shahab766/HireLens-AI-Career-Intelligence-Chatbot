from rest_framework import serializers

from .models import InterviewQuestion, InterviewSession, JobDescription, MatchAnalysis


class JobDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobDescription
        fields = ("id", "title", "company", "content", "created_at", "updated_at")
        read_only_fields = ("created_at", "updated_at")


class MatchAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchAnalysis
        fields = ("id", "cv", "job", "match_score", "strengths", "gaps", "evidence", "summary", "created_at")
        read_only_fields = ("id", "match_score", "strengths", "gaps", "evidence", "summary", "created_at")


class InterviewQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewQuestion
        fields = ("id", "question", "rationale", "expected_signals", "answer", "feedback", "score", "created_at")
        read_only_fields = ("id", "question", "rationale", "expected_signals", "feedback", "score", "created_at")


class InterviewSessionSerializer(serializers.ModelSerializer):
    questions = InterviewQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = InterviewSession
        fields = ("id", "cv", "job", "target_role", "focus", "questions", "created_at", "updated_at")
        read_only_fields = ("id", "questions", "created_at", "updated_at")
