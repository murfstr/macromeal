from django.urls import path
from .views import recipes_list_create, recipes_detail

urlpatterns = [
    path('', recipes_list_create, name='recipes_list_create'),
    path('<int:pk>/', recipes_detail, name='recipes_detail'),
]
