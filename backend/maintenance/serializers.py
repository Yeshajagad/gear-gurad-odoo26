from rest_framework import serializers
from django.contrib.auth.models import User
from .models import MaintenanceTeam, Technician, Equipment, MaintenanceRequest


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name']

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username


class MaintenanceTeamSerializer(serializers.ModelSerializer):
    technician_count = serializers.SerializerMethodField()

    class Meta:
        model = MaintenanceTeam
        fields = ['id', 'name', 'description', 'technician_count', 'created_at', 'updated_at']

    def get_technician_count(self, obj):
        return obj.technicians.count()


class TechnicianSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )
    team_name = serializers.CharField(source='team.name', read_only=True)

    class Meta:
        model = Technician
        fields = ['id', 'user', 'user_id', 'team', 'team_name', 'phone', 'specialization', 'created_at']


class EquipmentSerializer(serializers.ModelSerializer):
    maintenance_team_name = serializers.CharField(source='maintenance_team.name', read_only=True)
    default_technician_name = serializers.SerializerMethodField()
    request_count = serializers.SerializerMethodField()
    open_request_count = serializers.SerializerMethodField()

    class Meta:
        model = Equipment
        fields = [
            'id', 'name', 'serial_number', 'category', 'department', 'assigned_employee',
            'maintenance_team', 'maintenance_team_name', 'default_technician', 
            'default_technician_name', 'purchase_date', 'warranty_expiry', 'location',
            'is_scrapped', 'notes', 'request_count', 'open_request_count', 'created_at', 'updated_at'
        ]

    def get_default_technician_name(self, obj):
        if obj.default_technician:
            return obj.default_technician.user.get_full_name() or obj.default_technician.user.username
        return None

    def get_request_count(self, obj):
        return obj.maintenance_requests.count()

    def get_open_request_count(self, obj):
        return obj.maintenance_requests.exclude(stage__in=['REPAIRED', 'SCRAP']).count()


class MaintenanceRequestSerializer(serializers.ModelSerializer):
    equipment_name = serializers.CharField(source='equipment.name', read_only=True)
    equipment_category = serializers.CharField(source='equipment.category', read_only=True)
    maintenance_team_name = serializers.CharField(source='maintenance_team.name', read_only=True)
    assigned_technician_name = serializers.SerializerMethodField()
    requested_by_name = serializers.SerializerMethodField()
    is_overdue = serializers.SerializerMethodField()

    class Meta:
        model = MaintenanceRequest
        fields = [
            'id', 'subject', 'description', 'equipment', 'equipment_name', 'equipment_category',
            'request_type', 'stage', 'priority', 'maintenance_team', 'maintenance_team_name',
            'assigned_technician', 'assigned_technician_name', 'scheduled_date', 'completed_date',
            'duration_hours', 'requested_by', 'requested_by_name', 'is_overdue',
            'created_at', 'updated_at'
        ]

    def get_assigned_technician_name(self, obj):
        if obj.assigned_technician:
            return obj.assigned_technician.user.get_full_name() or obj.assigned_technician.user.username
        return None

    def get_requested_by_name(self, obj):
        if obj.requested_by:
            return obj.requested_by.get_full_name() or obj.requested_by.username
        return None

    def get_is_overdue(self, obj):
        from django.utils import timezone
        if obj.scheduled_date and obj.stage not in ['REPAIRED', 'SCRAP']:
            return obj.scheduled_date < timezone.now()
        return False

    def create(self, validated_data):
        # Auto-fill logic: Get team and category from equipment
        equipment = validated_data.get('equipment')
        if equipment:
            if not validated_data.get('maintenance_team') and equipment.maintenance_team:
                validated_data['maintenance_team'] = equipment.maintenance_team
            if not validated_data.get('assigned_technician') and equipment.default_technician:
                validated_data['assigned_technician'] = equipment.default_technician
        
        return super().create(validated_data)


class MaintenanceRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceRequest
        fields = [
            'subject', 'description', 'equipment', 'request_type', 'priority',
            'scheduled_date', 'requested_by'
        ]

    def create(self, validated_data):
        equipment = validated_data.get('equipment')
        
        # Auto-fill maintenance team and technician from equipment
        if equipment:
            validated_data['maintenance_team'] = equipment.maintenance_team
            validated_data['assigned_technician'] = equipment.default_technician
        
        return MaintenanceRequest.objects.create(**validated_data)