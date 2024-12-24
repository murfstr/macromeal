from rest_framework import serializers
from .models import MealPlan, MealPlanDay
from recipes.models import Recipe
from recipes.serializers import RecipeSerializer

class MealPlanDaySerializer(serializers.ModelSerializer):
    recipes = RecipeSerializer(many=True, read_only=True)
    recipe_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = MealPlanDay
        fields = ['id', 'date', 'recipes', 'recipe_ids']

    def create(self, validated_data):
        recipe_ids = validated_data.pop('recipe_ids', [])
        day = super().create(validated_data)
        if recipe_ids:
            recipes = Recipe.objects.filter(id__in=recipe_ids)
            day.recipes.set(recipes)
        return day

    def update(self, instance, validated_data):
        recipe_ids = validated_data.pop('recipe_ids', None)
        instance = super().update(instance, validated_data)
        if recipe_ids is not None:
            recipes = Recipe.objects.filter(id__in=recipe_ids)
            instance.recipes.set(recipes)
        return instance

class MealPlanSerializer(serializers.ModelSerializer):
    days = MealPlanDaySerializer(many=True, required=False)

    class Meta:
        model = MealPlan
        fields = ['id', 'user', 'name', 'daily_calorie_goal', 'created_at', 'days']
        read_only_fields = ['user', 'created_at']

    def create(self, validated_data):
        validated_data.pop('user', None)
        days_data = validated_data.pop('days', [])
        mealplan = MealPlan.objects.create(
            user=self.context['request'].user,
            **validated_data
        )
        for day_data in days_data:
            MealPlanDaySerializer().create({**day_data, 'mealplan': mealplan})
        return mealplan

    def update(self, instance, validated_data):
        validated_data.pop('user', None)

        days_data = validated_data.pop('days', None)
        instance = super().update(instance, validated_data)

        if days_data is not None:
            instance.days.all().delete()
            for day_data in days_data:
                MealPlanDaySerializer().create({**day_data, 'mealplan': instance})
        return instance
