from django.db import models
from django.contrib.auth.models import User


class MaintenanceTeam(models.Model):
    TEAM_TYPES = [
        ('mechanics', 'Mechanics'),
        ('electricians', 'Electricians'),
        ('it_support', 'IT Support'),
        ('plumbing', 'Plumbing'),
        ('hvac', 'HVAC'),
    ]
    
    name = models.CharField(max_length=200)
    team_type = models.CharField(max_length=50, choices=TEAM_TYPES)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name


class TeamMember(models.Model):
    team = models.ForeignKey(MaintenanceTeam, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=100, default='Technician')
    is_team_leader = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['team', 'user']
    
    def __str__(self):
        return f"{self.user.username} - {self.team.name}"