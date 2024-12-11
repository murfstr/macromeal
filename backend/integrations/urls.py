from django.urls import path
from .views import SpoonacularSearchView, SpoonacularRandomView, NutritionixView

urlpatterns = [
    path('spoonacular/search/', SpoonacularSearchView.as_view(), name='spoonacular_search'),
    path('spoonacular/random/', SpoonacularRandomView.as_view(), name='spoonacular_random'),
    path('nutritionix/', NutritionixView.as_view(), name='nutritionix'),
]
