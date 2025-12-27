from django.contrib import admin
from .models import MaintenanceTeam, TeamMember


@admin.register(MaintenanceTeam)
class MaintenanceTeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'team_type', 'created_at']
    list_filter = ['team_type']


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ['user', 'team', 'role', 'is_team_leader']
    list_filter = ['team']