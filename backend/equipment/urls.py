from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EquipmentViewSet, DepartmentViewSet

router = DefaultRouter()
router.register(r'', EquipmentViewSet, basename='equipment')
router.register(r'departments', DepartmentViewSet, basename='department')

urlpatterns = [
    path('', include(router.urls)),
]