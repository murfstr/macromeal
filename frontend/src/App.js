import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import MealPlansPage from './pages/MealPlansPage';
import RecipesPage from './pages/RecipesPage';
import HomePage from './pages/HomePage'; // Import the new HomePage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/mealplans" element={<MealPlansPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/" element={<HomePage />} />  {/* Home Page route */}
      </Routes>
    </Router>
  );
}

export default App;
