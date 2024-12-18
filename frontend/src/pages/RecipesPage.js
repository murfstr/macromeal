import React, { useEffect, useState } from 'react';
import { fetchRecipes, createRecipe, searchSpoonacular, analyzeNutritionix } from '../services/api';
import NavBar from '../components/NavBar';

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [spoonacularResults, setSpoonacularResults] = useState([]);
  
  const [nutritionText, setNutritionText] = useState('');
  const [nutritionData, setNutritionData] = useState(null);

  useEffect(() => {
    async function loadRecipes() {
      const data = await fetchRecipes();
      setRecipes(data);
    }
    loadRecipes();
  }, []);

  const handleCreate = async () => {
    const newRecipe = await createRecipe({ name, calories: parseInt(calories, 10) });
    setRecipes([...recipes, newRecipe]);
    setName('');
    setCalories(0);
  };

  const handleSpoonacularSearch = async () => {
    const data = await searchSpoonacular(searchQuery);
    setSpoonacularResults(data.results || []);
  };

  const handleNutritionixAnalyze = async () => {
    const data = await analyzeNutritionix(nutritionText);
    setNutritionData(data);
  };

  return (
    <div>
      <NavBar />
      <h1>Recipes</h1>
      <ul>
        {recipes.map(r => (
          <li key={r.id}>{r.name} ({r.calories} cal)</li>
        ))}
      </ul>

      <h2>Create Recipe</h2>
      <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
      <input type="number" placeholder="Calories" value={calories} onChange={(e)=>setCalories(e.target.value)} />
      <button onClick={handleCreate}>Create</button>

      <h2>Spoonacular Search</h2>
      <input placeholder="Search Query" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} />
      <button onClick={handleSpoonacularSearch}>Search</button>
      <ul>
        {spoonacularResults.map((res, i) => (
          <li key={i}>{res.title}</li>
        ))}
      </ul>

      <h2>Nutritionix Analyze</h2>
      <input placeholder="Food Description" value={nutritionText} onChange={(e)=>setNutritionText(e.target.value)} />
      <button onClick={handleNutritionixAnalyze}>Analyze</button>
      {nutritionData && (
        <div>
          <h3>Nutrition Data</h3>
          <pre>{JSON.stringify(nutritionData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default RecipesPage;
