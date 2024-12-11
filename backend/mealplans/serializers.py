from rest_framework import serializers
from .models import MealPlan

class MealPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealPlan
        fields = ['id', 'user', 'name', 'daily_calorie_goal', 'created_at']
        read_only_fields = ['user']
