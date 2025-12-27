from rest_framework import serializers
from .models import MaintenanceTeam, TeamMember


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = '__all__'


class MaintenanceTeamSerializer(serializers.ModelSerializer):
    members_details = TeamMemberSerializer(source='members', many=True, read_only=True)
    member_count = serializers.SerializerMethodField()
    
    class Meta:
        model = MaintenanceTeam
        fields = '__all__'
    
    def get_member_count(self, obj):
        return obj.members.count()