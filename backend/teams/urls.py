from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MaintenanceTeamViewSet, TeamMemberViewSet

router = DefaultRouter()
router.register(r'teams', MaintenanceTeamViewSet, basename='team')
router.register(r'members', TeamMemberViewSet, basename='member')

urlpatterns = [
    path('', include(router.urls)),
]