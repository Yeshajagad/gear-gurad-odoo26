from django.contrib import admin
from .models import MaintenanceTeam, Technician, Equipment, MaintenanceRequest

@admin.register(MaintenanceTeam)
class MaintenanceTeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name']

@admin.register(Technician)
class TechnicianAdmin(admin.ModelAdmin):
    list_display = ['user', 'team', 'phone', 'specialization']
    list_filter = ['team']
    search_fields = ['user__username', 'user__first_name', 'user__last_name']

@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'serial_number', 'category', 'department', 'maintenance_team', 'is_scrapped']
    list_filter = ['category', 'maintenance_team', 'is_scrapped']
    search_fields = ['name', 'serial_number', 'department']

@admin.register(MaintenanceRequest)
class MaintenanceRequestAdmin(admin.ModelAdmin):
    list_display = ['subject', 'equipment', 'request_type', 'stage', 'priority', 'assigned_technician', 'scheduled_date']
    list_filter = ['request_type', 'stage', 'priority', 'maintenance_team']
    search_fields = ['subject', 'equipment__name']
    date_hierarchy = 'created_at'