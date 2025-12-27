from rest_framework import viewsets
from .models import MaintenanceTeam, TeamMember
from .serializers import MaintenanceTeamSerializer, TeamMemberSerializer


class MaintenanceTeamViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceTeam.objects.all()
    serializer_class = MaintenanceTeamSerializer


class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    