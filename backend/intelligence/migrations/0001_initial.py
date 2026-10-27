from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("cvs", "0001_initial"),
    ]
    operations = [
        migrations.CreateModel(
            name="JobDescription",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=255)),
                ("company", models.CharField(blank=True, max_length=255)),
                ("content", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="job_descriptions", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ["-updated_at"]},
        ),
        migrations.CreateModel(
            name="InterviewSession",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("target_role", models.CharField(max_length=255)),
                ("focus", models.CharField(default="mixed", max_length=100)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("cv", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="interview_sessions", to="cvs.cv")),
                ("job", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="interview_sessions", to="intelligence.jobdescription")),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="interview_sessions", to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name="MatchAnalysis",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("match_score", models.PositiveSmallIntegerField()),
                ("strengths", models.JSONField(default=list)),
                ("gaps", models.JSONField(default=list)),
                ("evidence", models.JSONField(default=list)),
                ("summary", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("cv", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="match_analyses", to="cvs.cv")),
                ("job", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="match_analyses", to="intelligence.jobdescription")),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="match_analyses", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.CreateModel(
            name="InterviewQuestion",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("question", models.TextField()),
                ("rationale", models.TextField(blank=True)),
                ("expected_signals", models.JSONField(default=list)),
                ("answer", models.TextField(blank=True)),
                ("feedback", models.TextField(blank=True)),
                ("score", models.PositiveSmallIntegerField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("session", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="questions", to="intelligence.interviewsession")),
            ],
        ),
    ]
