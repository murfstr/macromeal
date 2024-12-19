from rest_framework import serializers
from .models import MealPlan, MealPlanDay
from recipes.serializers import RecipeSerializer

class MealPlanDaySerializer(serializers.ModelSerializer):
    # Nested recipes
    recipes = RecipeSerializer(many=True, read_only=True)
    recipe_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)

    class Meta:
        model = MealPlanDay
        fields = ['id', 'date', 'recipes', 'recipe_ids']

    def update(self, instance, validated_data):
        recipe_ids = validated_data.pop('recipe_ids', None)
        if recipe_ids is not None:
            # Update the recipes m2m
            # Filter only user's recipes or handle errors if recipes not found
            user = self.context['request'].user
            recipes = user.recipes.filter(id__in=recipe_ids)
            instance.recipes.set(recipes)
        return super().update(instance, validated_data)

    def create(self, validated_data):
        recipe_ids = validated_data.pop('recipe_ids', [])
        mealplan_day = super().create(validated_data)
        user = self.context['request'].user
        recipes = user.recipes.filter(id__in=recipe_ids)
        mealplan_day.recipes.set(recipes)
        return mealplan_day

class MealPlanSerializer(serializers.ModelSerializer):
    days = MealPlanDaySerializer(many=True, required=False)

    class Meta:
        model = MealPlan
        fields = ['id', 'user', 'name', 'daily_calorie_goal', 'created_at', 'days']
        read_only_fields = ['user', 'created_at']

    def create(self, validated_data):
        days_data = validated_data.pop('days', [])
        mealplan = MealPlan.objects.create(user=self.context['request'].user, **validated_data)
        for day_data in days_data:
            MealPlanDay.objects.create(mealplan=mealplan, **day_data)
        return mealplan

    def update(self, instance, validated_data):
        days_data = validated_data.pop('days', None)
        instance = super().update(instance, validated_data)
        if days_data is not None:
            # Update meal plan days
            for day_data in days_data:
                day_id = day_data.get('id', None)
                if day_id:
                    # Update existing day
                    day_instance = instance.days.get(id=day_id)
                    serializer = MealPlanDaySerializer(day_instance, data=day_data, context=self.context, partial=True)
                    serializer.is_valid(raise_exception=True)
                    serializer.save()
                else:
                    # Create new day
                    MealPlanDay.objects.create(mealplan=instance, **day_data)
        return instance
