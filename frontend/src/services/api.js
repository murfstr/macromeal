// src/services/api.js
import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/api/v1';

// Create an Axios instance
const api = axios.create({
  baseURL: baseURL,
});

// Function to set token in the Authorization header
export const setAuthToken = (token, email) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
    localStorage.setItem('token', token);
    if (email) {
      localStorage.setItem('email', email);
    }
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  }
};

// Check if there's a token with email in localStorage when app starts
const storedToken = localStorage.getItem('token');
const storedEmail = localStorage.getItem('email');
if (storedToken) {
  setAuthToken(storedToken, storedEmail);
}

// Auth endpoints
export const signupUser = async (email, password) => {
  try {
    const response = await axios.post(`${baseURL}/users/signup/`, {email, password});
    const { token } = response.data;
    setAuthToken(token, email);
    return response.data;
  } catch (error) {
    console.error("Signup error:", error.response || error.message);
    throw new Error(error.response?.data?.detail || "Failed to sign up");
  }
};


export const loginUser = async (email, password) => {
  const response = await api.post('/users/login/', { email, password });
  const { token } = response.data;
  setAuthToken(token, email);
  return response.data;
};

export const logoutUser = () => {
  setAuthToken(null);
};

// Protected endpoints
export const getProfile = async () => {
  try {
    const response = await api.get('/users/profile/');
    console.log('Profile data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error.response || error.message);
    throw error;
  }
};


// Mealplans
export const fetchMealPlans = async () => {
  const response = await api.get('/mealplans/');
  return response.data;
};

export const createMealPlan = async (data) => {
  try {
    const response = await api.post('/mealplans/', data);
    return response.data;
  } catch (error) {
    console.error("Create Meal Plan error:", error.response || error.message);
    throw new Error(error.response?.data?.detail || "Failed to create meal plan");
  }
};

export const deleteMealPlan = async (id) => {
  const response = await api.delete(`/mealplans/${id}/`);
  return response.data;
};

export const generateRandomMealPlan = async () => {
  try {
    const response = await api.post('/mealplans/random/', {});
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const updateMealPlan = async (id, data) => {
  const response = await api.put(`/mealplans/${id}/`, data);
  return response.data;
};

export const patchMealPlan = async (id, data) => {
  const response = await api.patch(`/mealplans/${id}/`, data);
  return response.data;
};

// Recipes
export const fetchRecipes = async () => {
  const response = await api.get('/recipes/');
  return response.data;
};

export const fetchRecipeDetails = async (id) => {
  try {
    const response = await api.get(`/recipes/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};

export const createRecipe = async (data) => {
  const response = await api.post('/recipes/', data);
  return response.data;
};

// Integrations
export const searchSpoonacular = async (query) => {
  const response = await api.get(`/integrations/spoonacular/search/?query=${encodeURIComponent(query)}`);
  return response.data;
};

export const analyzeNutritionix = async (foodText) => {
  const response = await api.post('/integrations/nutritionix/', { food_text: foodText });
  return response.data;
};

export const fetchIngredients = async () => {
  const response = await api.get('/recipes/ingredients/');
  return response.data;
};

export const addIngredient = async (data) => {
  try {
    const response = await api.post('/recipes/ingredients/', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createIngredient = async (data) => {
  const response = await api.post('/recipes/add_ingredient/', data);
  return response.data;
};

export const addIngredientByName = async (name) => {
  const response = await api.post('/recipes/add_ingredient/', { name });
  return response.data;
};

export const deleteIngredient = async (ingredientId) => {
  const response = await api.delete(`/recipes/ingredients/${ingredientId}/`);
  return response.data; 
};

export const deleteRecipe = async (recipeId) => {
  const response = await api.delete(`/recipes/${recipeId}/`);
  return response.data;
}