from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST, HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND
from .models import Recipe
from .serializers import RecipeSerializer

@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def recipes_list_create(request):
    if request.method == 'GET':
        # List all recipes (public read)
        recipes = Recipe.objects.all()
        serializer = RecipeSerializer(recipes, many=True)
        return Response(serializer.data, status=HTTP_200_OK)

    elif request.method == 'POST':
        # Create a new recipe (requires authentication)
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication required."}, status=HTTP_403_FORBIDDEN)
        
        serializer = RecipeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def recipes_detail(request, pk):
    try:
        recipe = Recipe.objects.get(pk=pk)
    except Recipe.DoesNotExist:
        return Response({"detail": "Not found."}, status=HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Retrieve a single recipe (public read)
        serializer = RecipeSerializer(recipe)
        return Response(serializer.data, status=HTTP_200_OK)

    elif request.method == 'PUT':
        # Update a recipe (requires authentication)
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication required."}, status=HTTP_403_FORBIDDEN)

        serializer = RecipeSerializer(recipe, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        # Delete a recipe (requires authentication)
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication required."}, status=HTTP_403_FORBIDDEN)

        recipe.delete()
        return Response(status=HTTP_204_NO_CONTENT)
