from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, MaintenanceTeamViewSet, TechnicianViewSet,
    EquipmentViewSet, MaintenanceRequestViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'teams', MaintenanceTeamViewSet)
router.register(r'technicians', TechnicianViewSet)
router.register(r'equipment', EquipmentViewSet)
router.register(r'requests', MaintenanceRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]