# views.py

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND
)
from .models import Recipe, Ingredient
from .serializers import RecipeSerializer, IngredientSerializer
from integrations.services.api_clients import fetch_ingredient_data
import logging

logger = logging.getLogger(__name__)

@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def recipes_list_create(request):
    if request.method == 'GET':
        recipes = Recipe.objects.filter(user=request.user)
        serializer = RecipeSerializer(recipes, many=True, context={'request': request})
        return Response(serializer.data, status=HTTP_200_OK)

    elif request.method == 'POST':
        serializer = RecipeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            recipe = serializer.save()
            return Response(RecipeSerializer(recipe, context={'request': request}).data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def recipes_detail(request, pk):
    try:
        recipe = Recipe.objects.get(pk=pk, user=request.user)
    except Recipe.DoesNotExist:
        return Response({"detail": "Not found."}, status=HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = RecipeSerializer(recipe, context={'request': request})
        return Response(serializer.data, status=HTTP_200_OK)
    elif request.method == 'PUT':
        serializer = RecipeSerializer(recipe, data=request.data, context={'request': request})
        if serializer.is_valid():
            updated_recipe = serializer.save()
            return Response(RecipeSerializer(updated_recipe, context={'request': request}).data, status=HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        recipe.delete()
        return Response(status=HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def ingredients_list_create(request):
    if request.method == 'GET':
        ingredients = Ingredient.objects.filter(user=request.user)
        serializer = IngredientSerializer(ingredients, many=True)
        return Response(serializer.data, status=HTTP_200_OK)
    elif request.method == 'POST':
        serializer = IngredientSerializer(data=request.data)
        if serializer.is_valid():
            ingredient = serializer.save(user=request.user)
            return Response(IngredientSerializer(ingredient).data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_ingredient(request, pk):
    try:
        ingredient = Ingredient.objects.get(pk=pk, user=request.user)
    except Ingredient.DoesNotExist:
        return Response({"detail": "Not found."}, status=HTTP_404_NOT_FOUND)
    ingredient.delete()
    return Response(status=HTTP_204_NO_CONTENT)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_ingredient_by_name(request):
    name = request.data.get('name')
    if not name:
        logger.error("No ingredient name provided in the request.")
        return Response({"detail": "No ingredient name provided."}, status=HTTP_400_BAD_REQUEST)
    try:
        nutri_data = fetch_ingredient_data(name)
        if not nutri_data.get('foods'):
            logger.error(f"No foods found for the ingredient name: {name}")
            return Response({"detail": "No foods found for the provided name."}, status=HTTP_400_BAD_REQUEST)
        
        food = nutri_data['foods'][0]
        ingredient_name = food.get('food_name')
        calories = food.get('nf_calories', 0)
        
        if not ingredient_name:
            logger.error(f"No 'food_name' found in Nutritionix response for: {name}")
            return Response({"detail": "Invalid ingredient data received from Nutritionix."}, status=HTTP_400_BAD_REQUEST)
        
        # Create or get the Ingredient object
        ingredient_obj, created = Ingredient.objects.get_or_create(name=ingredient_name, user=request.user)
        ingredient_obj.calories = int(calories)
        ingredient_obj.save()

        serializer = IngredientSerializer(ingredient_obj)
        return Response(serializer.data, status=HTTP_201_CREATED)
    except Exception as e:
        logger.exception(f"Error adding ingredient by name: {name}")
        return Response({"error": str(e)}, status=HTTP_400_BAD_REQUEST)
