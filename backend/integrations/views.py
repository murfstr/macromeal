from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .services.api_clients import fetch_recipes_from_spoonacular, fetch_random_spoonacular_recipes, fetch_ingredient_data

class SpoonacularSearchView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('query', '')
        data = fetch_recipes_from_spoonacular(query)
        return Response(data)

class SpoonacularRandomView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = fetch_random_spoonacular_recipes()
        return Response(data)

class NutritionixView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        food_text = request.data.get('food_text', '')
        data = fetch_ingredient_data(food_text)
        return Response(data)
