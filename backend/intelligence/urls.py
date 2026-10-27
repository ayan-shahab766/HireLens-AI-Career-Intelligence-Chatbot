from rest_framework.routers import DefaultRouter

from .views import InterviewSessionViewSet, JobDescriptionViewSet, MatchAnalysisViewSet

router = DefaultRouter()
router.register(r"jobs", JobDescriptionViewSet, basename="job")
router.register(r"analyses", MatchAnalysisViewSet, basename="analysis")
router.register(r"interviews", InterviewSessionViewSet, basename="interview")

urlpatterns = router.urls
