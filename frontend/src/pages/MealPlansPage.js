import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { fetchMealPlans, createMealPlan, fetchRecipes } from '../services/api';

function MealPlansPage() {
  const [mealplans, setMealplans] = useState([]);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState(2000);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    async function loadData() {
      const mpData = await fetchMealPlans();
      setMealplans(mpData);
      const rData = await fetchRecipes();
      setRecipes(rData);
    }
    loadData();
  }, []);

  const toggleRecipeSelection = (id) => {
    if (selectedRecipeIds.includes(id)) {
      setSelectedRecipeIds(selectedRecipeIds.filter(rid => rid !== id));
    } else {
      setSelectedRecipeIds([...selectedRecipeIds, id]);
    }
  };

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
          recipe_ids: selectedRecipeIds
        }
      ]
    };

    try {
      const newMP = await createMealPlan(data);
      setMealplans([...mealplans, newMP]);
      setName('');
      setGoal(2000);
      setSelectedDate('');
      setSelectedRecipeIds([]);
    } catch (error) {
      console.error(error);
      alert('Error creating meal plan');
    }
  };

  return (
    <div>
      <NavBar />
      <div style={{ padding: '20px' }}>
        <h1>Meal Plans</h1>
        <ul>
          {mealplans.map(mp => (
            <li key={mp.id}>
              {mp.name} - {mp.daily_calorie_goal} cal/day
              {mp.days && mp.days.map(day => (
                <div key={day.id}>
                  Date: {day.date} | Recipes: {day.recipes.map(r => r.name).join(', ')}
                </div>
              ))}
            </li>
          ))}
        </ul>

        <h2>Create New Meal Plan</h2>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input type="number" placeholder="Goal" value={goal} onChange={e=>setGoal(e.target.value)} />
        <h3>Pick a date for the meal plan day</h3>
        <input type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} />

        <h3>Select Recipes for that day</h3>
        <ul>
          {recipes.map(r => (
            <li key={r.id}>
              <label>
                <input 
                  type="checkbox"
                  checked={selectedRecipeIds.includes(r.id)}
                  onChange={() => toggleRecipeSelection(r.id)}
                />
                {r.name} ({r.calories} cal)
              </label>
            </li>
          ))}
        </ul>

        <button onClick={handleCreate}>Create Meal Plan</button>
      </div>
    </div>
  );
}

export default MealPlansPage;
