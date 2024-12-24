# Generated by Django 5.1.4 on 2024-12-19 20:52

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mealplans', '0002_remove_mealplan_meals_mealplan_daily_calorie_goal_and_more'),
        ('recipes', '0002_recipe_user_alter_recipe_calories'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='mealplan',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='mealplans', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='MealPlanDay',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('mealplan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='days', to='mealplans.mealplan')),
                ('recipes', models.ManyToManyField(blank=True, related_name='mealplan_days', to='recipes.recipe')),
            ],
        ),
    ]