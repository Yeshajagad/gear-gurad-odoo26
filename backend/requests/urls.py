from django.urls import path
from .views import get_requests, update_stage, statistics

urlpatterns = [
    path('', get_requests),
    path('statistics/', statistics),
    path('<int:id>/update_stage/', update_stage),
]
