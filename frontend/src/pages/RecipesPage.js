import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import RecipeCard from '../components/RecipeCard'; // Import the RecipeCard component
import {
  fetchRecipes,
  createRecipe,
  addIngredientByName,
  fetchIngredients,
  deleteIngredient,
  deleteRecipe, // Import the deleteRecipe function
} from '../services/api';

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [ingredientNameSearch, setIngredientNameSearch] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    async function loadData() {
      try {
        const rData = await fetchRecipes();
        setRecipes(rData);
        const iData = await fetchIngredients();
        setIngredients(iData);
      } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load recipes or ingredients.');
      }
    }
    loadData();
  }, []);

  // Handle adding an ingredient via Nutritionix
  const handleAddIngredientFromNutritionix = async () => {
    if (!ingredientNameSearch.trim()) {
      alert('Enter an ingredient name');
      return;
    }
    try {
      const newIng = await addIngredientByName(ingredientNameSearch);
      setIngredients((prev) => [...prev, newIng]);
      setIngredientNameSearch('');
    } catch (error) {
      console.error(error);
      alert('Error fetching ingredient');
    }
  };

  // Handle quantity change for ingredients
  const handleQuantityChange = (ingredientId, value) => {
    setQuantities((prev) => ({ ...prev, [ingredientId]: value }));
  };

  // Add an ingredient to the selectedIngredients list
  const handleAddIngredientToRecipe = (ingredientId) => {
    const quantity = quantities[ingredientId]?.trim();
    if (!quantity) {
      alert('Please enter a quantity.');
      return;
    }

    const alreadySelected = selectedIngredients.some(
      (sel) => sel.ingredient_id === ingredientId
    );
    if (alreadySelected) {
      alert(
        'This ingredient is already in the recipe. Remove it first if you want to change the quantity.'
      );
      return;
    }

    setSelectedIngredients((prev) => [
      ...prev,
      { ingredient_id: ingredientId, quantity },
    ]);
    setQuantities((prev) => ({ ...prev, [ingredientId]: '' }));
  };

  // Delete an ingredient from the database
  const handleDeleteIngredient = async (ingredientId) => {
    try {
      await deleteIngredient(ingredientId);
      setIngredients((prev) => prev.filter((ing) => ing.id !== ingredientId));
      setSelectedIngredients((prev) =>
        prev.filter((sel) => sel.ingredient_id !== ingredientId)
      );
      setQuantities((prev) => {
        const newQ = { ...prev };
        delete newQ[ingredientId];
        return newQ;
      });
    } catch (error) {
      console.error(error);
      alert('Failed to delete ingredient');
    }
  };

  // Remove a selected ingredient from the recipe creation list
  const handleRemoveSelectedIngredient = (ingredientId) => {
    setSelectedIngredients((prev) =>
      prev.filter((sel) => sel.ingredient_id !== ingredientId)
    );
  };

  // Handle deletion of an entire recipe
  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }
    try {
      await deleteRecipe(recipeId); // calls the deleteRecipe API function
      setRecipes((prev) => prev.filter((r) => r.id !== recipeId)); // remove from local state
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe');
    }
  };

  // Handle creation of a new recipe
  const handleCreateRecipe = async () => {
    if (!name.trim()) {
      alert('Please enter a recipe name.');
      return;
    }
    if (selectedIngredients.length === 0) {
      alert('Please add at least one ingredient.');
      return;
    }

    const data = {
      name,
      description,
      recipe_ingredients: selectedIngredients,
    };
    try {
      const newRecipe = await createRecipe(data);
      setRecipes((prev) => [...prev, newRecipe]);
      // Reset form
      setName('');
      setDescription('');
      setSelectedIngredients([]);
      setQuantities({});
    } catch (error) {
      console.error(error);
      alert('Error creating recipe');
    }
  };

  return (
    <div>
      <NavBar />
      <div className="container mt-4">
        <h1>Your Recipes</h1>
        {/* Recipes Display */}
        <div className="row">
          {recipes.map((r) => (
            <div className="col-md-4" key={r.id}>
              <RecipeCard recipe={r} onDelete={handleDeleteRecipe} />
            </div>
          ))}
        </div>

        <hr />
        <h2>Add Ingredient via Nutritionix</h2>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Ingredient name (e.g. chicken)"
            value={ingredientNameSearch}
            onChange={(e) => setIngredientNameSearch(e.target.value)}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={handleAddIngredientFromNutritionix}
          >
            Fetch & Add Ingredient
          </button>
        </div>

        <hr />
        <h2>Create a New Recipe</h2>
        <div className="mb-3">
          <label className="form-label">Recipe Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Recipe Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            placeholder="Recipe Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <h3>Available Ingredients</h3>
        <div className="row">
          {ingredients.map((i) => {
            const quantityValue = quantities[i.id] || '';
            return (
              <div className="col-md-4 mb-3" key={i.id}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">
                      {i.name} ({i.calories} cal)
                    </h5>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Quantity (e.g. 200g)"
                      value={quantityValue}
                      onChange={(e) => handleQuantityChange(i.id, e.target.value)}
                    />
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleAddIngredientToRecipe(i.id)}
                    >
                      Add to Recipe
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteIngredient(i.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <h3>Selected Ingredients</h3>
        {selectedIngredients.length > 0 ? (
          <ul className="list-group mb-3">
            {selectedIngredients.map((sel) => {
              const ing = ingredients.find((ing) => ing.id === sel.ingredient_id);
              if (!ing) return null;
              return (
                <li key={sel.ingredient_id} className="list-group-item d-flex justify-content-between align-items-center">
                  {ing.name} - {sel.quantity}
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemoveSelectedIngredient(sel.ingredient_id)}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No ingredients selected.</p>
        )}

        <button className="btn btn-success" onClick={handleCreateRecipe}>
          Create Recipe
        </button>
      </div>
    </div>
  );
}

export default RecipesPage;
