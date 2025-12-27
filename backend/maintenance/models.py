from django.db import models

# Create your models here.

from django.db import models
from django.contrib.auth.models import User

class MaintenanceTeam(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Technician(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    team = models.ForeignKey(MaintenanceTeam, on_delete=models.SET_NULL, null=True, related_name='technicians')
    phone = models.CharField(max_length=20, blank=True)
    specialization = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - {self.team.name if self.team else 'No Team'}"

    class Meta:
        ordering = ['user__first_name', 'user__last_name']


class Equipment(models.Model):
    CATEGORY_CHOICES = [
        ('MACHINE', 'Machine'),
        ('VEHICLE', 'Vehicle'),
        ('COMPUTER', 'Computer'),
        ('TOOL', 'Tool'),
        ('OTHER', 'Other'),
    ]

    name = models.CharField(max_length=200)
    serial_number = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='OTHER')
    department = models.CharField(max_length=100, blank=True)
    assigned_employee = models.CharField(max_length=100, blank=True)
    maintenance_team = models.ForeignKey(MaintenanceTeam, on_delete=models.SET_NULL, null=True, related_name='equipment')
    default_technician = models.ForeignKey(Technician, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_equipment')
    purchase_date = models.DateField(null=True, blank=True)
    warranty_expiry = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=200, blank=True)
    is_scrapped = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.serial_number})"

    class Meta:
        ordering = ['name']


class MaintenanceRequest(models.Model):
    REQUEST_TYPE_CHOICES = [
        ('CORRECTIVE', 'Corrective'),
        ('PREVENTIVE', 'Preventive'),
    ]

    STAGE_CHOICES = [
        ('NEW', 'New'),
        ('IN_PROGRESS', 'In Progress'),
        ('REPAIRED', 'Repaired'),
        ('SCRAP', 'Scrap'),
    ]

    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    ]

    subject = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='maintenance_requests')
    request_type = models.CharField(max_length=20, choices=REQUEST_TYPE_CHOICES, default='CORRECTIVE')
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='NEW')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='MEDIUM')
    maintenance_team = models.ForeignKey(MaintenanceTeam, on_delete=models.SET_NULL, null=True, related_name='requests')
    assigned_technician = models.ForeignKey(Technician, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_requests')
    scheduled_date = models.DateTimeField(null=True, blank=True)
    completed_date = models.DateTimeField(null=True, blank=True)
    duration_hours = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    requested_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='requested_maintenances')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.subject} - {self.equipment.name}"

    def save(self, *args, **kwargs):
        # Auto-scrap equipment if request moved to SCRAP stage
        if self.stage == 'SCRAP' and self.equipment:
            self.equipment.is_scrapped = True
            self.equipment.save()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']