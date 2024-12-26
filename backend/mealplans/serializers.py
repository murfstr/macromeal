# serializers.py
from rest_framework import serializers
from .models import MealPlan, MealPlanDay, Meal
from recipes.serializers import RecipeSerializer
from recipes.models import Recipe

class MealSerializer(serializers.ModelSerializer):
    recipe = RecipeSerializer(read_only=True)
    recipe_id = serializers.PrimaryKeyRelatedField(
        queryset=Recipe.objects.all(),
        source='recipe',
        write_only=True,
        required=False
    )
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Meal
        fields = ['id', 'meal_type', 'recipe', 'recipe_id']
        read_only_fields = ['recipe']

    def create(self, validated_data):
        return Meal.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.meal_type = validated_data.get('meal_type', instance.meal_type)
        if 'recipe' in validated_data:
            instance.recipe = validated_data['recipe']
        instance.save()
        return instance

class MealPlanDaySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    meals = MealSerializer(many=True)

    class Meta:
        model = MealPlanDay
        fields = ['id', 'date', 'meals']

    def create(self, validated_data):
        meals_data = validated_data.pop('meals', [])
        mealplan_day = MealPlanDay.objects.create(**validated_data)
        for meal_data in meals_data:
            MealSerializer().create({'mealplan_day': mealplan_day, **meal_data})
        return mealplan_day

    def update(self, instance, validated_data):
        meals_data = validated_data.pop('meals', None)
        instance.date = validated_data.get('date', instance.date)
        instance.save()

        if meals_data is not None:
            for meal_data in meals_data:
                meal_id = meal_data.get('id', None)
                if meal_id:
                    try:
                        meal_instance = Meal.objects.get(id=meal_id, mealplan_day=instance)
                        MealSerializer().update(meal_instance, meal_data)
                    except Meal.DoesNotExist:
                        raise serializers.ValidationError(f"Meal with id {meal_id} does not exist.")
                else:
                    MealSerializer().create({'mealplan_day': instance, **meal_data})
        return instance

class MealPlanSerializer(serializers.ModelSerializer):
    days = MealPlanDaySerializer(many=True)

    class Meta:
        model = MealPlan
        fields = ['id', 'user', 'name', 'daily_calorie_goal', 'created_at', 'days']
        read_only_fields = ['id', 'user', 'created_at']

    def create(self, validated_data):
        days_data = validated_data.pop('days', [])
        mealplan = MealPlan.objects.create(user=self.context['request'].user, **validated_data)
        for day_data in days_data:
            MealPlanDaySerializer().create({'mealplan': mealplan, **day_data})
        return mealplan

    def update(self, instance, validated_data):
        days_data = validated_data.pop('days', None)
        instance.name = validated_data.get('name', instance.name)
        instance.daily_calorie_goal = validated_data.get('daily_calorie_goal', instance.daily_calorie_goal)
        instance.save()

        if days_data is not None:
            for day_data in days_data:
                day_id = day_data.get('id', None)
                if day_id:
                    try:
                        day_instance = MealPlanDay.objects.get(id=day_id, mealplan=instance)
                        day_serializer = MealPlanDaySerializer(day_instance, data=day_data, partial=True)
                        if day_serializer.is_valid():
                            day_serializer.save()
                        else:
                            raise serializers.ValidationError(day_serializer.errors)
                    except MealPlanDay.DoesNotExist:
                        raise serializers.ValidationError(f"Day with id {day_id} does not exist.")
                else:
                    MealPlanDaySerializer().create({'mealplan': instance, **day_data})
        return instance
