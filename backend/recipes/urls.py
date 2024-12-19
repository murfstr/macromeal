from django.urls import path
from .views import recipes_list_create, recipes_detail, ingredients_list_create, add_ingredient_by_name

urlpatterns = [
    path('', recipes_list_create, name='recipes_list_create'),
    path('<int:pk>/', recipes_detail, name='recipes_detail'),
    path('ingredients/', ingredients_list_create, name='ingredients_list_create'),
    path('add_ingredient/', add_ingredient_by_name, name='add_ingredient_by_name'),
]
