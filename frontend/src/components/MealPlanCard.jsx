// src/components/MealPlanCard.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { patchMealPlan } from '../services/api'; // Ensure only patchMealPlan is imported
import { toast } from 'react-toastify';
import RecipeModal from './RecipeModal'; // Import the RecipeModal component

function MealPlanCard({ mealplan, onDelete, recipes, onUpdate }) {
  // State for Swap Meal Modal
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('');
  const [selectedRecipeId, setSelectedRecipeId] = useState('');

  // State for Change Date Modal
  const [showDateModal, setShowDateModal] = useState(false);
  const [newDate, setNewDate] = useState('');

  // State for Recipe Details Modal
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedRecipeIdForModal, setSelectedRecipeIdForModal] = useState(null);

  // Handlers for Swap Meal Modal
  const handleCloseSwap = () => {
    setShowSwapModal(false);
    setSelectedMealType('');
    setSelectedRecipeId('');
  };

  const handleShowSwap = (mealType) => {
    setSelectedMealType(mealType);
    setShowSwapModal(true);
  };

  // Handlers for Change Date Modal
  const handleCloseDate = () => {
    setShowDateModal(false);
    setNewDate('');
  };

  const handleShowDate = () => {
    if (mealplan.days.length > 0) {
      setNewDate(mealplan.days[0].date); // Pre-fill with existing date
    }
    setShowDateModal(true);
  };

  // Handler for swapping a meal
  const handleSwapMeal = async () => {
    if (!selectedMealType || !selectedRecipeId) {
      toast.error('Please select a meal type and a recipe.');
      return;
    }

    // Find the meal to update based on meal_type
    const mealToUpdate = mealplan.days[0].meals.find(
      (meal) => meal.meal_type === selectedMealType
    );

    if (!mealToUpdate) {
      toast.error('Selected meal type not found.');
      return;
    }

    // Construct the partial update payload
    const payload = {
      days: [
        {
          id: mealplan.days[0].id, // Include MealPlanDay ID
          meals: [
            {
              id: mealToUpdate.id, // Include Meal ID
              recipe_id: parseInt(selectedRecipeId, 10), // New Recipe ID
            },
          ],
        },
      ],
    };

    console.log('Swapping Meal with payload:', payload); // Debugging

    try {
      const updated = await patchMealPlan(mealplan.id, payload); // Use PATCH
      console.log('Updated Meal Plan:', updated); // Debugging
      toast.success('Meal plan updated successfully!');
      handleCloseSwap();
      onUpdate(updated); // Update parent component with new data
    } catch (error) {
      console.error('Error updating meal plan:', error);
      if (error.response && error.response.data) {
        const errorMessages = Object.entries(error.response.data)
          .map(([field, messages]) => {
            if (Array.isArray(messages)) {
              return `${field}: ${messages.join(', ')}`;
            } else if (typeof messages === 'string') {
              return `${field}: ${messages}`;
            } else {
              return `${field}: ${JSON.stringify(messages)}`;
            }
          })
          .join('\n');
        toast.error(`Failed to update meal plan:\n${errorMessages}`);
      } else {
        toast.error('Failed to update meal plan.');
      }
    }
  };

  // Handler for changing the meal plan date
  const handleChangeDate = async () => {
    if (!newDate) {
      toast.error('Please select a new date.');
      return;
    }

    // Construct the partial update payload for the date
    const payload = {
      days: [
        {
          id: mealplan.days[0].id, // Include MealPlanDay ID
          date: newDate, // New date
        },
      ],
    };

    console.log('Changing Date with payload:', payload); // Debugging

    try {
      const updated = await patchMealPlan(mealplan.id, payload); // Use PATCH
      console.log('Updated Meal Plan:', updated); // Debugging
      toast.success('Meal plan date updated successfully!');
      handleCloseDate();
      onUpdate(updated); // Update parent component with new data
    } catch (error) {
      console.error('Error updating meal plan date:', error);
      if (error.response && error.response.data) {
        const errorMessages = Object.entries(error.response.data)
          .map(([field, messages]) => {
            if (Array.isArray(messages)) {
              return `${field}: ${messages.join(', ')}`;
            } else if (typeof messages === 'string') {
              return `${field}: ${messages}`;
            } else {
              return `${field}: ${JSON.stringify(messages)}`;
            }
          })
          .join('\n');
        toast.error(`Failed to update meal plan date:\n${errorMessages}`);
      } else {
        toast.error('Failed to update meal plan date.');
      }
    }
  };

  // Handler for clicking on a meal to view recipe details
  const handleMealClick = (recipeId) => {
    setSelectedRecipeIdForModal(recipeId);
    setShowRecipeModal(true);
  };

  const handleCloseRecipeModal = () => {
    setShowRecipeModal(false);
    setSelectedRecipeIdForModal(null);
  };

  return (
    <>
      <Card className="mb-4 shadow">
        <Card.Header className="bg-info text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{mealplan.name}</h5>

        </Card.Header>
        <Card.Body>
          <p>
            <strong>Daily Calorie Goal:</strong> {mealplan.daily_calorie_goal} kcal
          </p>
          {mealplan.days.map((day) => (
            <div key={day.id}>
              <Row className="align-items-center mb-2">
                <Col xs={8}>
                  <h6>{day.date}</h6>
                </Col>
                <Col xs={4} className="text-end">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleShowDate()}
                  >
                    <i className="fas fa-calendar-edit me-1"></i> Change Date
                  </Button>
                </Col>
              </Row>
              <ul className="list-group mb-3">
                {day.meals.map((meal) => (
                  <li
                    key={meal.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleMealClick(meal.recipe_id)}
                      title="View Recipe Details"
                    >
                      <strong>
                        {meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1)}:
                      </strong>{' '}
                      {meal.recipe.name} - {meal.recipe.calories} kcal
                    </span>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleShowSwap(meal.meal_type)}
                    >
                      <i className="fas fa-exchange-alt me-2"></i> Swap
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <Button variant="danger" onClick={() => onDelete(mealplan.id)}>
            <i className="fas fa-trash me-2"></i> Delete Meal Plan
          </Button>
        </Card.Body>
      </Card>

      {/* Swap Meal Modal */}
      <Modal show={showSwapModal} onHide={handleCloseSwap}>
        <Modal.Header closeButton>
          <Modal.Title>Swap Meal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="mealType" className="mb-3">
              <Form.Label>Meal Type</Form.Label>
              <Form.Control type="text" value={selectedMealType} readOnly />
            </Form.Group>
            <Form.Group controlId="recipeSelect">
              <Form.Label>Select New Recipe</Form.Label>
              <Form.Select
                value={selectedRecipeId}
                onChange={(e) => setSelectedRecipeId(e.target.value)}
              >
                <option value="">-- Choose a Recipe --</option>
                {recipes.map((recipe) => (
                  <option key={recipe.id} value={recipe.id}>
                    {recipe.name} - {recipe.calories} kcal
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSwap}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSwapMeal}>
            Swap Meal
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Change Date Modal */}
      <Modal show={showDateModal} onHide={handleCloseDate}>
        <Modal.Header closeButton>
          <Modal.Title>Change Meal Plan Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="dateSelect">
              <Form.Label>Select New Date</Form.Label>
              <Form.Control
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDate}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleChangeDate}>
            Change Date
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Recipe Details Modal */}
      {selectedRecipeIdForModal && (
        <RecipeModal
          show={showRecipeModal}
          handleClose={handleCloseRecipeModal}
          recipeId={selectedRecipeIdForModal}
        />
      )}
    </>

  );
}

MealPlanCard.propTypes = {
  mealplan: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  recipes: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default MealPlanCard;
