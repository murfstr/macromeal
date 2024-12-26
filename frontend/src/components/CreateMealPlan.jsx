// src/components/CreateMealPlan.jsx

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { createMealPlan, fetchRecipes } from '../services/api';
import { toast } from 'react-toastify';

function CreateMealPlan({ onCreate }) {
  const [recipes, setRecipes] = useState([]);
  const [mealName, setMealName] = useState('');
  const [selectedRecipes, setSelectedRecipes] = useState({
    breakfast: '',
    lunch: '',
    dinner: '',
  });
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2000); // Default value

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const data = await fetchRecipes();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        toast.error("Failed to load recipes.");
      }
    };

    loadRecipes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedRecipes((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { breakfast, lunch, dinner } = selectedRecipes;

    // Validation
    if (!mealName.trim()) {
      toast.error("Please enter a name for the meal plan.");
      return;
    }

    if (!breakfast || !lunch || !dinner) {
      toast.error("Please select a recipe for each meal.");
      return;
    }

    // Construct the payload
    const payload = {
      name: mealName,
      daily_calorie_goal: parseInt(dailyCalorieGoal, 10),
      days: [
        {
          date: new Date().toISOString().split('T')[0], // Assign today's date
          meals: [
            {
              meal_type: 'breakfast',
              recipe_id: parseInt(breakfast, 10),
            },
            {
              meal_type: 'lunch',
              recipe_id: parseInt(lunch, 10),
            },
            {
              meal_type: 'dinner',
              recipe_id: parseInt(dinner, 10),
            },
          ],
        },
      ],
    };

    try {
      const newMealPlan = await createMealPlan(payload);
      toast.success("Meal plan created successfully!");
      setMealName('');
      setSelectedRecipes({ breakfast: '', lunch: '', dinner: '' });
      setDailyCalorieGoal(2000);
      if (onCreate) {
        onCreate(newMealPlan); // Update parent component if needed
      }
    } catch (error) {
      console.error("Error creating meal plan:", error);
      const errorMessages = error.message || "Failed to create meal plan.";
      toast.error(`Failed to create meal plan: ${errorMessages}`);
    }
  };

  return (
    <Card className="mb-4 shadow">
      <Card.Header className="bg-success text-white">
        <h5 className="mb-0">Create New Meal Plan</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          {/* Meal Plan Name */}
          <Form.Group controlId="mealPlanName" className="mb-3">
            <Form.Label>Meal Plan Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter meal plan name"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              required
            />
          </Form.Group>

          {/* Daily Calorie Goal */}
          <Form.Group controlId="dailyCalorieGoal" className="mb-3">
            <Form.Label>Daily Calorie Goal (kcal)</Form.Label>
            <Form.Control
              type="number"
              min="1000"
              max="5000"
              value={dailyCalorieGoal}
              onChange={(e) => setDailyCalorieGoal(e.target.value)}
              required
            />
          </Form.Group>

          {/* Select Recipes for Each Meal */}
          <Row>
            <Col md={4}>
              <Form.Group controlId="breakfast" className="mb-3">
                <Form.Label>Breakfast</Form.Label>
                <Form.Select
                  name="breakfast"
                  value={selectedRecipes.breakfast}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Breakfast Recipe --</option>
                  {recipes
                    .filter(recipe => recipe.meal_type === 'breakfast') // Optional: filter by meal type
                    .map((recipe) => (
                      <option key={recipe.id} value={recipe.id}>
                        {recipe.name} - {recipe.calories} kcal
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="lunch" className="mb-3">
                <Form.Label>Lunch</Form.Label>
                <Form.Select
                  name="lunch"
                  value={selectedRecipes.lunch}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Lunch Recipe --</option>
                  {recipes
                    .filter(recipe => recipe.meal_type === 'lunch') // Optional: filter by meal type
                    .map((recipe) => (
                      <option key={recipe.id} value={recipe.id}>
                        {recipe.name} - {recipe.calories} kcal
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="dinner" className="mb-3">
                <Form.Label>Dinner</Form.Label>
                <Form.Select
                  name="dinner"
                  value={selectedRecipes.dinner}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Dinner Recipe --</option>
                  {recipes
                    .filter(recipe => recipe.meal_type === 'dinner') // Optional: filter by meal type
                    .map((recipe) => (
                      <option key={recipe.id} value={recipe.id}>
                        {recipe.name} - {recipe.calories} kcal
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Submit Button */}
          <Button variant="primary" type="submit">
            Create Meal Plan
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

CreateMealPlan.propTypes = {
  onCreate: PropTypes.func, // Optional: function to call after creation
};

export default CreateMealPlan;
