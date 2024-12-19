import requests
from django.conf import settings

def fetch_recipes_from_spoonacular(query):
    # Example: complex search endpoint
    url = "https://api.spoonacular.com/recipes/complexSearch"
    params = {
        "query": query,
        "apiKey": settings.SPOONACULAR_API_KEY,
        "number": 5
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()

def fetch_random_spoonacular_recipes():
    url = "https://api.spoonacular.com/recipes/random"
    params = {
        "apiKey": settings.SPOONACULAR_API_KEY,
        "number": 3
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()

def fetch_ingredient_data(query):
    url = "https://trackapi.nutritionix.com/v2/natural/nutrients"
    headers = {
        "x-app-id": settings.NUTRITIONIX_APP_ID,
        "x-app-key": settings.NUTRITIONIX_APP_KEY,
        "Content-Type": "application/json"
    }
    data = {"query": query}
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    return response.json()
