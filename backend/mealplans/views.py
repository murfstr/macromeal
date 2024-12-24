from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from .models import MealPlan, MealPlanDay
from .serializers import MealPlanSerializer
from integrations.services.api_clients import fetch_random_spoonacular_recipes
from recipes.models import Recipe

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

@api_view(['GET', 'PUT', 'DELETE'])
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
    elif request.method == 'PUT':
        serializer = MealPlanSerializer(mealplan, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        mealplan.delete()
        return Response(status=HTTP_204_NO_CONTENT)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def random_mealplan(request):
    """
    POST /api/v1/mealplans/random/
    Body can be { "count": 3 } or similar
    """
    count = int(request.data.get('count', 3))
    try:
        spoon_data = fetch_random_spoonacular_recipes(count)
    except Exception as e:
        return Response({"error": str(e)}, status=HTTP_400_BAD_REQUEST)

    if not spoon_data:
        return Response({"error": "Spoonacular returned no recipes."}, status=HTTP_400_BAD_REQUEST)

    # Create local recipes
    recipe_ids = []
    for r in spoon_data:
        # For example, we store only name; you can parse more fields
        local_recipe, _ = Recipe.objects.get_or_create(
            name=r['title'],
            defaults={
                "description": r.get('summary', ''),
                # "calories": ... etc. if you want
            }
        )
        recipe_ids.append(local_recipe.id)

    # Now create a meal plan
    mealplan = MealPlan.objects.create(
        user=request.user,
        name="Random Spoonacular Plan",
        daily_calorie_goal=2000
    )
    # Add one day referencing these recipes
    day = MealPlanDay.objects.create(
        mealplan=mealplan,
        date="2025-01-01",  # or some date logic
    )
    day.recipes.set(recipe_ids)

    # Return serialized plan
    serializer = MealPlanSerializer(mealplan, context={'request': request})
    return Response(serializer.data, status=HTTP_201_CREATED)
