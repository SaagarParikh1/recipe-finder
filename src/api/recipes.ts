import axios from 'axios';
import { SpoonacularRecipe, Recipe, Cuisine } from '../types';

const API_KEY = '64359978f3fe4134b4a655a506bc02bd';
const BASE_URL = 'https://api.spoonacular.com/recipes';

export async function searchRecipes(query: string, cuisine: Cuisine = 'All'): Promise<Recipe[]> {
  try {
    // First, get recipes for the selected cuisine
    const params = {
      apiKey: API_KEY,
      query,
      cuisine: cuisine !== 'All' ? cuisine : '',
      number: 24, // Increased to get more variety
      addRecipeInformation: true,
      fillIngredients: true,
      instructionsRequired: true,
      sort: 'popularity', // Sort by popularity to get better results
    };

    const response = await axios.get(`${BASE_URL}/complexSearch`, { params });
    const recipes = await Promise.all(
      response.data.results.map(async (result: any) => {
        const recipeDetails = await getRecipeDetails(result.id);
        return transformRecipe(recipeDetails);
      })
    );

    // Group recipes by cuisine if 'All' is selected
    if (cuisine === 'All') {
      return recipes.reduce((acc: Recipe[], recipe: Recipe) => {
        // Ensure we have a good mix of cuisines
        const existingCuisineCount = acc.filter(r => r.cuisine === recipe.cuisine).length;
        if (existingCuisineCount < 4) { // Limit to 4 recipes per cuisine
          return [...acc, recipe];
        }
        return acc;
      }, []);
    }

    return recipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

export async function getPopularRecipesByCuisine(cuisine: string): Promise<Recipe[]> {
  try {
    const params = {
      apiKey: API_KEY,
      cuisine,
      number: 6, // Number of recipes per cuisine
      addRecipeInformation: true,
      fillIngredients: true,
      instructionsRequired: true,
      sort: 'popularity',
    };

    const response = await axios.get(`${BASE_URL}/complexSearch`, { params });
    const recipes = await Promise.all(
      response.data.results.map(async (result: any) => {
        const recipeDetails = await getRecipeDetails(result.id);
        return transformRecipe(recipeDetails);
      })
    );

    return recipes;
  } catch (error) {
    console.error('Error fetching popular recipes:', error);
    return [];
  }
}

async function getRecipeDetails(id: number): Promise<SpoonacularRecipe> {
  const params = {
    apiKey: API_KEY,
  };

  const response = await axios.get(`${BASE_URL}/${id}/information`, { params });
  return response.data;
}

function transformRecipe(spoonacularRecipe: SpoonacularRecipe): Recipe {
  // Map Spoonacular cuisines to our supported cuisines
  let cuisine = spoonacularRecipe.cuisines[0] || 'Other';
  if (cuisine.toLowerCase().includes('mediterranean')) {
    cuisine = 'Mediterranean';
  } else if (cuisine.toLowerCase().includes('asian') || 
             cuisine.toLowerCase().includes('chinese') || 
             cuisine.toLowerCase().includes('japanese') || 
             cuisine.toLowerCase().includes('korean') || 
             cuisine.toLowerCase().includes('thai')) {
    cuisine = 'Asian';
  } else if (cuisine.toLowerCase().includes('american')) {
    cuisine = 'American';
  } else if (cuisine.toLowerCase().includes('mexican')) {
    cuisine = 'Mexican';
  } else if (cuisine.toLowerCase().includes('italian')) {
    cuisine = 'Italian';
  }

  return {
    id: spoonacularRecipe.id.toString(),
    name: spoonacularRecipe.title,
    cuisine,
    ingredients: spoonacularRecipe.extendedIngredients.map(ing => ing.original),
    instructions: spoonacularRecipe.analyzedInstructions[0]?.steps.map(step => step.step) || [],
    image: spoonacularRecipe.image,
    prepTime: '0 mins',
    cookTime: `${spoonacularRecipe.readyInMinutes} mins`,
    servings: spoonacularRecipe.servings,
  };
}