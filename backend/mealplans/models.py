from django.db import models
from django.contrib.auth.models import User
from recipes.models import Recipe

class MealPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mealplans', null=True, blank=True)
    name = models.CharField(max_length=255)
    daily_calorie_goal = models.IntegerField(default=2000)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class MealPlanDay(models.Model):
    mealplan = models.ForeignKey(MealPlan, on_delete=models.CASCADE, related_name='days')
    date = models.DateField()
    recipes = models.ManyToManyField(Recipe, related_name='mealplan_days', blank=True)

    def __str__(self):
        return f"{self.mealplan.name} - {self.date}"
