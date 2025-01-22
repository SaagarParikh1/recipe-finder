import React from 'react';
import { Clock, Users, Heart } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export function RecipeCard({ recipe, isFavorite, onToggleFavorite }: RecipeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={recipe.image} 
        alt={recipe.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{recipe.name}</h3>
            <span className="inline-block px-2 py-1 mt-1 text-sm bg-gray-100 text-gray-600 rounded">
              {recipe.cuisine}
            </span>
          </div>
          <button
            onClick={() => onToggleFavorite(recipe.id)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Heart 
              className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            />
          </button>
        </div>
        
        <div className="mt-4 flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{recipe.cookTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span className="text-sm">{recipe.servings} servings</span>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-medium text-gray-700">Ingredients:</h4>
          <div className="mt-1 flex flex-wrap gap-1">
            {recipe.ingredients.map((ingredient, index) => (
              <span 
                key={index}
                className="px-2 py-1 text-sm bg-gray-50 text-gray-600 rounded"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}