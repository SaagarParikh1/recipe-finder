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

export type Cuisine = 'All' | 'Italian' | 'Mexican' | 'Asian' | 'American' | 'Mediterranean';