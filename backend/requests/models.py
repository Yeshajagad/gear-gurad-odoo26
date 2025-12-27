from django.db import models

# Create your models here.
from django.db import models
from equipment.models import Equipment

class MaintenanceRequest(models.Model):
    STAGES = [
        ('NEW', 'New'),
        ('IN_PROGRESS', 'In Progress'),
        ('REPAIRED', 'Repaired'),
        ('SCRAP', 'Scrap'),
    ]

    PRIORITIES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    ]

    subject = models.CharField(max_length=200)
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    stage = models.CharField(max_length=20, choices=STAGES, default='NEW')
    priority = models.CharField(max_length=20, choices=PRIORITIES)
    scheduled_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.subject
