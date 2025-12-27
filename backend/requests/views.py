from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import MaintenanceRequest
from .serializers import MaintenanceRequestSerializer

@api_view(['GET'])
def get_requests(request):
    data = MaintenanceRequest.objects.all()
    return Response(MaintenanceRequestSerializer(data, many=True).data)

@api_view(['PATCH'])
def update_stage(request, id):
    req = MaintenanceRequest.objects.get(id=id)
    req.stage = request.data.get('stage')
    req.save()
    return Response({"status": "updated"})

@api_view(['GET'])
def statistics(request):
    qs = MaintenanceRequest.objects.all()
    return Response({
        "total_requests": qs.count(),
        "by_stage": {
            "NEW": qs.filter(stage='NEW').count(),
            "IN_PROGRESS": qs.filter(stage='IN_PROGRESS').count(),
        }
    })
