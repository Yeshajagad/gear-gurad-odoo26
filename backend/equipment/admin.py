from django.contrib import admin
from .models import Equipment, Department

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'serial_number', 'category', 'status', 'department']
    list_filter = ['status', 'category', 'department']
    search_fields = ['name', 'serial_number']