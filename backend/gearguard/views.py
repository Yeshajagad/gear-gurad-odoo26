from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "message": "GearGuard API is running",
        "endpoints": [
            "/api/equipment/",
            "/api/teams/",
            "/api/maintenance/"
        ]
    })
