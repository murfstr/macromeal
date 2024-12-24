import React from 'react';
import PropTypes from 'prop-types';

function RecipeCard({ recipe, onDelete }) {
  return (
    <div className="card mb-4 shadow-sm">
      {/* Optional: Add an image if available */}
      {/* <img src={recipe.image} className="card-img-top" alt={recipe.name} /> */}
      <div className="card-body">
        <h5 className="card-title">{recipe.name}</h5>
        <p className="card-text">{recipe.description}</p>
        <h6>Ingredients:</h6>
        <ul className="list-group list-group-flush mb-3">
          {recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0 ? (
            recipe.recipe_ingredients.map((ri) => (
              <li key={ri.id} className="list-group-item">
                {ri.quantity} {ri.ingredient.name} ({ri.ingredient.calories} cal)
              </li>
            ))
          ) : (
            <li className="list-group-item">No ingredients listed.</li>
          )}
        </ul>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(recipe.id)}
        >
          <i className="fas fa-trash-alt me-2"></i> Delete Recipe
        </button>
      </div>
    </div>
  );
}

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    recipe_ingredients: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        quantity: PropTypes.string.isRequired,
        ingredient: PropTypes.shape({
          name: PropTypes.string.isRequired,
          calories: PropTypes.number.isRequired,
        }).isRequired,
      })
    ),
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default RecipeCard;
