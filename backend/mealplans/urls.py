from django.urls import path
from .views import mealplans_list_create, mealplans_detail

urlpatterns = [
    path('', mealplans_list_create, name='mealplans_list_create'),
    path('<int:pk>/', mealplans_detail, name='mealplans_detail'),
]
