from django.contrib.auth.models import User
from django.db import models

from cvs.models import CV


class JobDescription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="job_descriptions")
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255, blank=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]


class MatchAnalysis(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="match_analyses")
    cv = models.ForeignKey(CV, on_delete=models.CASCADE, related_name="match_analyses")
    job = models.ForeignKey(JobDescription, on_delete=models.CASCADE, related_name="match_analyses")
    match_score = models.PositiveSmallIntegerField()
    strengths = models.JSONField(default=list)
    gaps = models.JSONField(default=list)
    evidence = models.JSONField(default=list)
    summary = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class InterviewSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="interview_sessions")
    cv = models.ForeignKey(CV, on_delete=models.CASCADE, related_name="interview_sessions")
    job = models.ForeignKey(JobDescription, on_delete=models.CASCADE, related_name="interview_sessions")
    target_role = models.CharField(max_length=255)
    focus = models.CharField(max_length=100, default="mixed")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class InterviewQuestion(models.Model):
    session = models.ForeignKey(InterviewSession, on_delete=models.CASCADE, related_name="questions")
    question = models.TextField()
    rationale = models.TextField(blank=True)
    expected_signals = models.JSONField(default=list)
    answer = models.TextField(blank=True)
    feedback = models.TextField(blank=True)
    score = models.PositiveSmallIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
