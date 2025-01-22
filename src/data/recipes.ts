import { Recipe } from '../types';

export const recipes: Recipe[] = [
  {
    id: '1',
    name: 'Spaghetti Carbonara',
    cuisine: 'Italian',
    ingredients: ['spaghetti', 'eggs', 'pecorino cheese', 'guanciale', 'black pepper'],
    instructions: [
      'Cook pasta in salted water',
      'Mix eggs with grated cheese',
      'Crisp guanciale and combine all ingredients'
    ],
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=800',
    prepTime: '10 mins',
    cookTime: '20 mins',
    servings: 4
  },
  {
    id: '2',
    name: 'Chicken Tacos',
    cuisine: 'Mexican',
    ingredients: ['chicken breast', 'tortillas', 'onion', 'cilantro', 'lime'],
    instructions: [
      'Season and cook chicken',
      'Warm tortillas',
      'Assemble tacos with toppings'
    ],
    image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&q=80&w=800',
    prepTime: '15 mins',
    cookTime: '25 mins',
    servings: 4
  },
  {
    id: '3',
    name: 'Stir-Fried Noodles',
    cuisine: 'Asian',
    ingredients: ['noodles', 'vegetables', 'soy sauce', 'garlic', 'ginger'],
    instructions: [
      'Cook noodles according to package',
      'Stir-fry vegetables with aromatics',
      'Combine and season'
    ],
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=800',
    prepTime: '15 mins',
    cookTime: '15 mins',
    servings: 3
  }
];