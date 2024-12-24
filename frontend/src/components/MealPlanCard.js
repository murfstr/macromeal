import React from 'react';
import PropTypes from 'prop-types';

function MealPlanCard({ mealplan, onDelete }) {
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-primary text-white">
        <h5 className="my-0">{mealplan.name}</h5>
      </div>
      <div className="card-body">
        <h6 className="card-title">Daily Calorie Goal: {mealplan.daily_calorie_goal} cal</h6>
        <p className="card-text">Created At: {new Date(mealplan.created_at).toLocaleDateString()}</p>
        {mealplan.days && mealplan.days.length > 0 ? (
          mealplan.days.map((day) => (
            <div key={day.id} className="mb-3">
              <h6>Date: {day.date}</h6>
              <ul className="list-group list-group-flush">
                {day.recipes.map((recipe) => (
                  <li key={recipe.id} className="list-group-item">
                    {recipe.name} ({recipe.calories} cal)
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No days assigned to this meal plan.</p>
        )}
        <button
          className="btn btn-danger btn-sm mt-2"
          onClick={() => onDelete(mealplan.id)}
        >
          <i className="fas fa-trash-alt"></i> Delete Meal Plan
        </button>
      </div>
    </div>
  );
}

MealPlanCard.propTypes = {
  mealplan: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    daily_calorie_goal: PropTypes.number.isRequired,
    created_at: PropTypes.string.isRequired,
    days: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
        recipes: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            calories: PropTypes.number.isRequired,
          })
        ),
      })
    ),
  }).isRequired,
  onDelete: PropTypes.func, // Optional: function to handle deletion
};

MealPlanCard.defaultProps = {
  onDelete: () => {},
};

export default MealPlanCard;
