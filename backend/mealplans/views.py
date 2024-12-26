# views.py
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
)
from .models import MealPlan, MealPlanDay, Meal
from .serializers import MealPlanSerializer
from integrations.services.api_clients import fetch_random_spoonacular_recipes
from recipes.models import Recipe
from datetime import timedelta, date
import logging

logger = logging.getLogger(__name__)

@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def mealplans_list_create(request):
    if request.method == 'GET':
        mealplans = MealPlan.objects.filter(user=request.user)
        serializer = MealPlanSerializer(mealplans, many=True, context={'request': request})
        return Response(serializer.data, status=HTTP_200_OK)

    elif request.method == 'POST':
        serializer = MealPlanSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()  # create with user from context
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def mealplans_detail(request, pk):
    try:
        mealplan = MealPlan.objects.get(pk=pk, user=request.user)
    except MealPlan.DoesNotExist:
        return Response({"detail": "Not found."}, status=HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = MealPlanSerializer(mealplan, context={'request': request})
        return Response(serializer.data, status=HTTP_200_OK)
    
    elif request.method in ['PUT', 'PATCH']:
        # Determine if the request is a partial update
        partial = request.method == 'PATCH'
        serializer = MealPlanSerializer(
            mealplan, 
            data=request.data, 
            partial=partial, 
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        # Log the serializer errors for debugging
        logger.error(f"Serializer errors on {'PATCH' if partial else 'PUT'}: {serializer.errors}")
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        mealplan.delete()
        return Response(status=HTTP_204_NO_CONTENT)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def random_mealplan(request):
    try:
        # Define meal types
        meal_types = ['breakfast', 'lunch', 'dinner']
        recipes = {}

        for meal_type in meal_types:
            # Fetch one random recipe for each meal type
            spoon_data = fetch_random_spoonacular_recipes(
                count=1,
                tags=meal_type  # Use specific tag for meal type
            )
            if not spoon_data:
                error_msg = f"No recipes found for {meal_type}."
                logger.warning(error_msg)
                return Response(
                    {"error": error_msg},
                    status=HTTP_400_BAD_REQUEST
                )
            recipe_data = spoon_data[0]
            # Get or create the Recipe
            recipe, created = Recipe.objects.get_or_create(
                name=recipe_data['title'],
                defaults={
                    "description": recipe_data.get('summary', 'No description provided.'),
                    "calories": calculate_calories(recipe_data),
                    # Add other fields as necessary
                }
            )
            recipes[meal_type] = recipe

        # Create a new MealPlan
        mealplan = MealPlan.objects.create(
            user=request.user,
            name="Random Meal Plan",
            daily_calorie_goal=2000  # Adjust as needed or make dynamic
        )

        # Determine the date for the meal plan day
        next_day = get_next_available_date(mealplan)

        # Create MealPlanDay
        mealplan_day = MealPlanDay.objects.create(
            mealplan=mealplan,
            date=next_day
        )

        # Create Meals
        for meal_type, recipe in recipes.items():
            Meal.objects.create(
                mealplan_day=mealplan_day,
                meal_type=meal_type,
                recipe=recipe
            )

        # Serialize and return the MealPlan
        serializer = MealPlanSerializer(mealplan, context={'request': request})
        return Response(serializer.data, status=HTTP_201_CREATED)

    except Exception as e:
        logger.exception("Error generating random meal plan.")
        # During development, return detailed error
        return Response(
            {"error": f"An error occurred: {str(e)}"},
            status=HTTP_400_BAD_REQUEST
        )

def calculate_calories(recipe_data):
    nutrition = recipe_data.get('nutrition', {})
    calories = 0
    # Spoonacular may provide calories in different ways; adjust accordingly
    calories_data = nutrition.get('nutrients', [])
    for nutrient in calories_data:
        if nutrient.get('name') == 'Calories':
            calories = nutrient.get('amount', 0)
            break
    return int(calories)

def get_next_available_date(mealplan):
    if mealplan.days.exists():
        last_day = mealplan.days.order_by('-date').first()
        return last_day.date + timedelta(days=1)
    else:
        return date.today()
