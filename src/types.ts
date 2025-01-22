export interface Recipe {
  id: string;
  name: string;
  cuisine: string;
  ingredients: string[];
  instructions: string[];
  image: string;
  prepTime: string;
  cookTime: string;
  servings: number;
}

export interface SpoonacularRecipe {
  id: number;
  title: string;
  cuisines: string[];
  extendedIngredients: {
    original: string;
  }[];
  analyzedInstructions: {
    steps: {
      step: string;
    }[];
  }[];
  image: string;
  readyInMinutes: number;
  servings: number;
}

export type Cuisine = 'All' | 'Italian' | 'Mexican' | 'Asian' | 'American' | 'Mediterranean';