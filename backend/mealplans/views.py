from rest_framework import viewsets, permissions
from rest_framework.authentication import TokenAuthentication
from .models import MealPlan
from .serializers import MealPlanSerializer

class MealPlanViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MealPlanSerializer

    def get_queryset(self):
        return MealPlan.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
