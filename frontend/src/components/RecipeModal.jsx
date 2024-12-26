// src/components/RecipeModal.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, ListGroup, Spinner } from 'react-bootstrap';
import { fetchRecipeDetails } from '../services/api';
import { toast } from 'react-toastify';

function RecipeModal({ show, handleClose, recipeId }) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (recipeId && show) {
      setLoading(true);
      setError(null);
      fetchRecipeDetails(recipeId)
        .then((data) => {
          setRecipe(data);
        })
        .catch((err) => {
          console.error('Error fetching recipe details:', err);
          setError('Failed to load recipe details.');
          toast.error('Failed to load recipe details.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [recipeId, show]);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{recipe ? recipe.name : 'Recipe Details'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status" />
          </div>
        )}
        {error && <p className="text-danger">{error}</p>}
        {recipe && (
          <>
            <p><strong>Calories:</strong> {recipe.calories} kcal</p>
            <h5>Ingredients:</h5>
            <ListGroup variant="flush">
              {recipe.recipe_ingredients.map((ri) => (
                <ListGroup.Item key={ri.id}>
                  {ri.quantity} {ri.ingredient.name} - {ri.ingredient.calories} kcal
                </ListGroup.Item>
              ))}
            </ListGroup>
            <h5 className="mt-3">Description:</h5>
            <p>{recipe.description}</p>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

RecipeModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  recipeId: PropTypes.number.isRequired,
};

export default RecipeModal;
