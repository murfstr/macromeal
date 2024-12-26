// src/pages/HomePage.jsx
import React from 'react';
import NavBar from '../components/NavBar';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <div className="text-center mb-5">
          <h1 className="display-4">Welcome to Macromeal</h1>
          <p className="lead">
            Manage your meal plans, track your calories, and create delicious recipes with ease.
          </p>
        </div>

        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <i className="fas fa-utensils fa-3x mb-3 text-primary"></i>
                <h5 className="card-title">Meal Plans</h5>
                <p className="card-text">
                  Create and manage your personalized meal plans to stay on track with your dietary goals.
                </p>
                <Link to="/mealplans" className="btn btn-primary">
                  View Meal Plans
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <i className="fas fa-book-open fa-3x mb-3 text-success"></i>
                <h5 className="card-title">Recipes</h5>
                <p className="card-text">
                  Discover new recipes, add your favorites, and track the nutritional information of each dish.
                </p>
                <Link to="/recipes" className="btn btn-success">
                  Explore Recipes
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <i className="fas fa-user fa-3x mb-3 text-warning"></i>
                <h5 className="card-title">Profile</h5>
                <p className="card-text">
                  Manage your personal information, set calorie goals, and track your progress over time.
                </p>
                <Link to="/profile" className="btn btn-warning">
                  Go to Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
