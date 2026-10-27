from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from cvs.models import CV

from .models import InterviewQuestion, InterviewSession, JobDescription, MatchAnalysis
from .serializers import (
    InterviewQuestionSerializer,
    InterviewSessionSerializer,
    JobDescriptionSerializer,
    MatchAnalysisSerializer,
)
from .utils import analyze_fit, evaluate_interview_answer, next_interview_question


class OwnedModelViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class JobDescriptionViewSet(OwnedModelViewSet):
    serializer_class = JobDescriptionSerializer

    def get_queryset(self):
        return JobDescription.objects.filter(user=self.request.user)


class MatchAnalysisViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MatchAnalysisSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MatchAnalysis.objects.filter(user=self.request.user)

    @action(detail=False, methods=["post"])
    def analyze(self, request):
        cv_id, job_id = request.data.get("cv"), request.data.get("job")
        try:
            cv = CV.objects.get(pk=cv_id, user=request.user, is_processed=True)
            job = JobDescription.objects.get(pk=job_id, user=request.user)
        except (CV.DoesNotExist, JobDescription.DoesNotExist):
            return Response({"error": "Processed CV and job description are required."}, status=status.HTTP_400_BAD_REQUEST)

        result = analyze_fit(cv.content, job.content)
        analysis = MatchAnalysis.objects.create(user=request.user, cv=cv, job=job, **result)
        return Response(MatchAnalysisSerializer(analysis).data, status=status.HTTP_201_CREATED)


class InterviewSessionViewSet(OwnedModelViewSet):
    serializer_class = InterviewSessionSerializer

    def get_queryset(self):
        return InterviewSession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        cv = serializer.validated_data["cv"]
        job = serializer.validated_data["job"]
        if cv.user_id != self.request.user.id or job.user_id != self.request.user.id:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("The selected CV and job description must belong to you.")
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def next_question(self, request, pk=None):
        session = self.get_object()
        payload = next_interview_question(session)
        question = InterviewQuestion.objects.create(session=session, **payload)
        return Response(InterviewQuestionSerializer(question).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], url_path="questions/(?P<question_id>[^/.]+)/answer")
    def answer_question(self, request, pk=None, question_id=None):
        session = self.get_object()
        answer = str(request.data.get("answer", "")).strip()
        if not answer:
            return Response({"error": "An answer is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            question = session.questions.get(pk=question_id)
        except InterviewQuestion.DoesNotExist:
            return Response({"error": "Question not found."}, status=status.HTTP_404_NOT_FOUND)
        evaluation = evaluate_interview_answer(answer, question.expected_signals)
        question.answer = answer
        question.score = evaluation["score"]
        question.feedback = evaluation["feedback"]
        question.save(update_fields=["answer", "score", "feedback"])
        return Response(InterviewQuestionSerializer(question).data)
