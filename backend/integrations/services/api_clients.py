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

def fetch_random_spoonacular_recipes(count=3):
    url = "https://api.spoonacular.com/recipes/random"
    params = {
        "number": count,
        "apiKey": settings.SPOONACULAR_API_KEY
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    data = response.json()
    return data.get("recipes", [])

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
