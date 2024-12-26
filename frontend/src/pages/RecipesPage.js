// src/pages/RecipesPage.jsx
import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import RecipeCard from '../components/RecipeCard';
import {
  fetchRecipes,
  createRecipe,
  addIngredientByName,
  fetchIngredients,
  deleteIngredient,
  deleteRecipe,
} from '../services/api';
import { toast } from 'react-toastify';
import { Button, Form, Container, Row, Col, ListGroup, InputGroup, Card} from 'react-bootstrap';

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
        toast.error('Failed to load recipes or ingredients.');
      }
    }
    loadData();
  }, []);

  // Handle adding an ingredient via Nutritionix
  const handleAddIngredientFromNutritionix = async () => {
    if (!ingredientNameSearch.trim()) {
      toast.error('Enter an ingredient name');
      return;
    }
    try {
      const newIng = await addIngredientByName(ingredientNameSearch);
      setIngredients((prev) => [...prev, newIng]);
      toast.success('Ingredient added successfully!');
      setIngredientNameSearch('');
    } catch (error) {
      console.error(error);
      toast.error('Error fetching ingredient');
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
      toast.error('Please enter a quantity.');
      return;
    }

    const alreadySelected = selectedIngredients.some(
      (sel) => sel.ingredient_id === ingredientId
    );
    if (alreadySelected) {
      toast.error('This ingredient is already in the recipe. Remove it first if you want to change the quantity.');
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
    if (!window.confirm('Really delete this ingredient?')) return;
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
      toast.success('Ingredient deleted successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete ingredient');
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
      await deleteRecipe(recipeId);
      setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
      toast.success('Recipe deleted successfully!');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
    }
  };

  // Handle creation of a new recipe
  const handleCreateRecipe = async () => {
    if (!name.trim()) {
      toast.error('Please enter a recipe name.');
      return;
    }
    if (selectedIngredients.length === 0) {
      toast.error('Please add at least one ingredient.');
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
      toast.success('Recipe created successfully!');
      // Reset form
      setName('');
      setDescription('');
      setSelectedIngredients([]);
      setQuantities({});
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        toast.error(`Error creating recipe: ${JSON.stringify(error.response.data)}`);
      } else {
        toast.error('Error creating recipe');
      }
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
        <Form>
          <Form.Group className="mb-3" controlId="recipeName">
            <Form.Label>Recipe Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Recipe Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="recipeDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Recipe Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <h3>Available Ingredients</h3>
          <Row>
            {ingredients.map((i) => {
              const quantityValue = quantities[i.id] || '';
              return (
                <Col md={4} className="mb-3" key={i.id}>
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        {i.name} ({i.calories} cal)
                      </Card.Title>
                      <Form.Control
                        type="text"
                        className="mb-2"
                        placeholder="Quantity (e.g. 200g)"
                        value={quantityValue}
                        onChange={(e) => handleQuantityChange(i.id, e.target.value)}
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleAddIngredientToRecipe(i.id)}
                      >
                        Add to Recipe
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteIngredient(i.id)}
                      >
                        Remove
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>

          <h3>Selected Ingredients</h3>
          {selectedIngredients.length > 0 ? (
            <ListGroup className="mb-3">
              {selectedIngredients.map((sel) => {
                const ing = ingredients.find((ing) => ing.id === sel.ingredient_id);
                if (!ing) return null;
                return (
                  <ListGroup.Item key={sel.ingredient_id} className="d-flex justify-content-between align-items-center">
                    {ing.name} - {sel.quantity}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveSelectedIngredient(sel.ingredient_id)}
                    >
                      Remove
                    </Button>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          ) : (
            <p>No ingredients selected.</p>
          )}

          <Button variant="success" onClick={handleCreateRecipe}>
            Create Recipe
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default RecipesPage;
