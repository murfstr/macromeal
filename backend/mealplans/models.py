from django.db import models
from django.contrib.auth.models import User
from recipes.models import Recipe

class MealPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mealplans')
    name = models.CharField(max_length=255)
    daily_calorie_goal = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class MealPlanDay(models.Model):
    mealplan = models.ForeignKey(MealPlan, on_delete=models.CASCADE, related_name='days')
    date = models.DateField()

    def __str__(self):
        return f"{self.mealplan.name} - {self.date}"

class Meal(models.Model):
    MEAL_TYPES = (
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('dinner', 'Dinner'),
    )
    mealplan_day = models.ForeignKey(MealPlanDay, on_delete=models.CASCADE, related_name='meals')
    meal_type = models.CharField(max_length=10, choices=MEAL_TYPES)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='meals')

    class Meta:
        unique_together = ('mealplan_day', 'meal_type')  # Ensures one meal per type per day

    def __str__(self):
        return f"{self.meal_type.capitalize()} - {self.recipe.name}"
