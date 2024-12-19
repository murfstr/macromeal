import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { fetchRecipes, createRecipe, addIngredientByName, fetchIngredients } from '../services/api'; 

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [ingredients, setIngredients] = useState([]);
  const [ingredientNameSearch, setIngredientNameSearch] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  useEffect(() => {
    async function loadData() {
      const rData = await fetchRecipes();
      setRecipes(rData);
      const iData = await fetchIngredients();
      setIngredients(iData);
    }
    loadData();
  }, []);

  const handleAddIngredientFromNutritionix = async () => {
    if (!ingredientNameSearch.trim()) {
      alert('Enter an ingredient name');
      return;
    }
    try {
      const newIng = await addIngredientByName(ingredientNameSearch);
      setIngredients([...ingredients, newIng]);
      setIngredientNameSearch('');
    } catch (error) {
      console.error(error);
      alert('Error fetching ingredient from Nutritionix');
    }
  };

  const handleAddIngredientToRecipe = (ingredientId, quantity) => {
    setSelectedIngredients([...selectedIngredients, { ingredient_id: ingredientId, quantity }]);
  };

  const handleCreateRecipe = async () => {
    const data = {
      name,
      description,
      recipe_ingredients: selectedIngredients
    };
    try {
      const newRecipe = await createRecipe(data);
      setRecipes([...recipes, newRecipe]);
      setName('');
      setDescription('');
      setSelectedIngredients([]);
    } catch (error) {
      console.error(error);
      alert('Error creating recipe');
    }
  };

  return (
    <div>
      <NavBar />
      <div style={{ padding: '20px' }}>
        <h1>Your Recipes</h1>
        <ul>
          {recipes.map(r => (
            <li key={r.id}>
              <strong>{r.name}</strong> - {r.description}
              {r.recipe_ingredients && r.recipe_ingredients.map(ri => (
                <div key={ri.id}>- {ri.quantity} {ri.ingredient.name} ({ri.ingredient.calories} cal)</div>
              ))}
            </li>
          ))}
        </ul>

        <h2>Add Ingredient via Nutritionix</h2>
        <input 
          placeholder="Ingredient name (e.g. chicken)"
          value={ingredientNameSearch}
          onChange={e=>setIngredientNameSearch(e.target.value)}
        />
        <button onClick={handleAddIngredientFromNutritionix}>Fetch & Add Ingredient</button>

        <h2>Create a New Recipe</h2>
        <input placeholder="Recipe Name" value={name} onChange={e=>setName(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />

        <h3>Select Ingredients (from the fetched list)</h3>
        {ingredients.map(i => (
          <div key={i.id}>
            {i.name} ({i.calories} cal)
            <input 
              type="text" 
              placeholder="Quantity (e.g. 200g)" 
              onBlur={e => e.target.value && handleAddIngredientToRecipe(i.id, e.target.value)} 
            />
          </div>
        ))}

        <button onClick={handleCreateRecipe}>Create Recipe</button>
      </div>
    </div>
  );
}

export default RecipesPage;
