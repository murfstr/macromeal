from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST, HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND
from .models import Recipe, Ingredient
from .serializers import RecipeSerializer, IngredientSerializer
from integrations.services.api_clients import fetch_ingredient_data


@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def recipes_list_create(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            recipes = Recipe.objects.filter(user=request.user)
        else:
            recipes = Recipe.objects.all() # or restrict as needed
        serializer = RecipeSerializer(recipes, many=True, context={'request': request})
        return Response(serializer.data, status=HTTP_200_OK)

    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication required."}, status=HTTP_403_FORBIDDEN)
        
        serializer = RecipeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def recipes_detail(request, pk):
    try:
        recipe = Recipe.objects.get(pk=pk, user=request.user)
    except Recipe.DoesNotExist:
        return Response({"detail": "Not found."}, status=HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = RecipeSerializer(recipe, context={'request': request})
        return Response(serializer.data, status=HTTP_200_OK)
    elif request.method == 'PUT':
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication required."}, status=HTTP_403_FORBIDDEN)

        serializer = RecipeSerializer(recipe, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication required."}, status=HTTP_403_FORBIDDEN)

        recipe.delete()
        return Response(status=HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def ingredients_list_create(request):
    if request.method == 'GET':
        ingredients = Ingredient.objects.all()
        serializer = IngredientSerializer(ingredients, many=True)
        return Response(serializer.data, status=HTTP_200_OK)
    elif request.method == 'POST':
        serializer = IngredientSerializer(data=request.data)
        if serializer.is_valid():
            ingredient = serializer.save()
            return Response(IngredientSerializer(ingredient).data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def add_ingredient_by_name(request):
    name = request.data.get('name')
    if not name:
        return Response({"detail": "No ingredient name provided."}, status=HTTP_400_BAD_REQUEST)
    try:
        nutri_data = fetch_ingredient_data(name)
        food = nutri_data['foods'][0]
        ingredient_obj, created = Ingredient.objects.get_or_create(
            name=food['food_name']
        )
        ingredient_obj.calories = int(food.get('nf_calories', 0))
        ingredient_obj.save()

        serializer = IngredientSerializer(ingredient_obj)
        return Response(serializer.data, status=HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=HTTP_400_BAD_REQUEST)