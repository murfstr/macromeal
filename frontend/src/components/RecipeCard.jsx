// src/components/RecipeCard.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';
import RecipeModal from './RecipeModal';

function RecipeCard({ recipe, onDelete }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card className="mb-4 shadow">
        <Card.Body>
          <Card.Title>{recipe.name}</Card.Title>
          <Card.Text>
            {recipe.description}
          </Card.Text>
          <Card.Text>
            <strong>Calories:</strong> {recipe.calories} kcal
          </Card.Text>
          <Button variant="primary" onClick={() => setShowModal(true)} className="me-2">
            View Details
          </Button>
          <Button variant="danger" onClick={() => onDelete(recipe.id)}>
            Delete
          </Button>
        </Card.Body>
      </Card>

      <RecipeModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        recipeId={recipe.id}
      />
    </>
  );
}

RecipeCard.propTypes = {
  recipe: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default RecipeCard;
