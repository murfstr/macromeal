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
  const response = await api.get('/users/profile/');
  return response.data;
};

// Mealplans
export const fetchMealPlans = async () => {
  const response = await api.get('/mealplans/');
  return response.data;
};

export const createMealPlan = async (data) => {
  const response = await api.post('/mealplans/', data);
  return response.data;
};

// Recipes
export const fetchRecipes = async () => {
  const response = await api.get('/recipes/');
  return response.data;
};

export const createRecipe = async (data) => {
  const response = await api.post('/recipes/', data);
  return response.data;
};

// Integrations
export const searchSpoonacular = async (query) => {
  const response = await api.get(`/integrations/spoonacular/search/?query=${query}`);
  return response.data;
};

export const analyzeNutritionix = async (foodText) => {
  const response = await api.post('/integrations/nutritionix/', { food_text: foodText });
  return response.data;
};
