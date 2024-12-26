# Generated by Django 5.1.4 on 2024-12-26 02:40

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('recipes', '0003_ingredient_remove_recipe_calories_recipeingredient'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='MealPlan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('daily_calorie_goal', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mealplans', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='MealPlanDay',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('mealplan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='days', to='mealplans.mealplan')),
            ],
        ),
        migrations.CreateModel(
            name='Meal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('meal_type', models.CharField(choices=[('breakfast', 'Breakfast'), ('lunch', 'Lunch'), ('dinner', 'Dinner')], max_length=10)),
                ('recipe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='meals', to='recipes.recipe')),
                ('mealplan_day', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='meals', to='mealplans.mealplanday')),
            ],
            options={
                'unique_together': {('mealplan_day', 'meal_type')},
            },
        ),
    ]
