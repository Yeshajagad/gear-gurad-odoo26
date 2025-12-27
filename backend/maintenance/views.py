from django.shortcuts import render

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import MaintenanceTeam, Technician, Equipment, MaintenanceRequest
from .serializers import (
    UserSerializer, MaintenanceTeamSerializer, TechnicianSerializer,
    EquipmentSerializer, MaintenanceRequestSerializer, MaintenanceRequestCreateSerializer
)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class MaintenanceTeamViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceTeam.objects.all()
    serializer_class = MaintenanceTeamSerializer

    @action(detail=True, methods=['get'])
    def technicians(self, request, pk=None):
        team = self.get_object()
        technicians = team.technicians.all()
        serializer = TechnicianSerializer(technicians, many=True)
        return Response(serializer.data)


class TechnicianViewSet(viewsets.ModelViewSet):
    queryset = Technician.objects.all()
    serializer_class = TechnicianSerializer


class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer

    @action(detail=True, methods=['get'])
    def maintenance_requests(self, request, pk=None):
        equipment = self.get_object()
        requests = equipment.maintenance_requests.all()
        serializer = MaintenanceRequestSerializer(requests, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_department(self, request):
        department = request.query_params.get('department', None)
        if department:
            equipment = self.queryset.filter(department=department)
            serializer = self.get_serializer(equipment, many=True)
            return Response(serializer.data)
        return Response({'error': 'Department parameter required'}, status=400)


class MaintenanceRequestViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceRequest.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return MaintenanceRequestCreateSerializer
        return MaintenanceRequestSerializer

    @action(detail=True, methods=['patch'])
    def update_stage(self, request, pk=None):
        maintenance_request = self.get_object()
        new_stage = request.data.get('stage')
        
        if new_stage:
            maintenance_request.stage = new_stage
            
            # Auto-complete logic
            if new_stage == 'REPAIRED':
                from django.utils import timezone
                maintenance_request.completed_date = timezone.now()
            
            maintenance_request.save()
            serializer = self.get_serializer(maintenance_request)
            return Response(serializer.data)
        
        return Response({'error': 'Stage is required'}, status=400)

    @action(detail=True, methods=['patch'])
    def assign_technician(self, request, pk=None):
        maintenance_request = self.get_object()
        technician_id = request.data.get('technician_id')
        
        if technician_id:
            try:
                technician = Technician.objects.get(id=technician_id)
                maintenance_request.assigned_technician = technician
                maintenance_request.save()
                serializer = self.get_serializer(maintenance_request)
                return Response(serializer.data)
            except Technician.DoesNotExist:
                return Response({'error': 'Technician not found'}, status=404)
        
        return Response({'error': 'Technician ID is required'}, status=400)

    @action(detail=False, methods=['get'])
    def by_stage(self, request):
        stage = request.query_params.get('stage', None)
        if stage:
            requests = self.queryset.filter(stage=stage)
            serializer = self.get_serializer(requests, many=True)
            return Response(serializer.data)
        return Response({'error': 'Stage parameter required'}, status=400)

    @action(detail=False, methods=['get'])
    def by_team(self, request):
        team_id = request.query_params.get('team_id', None)
        if team_id:
            requests = self.queryset.filter(maintenance_team_id=team_id)
            serializer = self.get_serializer(requests, many=True)
            return Response(serializer.data)
        return Response({'error': 'Team ID parameter required'}, status=400)

    @action(detail=False, methods=['get'])
    def calendar(self, request):
        # Get all preventive maintenance requests with scheduled dates
        requests = self.queryset.filter(
            request_type='PREVENTIVE',
            scheduled_date__isnull=False
        )
        serializer = self.get_serializer(requests, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        from django.db.models import Count, Q
        
        stats = {
            'total_requests': self.queryset.count(),
            'by_stage': dict(self.queryset.values_list('stage').annotate(count=Count('id'))),
            'by_type': dict(self.queryset.values_list('request_type').annotate(count=Count('id'))),
            'by_priority': dict(self.queryset.values_list('priority').annotate(count=Count('id'))),
            'overdue': self.queryset.filter(
                scheduled_date__lt=timezone.now(),
                stage__in=['NEW', 'IN_PROGRESS']
            ).count()
        }
        
        return Response(stats)
