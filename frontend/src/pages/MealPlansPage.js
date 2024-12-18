import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { fetchMealPlans, createMealPlan } from '../services/api';

function MealPlansPage() {
  const [mealplans, setMealplans] = useState([]);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState(2000);

  useEffect(() => {
    async function loadMealplans() {
      const data = await fetchMealPlans();
      setMealplans(data);
    }
    loadMealplans();
  }, []);

  const handleCreate = async () => {
    const newPlan = await createMealPlan({ name, daily_calorie_goal: goal });
    setMealplans([...mealplans, newPlan]);
    setName('');
    setGoal(2000);
  };

  return (
    <div>
      <NavBar />
      <h1>Meal Plans</h1>
      <ul>
        {mealplans.map(mp => (
          <li key={mp.id}>{mp.name} - {mp.daily_calorie_goal} cal/day</li>
        ))}
      </ul>
      <h2>Create New Meal Plan</h2>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input type="number" placeholder="Goal" value={goal} onChange={e => setGoal(e.target.value)} />
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}

export default MealPlansPage;
