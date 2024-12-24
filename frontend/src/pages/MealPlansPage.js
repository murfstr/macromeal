import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import MealPlanCard from '../components/MealPlanCard';
import {
  fetchMealPlans,
  createMealPlan,
  fetchRecipes,
  deleteMealPlan,
  generateRandomMealPlan,
} from '../services/api';

function MealPlansPage() {
  const [mealplans, setMealplans] = useState([]);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState(2000);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const mpData = await fetchMealPlans();
      setMealplans(mpData);
      const rData = await fetchRecipes();
      setRecipes(rData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load meal plans or recipes.');
    }
  };

  // Toggle recipe ID in selectedRecipeIds
  const toggleRecipeSelection = (id) => {
    if (selectedRecipeIds.includes(id)) {
      setSelectedRecipeIds((prev) => prev.filter((rid) => rid !== id));
    } else {
      setSelectedRecipeIds((prev) => [...prev, id]);
    }
  };

  // Create a meal plan manually
  const handleCreate = async () => {
    if (!selectedDate) {
      alert('Please select a date for the meal plan day.');
      return;
    }
    const data = {
      name,
      daily_calorie_goal: parseInt(goal, 10),
      days: [
        {
          date: selectedDate,
          recipe_ids: selectedRecipeIds,
        },
      ],
    };
    try {
      const newMP = await createMealPlan(data);
      setMealplans((prev) => [...prev, newMP]);
      // Reset form
      setName('');
      setGoal(2000);
      setSelectedDate('');
      setSelectedRecipeIds([]);
    } catch (error) {
      console.error('Error creating meal plan:', error);
      alert('Error creating meal plan.');
    }
  };

  // Optional: Delete meal plan
  const handleDeleteMealPlan = async (id) => {
    if (!window.confirm('Really delete this meal plan?')) return;
    try {
      await deleteMealPlan(id);
      setMealplans((prev) => prev.filter((mp) => mp.id !== id));
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      alert('Failed to delete meal plan.');
    }
  };

  // Generate random meal plan from Spoonacular
  const handleRandomMealPlan = async () => {
    const count = 3; // Number of random recipes
    try {
      const newMP = await generateRandomMealPlan(count);
      setMealplans((prev) => [...prev, newMP]);
    } catch (error) {
      console.error('Error generating random meal plan:', error);
      alert('Failed to generate random meal plan.');
    }
  };

  return (
    <div>
      <NavBar />

      <div className="container mt-4">
        <h1>Meal Plans</h1>

        {/* Generate Random Meal Plan Button */}
        <button className="btn btn-secondary mb-3" onClick={handleRandomMealPlan}>
          <i className="fas fa-random me-2"></i> Generate Random Meal Plan
        </button>

        {/* Meal Plans Display */}
        <div className="row">
          {mealplans.map((mp) => (
            <div className="col-md-4" key={mp.id}>
              <MealPlanCard mealplan={mp} onDelete={handleDeleteMealPlan} />
            </div>
          ))}
        </div>

        <hr />
        <h2>Create New Meal Plan</h2>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Daily Calorie Goal</label>
          <input
            type="number"
            className="form-control"
            placeholder="Goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Date for Meal Plan Day</label>
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <h4>Select Recipes for That Day</h4>
        <ul className="list-group mb-3">
          {recipes.map((r) => (
            <li key={r.id} className="list-group-item">
              <label>
                <input
                  type="checkbox"
                  className="form-check-input me-1"
                  checked={selectedRecipeIds.includes(r.id)}
                  onChange={() => toggleRecipeSelection(r.id)}
                />
                {r.name}
              </label>
            </li>
          ))}
        </ul>
        <button className="btn btn-primary" onClick={handleCreate}>
          Create Meal Plan
        </button>
      </div>
    </div>
  );
}

export default MealPlansPage;
