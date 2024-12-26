// src/pages/MealPlansPage.jsx
import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import MealPlanCard from '../components/MealPlanCard';
import {
  fetchMealPlans,
  createMealPlan,
  fetchRecipes,
  deleteMealPlan,
  generateRandomMealPlan,
  updateMealPlan,
  fetchIngredients,
  addIngredient,
  deleteIngredient,
} from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Form, Container, Row, Col, ListGroup, InputGroup } from 'react-bootstrap';

function MealPlansPage() {
  const [mealplans, setMealplans] = useState([]);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState(2000);
  const [recipes, setRecipes] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState({
    breakfast: '',
    lunch: '',
    dinner: '',
  });
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const mpData = await fetchMealPlans();
      setMealplans(mpData);
      const rData = await fetchRecipes();
      setRecipes(rData);
      const iData = await fetchIngredients();
      setIngredients(iData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load meal plans, recipes, or ingredients.');
    }
  };

  // Handle selection changes for each meal type
  const handleMealSelection = (mealType, recipeId) => {
    setSelectedMeals((prev) => ({
      ...prev,
      [mealType]: recipeId,
    }));
  };

  // Create a meal plan manually
  const handleCreate = async (e) => {
    e.preventDefault();
    const { breakfast, lunch, dinner } = selectedMeals;

    // Validation
    if (!name.trim()) {
      toast.error('Please enter a meal plan name.');
      return;
    }
    if (!breakfast || !lunch || !dinner) {
      toast.error('Please select recipes for breakfast, lunch, and dinner.');
      return;
    }

    // Construct the days array
    const data = {
      name,
      daily_calorie_goal: parseInt(goal, 10),
      days: [
        {
          date: new Date().toISOString().split('T')[0], // Today's date
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
      const newMP = await createMealPlan(data);
      setMealplans((prev) => [...prev, newMP]);
      toast.success('Meal plan created successfully!');
      // Reset form
      setName('');
      setGoal(2000);
      setSelectedMeals({
        breakfast: '',
        lunch: '',
        dinner: '',
      });
    } catch (error) {
      console.error('Error creating meal plan:', error);
      if (error.response && error.response.data) {
        // Display specific error message from backend
        toast.error(`Error creating meal plan: ${JSON.stringify(error.response.data)}`);
      } else {
        toast.error('Error creating meal plan.');
      }
    }
  };

  // Delete a meal plan
  const handleDeleteMealPlan = async (id) => {
    if (!window.confirm('Really delete this meal plan?')) return;
    try {
      await deleteMealPlan(id);
      setMealplans((prev) => prev.filter((mp) => mp.id !== id));
      toast.success('Meal plan deleted successfully!');
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      if (error.response && error.response.data) {
        toast.error(`Failed to delete meal plan: ${JSON.stringify(error.response.data)}`);
      } else {
        toast.error('Failed to delete meal plan.');
      }
    }
  };

  // Update a meal plan
  const handleUpdateMealPlan = async (updatedMealPlan) => {
    try {
      const updated = await updateMealPlan(updatedMealPlan.id, updatedMealPlan);
      setMealplans((prev) =>
        prev.map((mp) => (mp.id === updated.id ? updated : mp))
      );
      toast.success('Meal plan updated successfully!');
    } catch (error) {
      console.error('Error updating meal plan:', error);
      if (error.response && error.response.data) {
        toast.error(`Failed to update meal plan: ${JSON.stringify(error.response.data)}`);
      } else {
        toast.error('Failed to update meal plan.');
      }
    }
  };

  // Generate random meal plan with breakfast, lunch, and dinner
  const handleRandomMealPlan = async () => {
    try {
      const newMP = await generateRandomMealPlan(); // Assumes 1 of each meal type
      setMealplans((prev) => [...prev, newMP]);
      toast.success('Random meal plan generated successfully!');
    } catch (error) {
      console.error('Error generating random meal plan:', error);
      if (error.response && error.response.data) {
        // Display specific error message from backend
        toast.error(`Failed to generate random meal plan: ${JSON.stringify(error.response.data)}`);
      } else {
        toast.error('Failed to generate random meal plan.');
      }
    }
  };

  // Add a new ingredient
  const handleAddIngredient = async (e) => {
    e.preventDefault();
    if (!newIngredient.trim()) {
      toast.error('Please enter an ingredient name.');
      return;
    }
    try {
      const addedIngredient = await addIngredient({ name: newIngredient });
      setIngredients((prev) => [...prev, addedIngredient]);
      toast.success('Ingredient added successfully!');
      setNewIngredient('');
    } catch (error) {
      console.error('Error adding ingredient:', error);
      if (error.response && error.response.data) {
        toast.error(`Failed to add ingredient: ${JSON.stringify(error.response.data)}`);
      } else {
        toast.error('Failed to add ingredient.');
      }
    }
  };

  // Delete an ingredient
  const handleDeleteIngredient = async (id) => {
    if (!window.confirm('Really delete this ingredient?')) return;
    try {
      await deleteIngredient(id);
      setIngredients((prev) => prev.filter((ing) => ing.id !== id));
      toast.success('Ingredient deleted successfully!');
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      if (error.response && error.response.data) {
        toast.error(`Failed to delete ingredient: ${JSON.stringify(error.response.data)}`);
      } else {
        toast.error('Failed to delete ingredient.');
      }
    }
  };

  return (
    <div>
      <NavBar />

      <Container className="mt-4">
        <h1>Meal Plans</h1>

        {/* Generate Random Meal Plan Button */}
        <Button variant="secondary" className="mb-3" onClick={handleRandomMealPlan}>
          <i className="fas fa-random me-2"></i> Generate Random Meal Plan
        </Button>

        {/* Meal Plans Display */}
        <Row>
          {mealplans.map((mp) => (
            <Col md={4} key={mp.id}>
              <MealPlanCard
                mealplan={mp}
                onDelete={handleDeleteMealPlan}
                recipes={recipes}
                onUpdate={handleUpdateMealPlan}
              />
            </Col>
          ))}
        </Row>

        <hr />

        <h2>Create New Meal Plan</h2>
        <Form onSubmit={handleCreate}>
          <Form.Group className="mb-3" controlId="mealPlanName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter meal plan name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="calorieGoal">
            <Form.Label>Daily Calorie Goal</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter calorie goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="mealPlanDate">
            <Form.Label>Date for Meal Plan Day</Form.Label>
            <Form.Control
              type="date"
              value={new Date().toISOString().split('T')[0]}
              disabled
            />
          </Form.Group>
          <h4>Select Recipes for That Day</h4>
          <p>Select one recipe each for breakfast, lunch, and dinner.</p>
          <Row>
            <Col md={4} className="mb-3">
              <Form.Group controlId="breakfastSelect">
                <Form.Label>Breakfast</Form.Label>
                <Form.Select
                  name="breakfast"
                  value={selectedMeals.breakfast}
                  onChange={(e) => handleMealSelection('breakfast', e.target.value)}
                >
                  <option value="">Select Breakfast Recipe</option>
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} - {r.calories} kcal
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4} className="mb-3">
              <Form.Group controlId="lunchSelect">
                <Form.Label>Lunch</Form.Label>
                <Form.Select
                  name="lunch"
                  value={selectedMeals.lunch}
                  onChange={(e) => handleMealSelection('lunch', e.target.value)}
                >
                  <option value="">Select Lunch Recipe</option>
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} - {r.calories} kcal
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4} className="mb-3">
              <Form.Group controlId="dinnerSelect">
                <Form.Label>Dinner</Form.Label>
                <Form.Select
                  name="dinner"
                  value={selectedMeals.dinner}
                  onChange={(e) => handleMealSelection('dinner', e.target.value)}
                >
                  <option value="">Select Dinner Recipe</option>
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} - {r.calories} kcal
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" type="submit">
            Create Meal Plan
          </Button>
        </Form>

        <hr />

        <h2>Your Available Ingredients</h2>
        <Form onSubmit={handleAddIngredient} className="mb-3">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Add new ingredient"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
            />
            <Button variant="success" type="submit">
              Add Ingredient
            </Button>
          </InputGroup>
        </Form>
        <ListGroup>
          {ingredients.map((ing) => (
            <ListGroup.Item key={ing.id} className="d-flex justify-content-between align-items-center">
              {ing.name} - {ing.calories} kcal
              <Button variant="danger" size="sm" onClick={() => handleDeleteIngredient(ing.id)}>
                Delete
              </Button>
            </ListGroup.Item>
          ))}
          {ingredients.length === 0 && <p>You have no available ingredients.</p>}
        </ListGroup>
      </Container>
    </div>
  );
}

export default MealPlansPage;
