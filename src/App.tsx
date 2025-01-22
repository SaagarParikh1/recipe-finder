import React, { useState, useEffect } from 'react';
import { Search, ChefHat, Loader2, Sparkles } from 'lucide-react';
import { RecipeCard } from './components/RecipeCard';
import { Recipe, Cuisine } from './types';
import { searchRecipes, getPopularRecipesByCuisine } from './api/recipes';

const cuisineTypes: Cuisine[] = ['All', 'Italian', 'Mexican', 'Asian', 'American', 'Mediterranean'];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine>('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [popularRecipes, setPopularRecipes] = useState<Record<string, Recipe[]>>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch popular recipes on initial load
  useEffect(() => {
    const fetchPopularRecipes = async () => {
      setInitialLoading(true);
      try {
        const popularByCategory = await Promise.all(
          cuisineTypes
            .filter(cuisine => cuisine !== 'All')
            .map(async (cuisine) => {
              const recipes = await getPopularRecipesByCuisine(cuisine);
              return [cuisine, recipes] as [string, Recipe[]];
            })
        );
        
        setPopularRecipes(Object.fromEntries(popularByCategory));
      } catch (err) {
        console.error('Error fetching popular recipes:', err);
        setError('Failed to load popular recipes. Please try again later.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPopularRecipes();
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch recipes when search term or cuisine changes
  useEffect(() => {
    const fetchRecipes = async () => {
      if (!debouncedSearch) {
        setRecipes([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const results = await searchRecipes(debouncedSearch, selectedCuisine);
        setRecipes(results);
      } catch (err) {
        setError('Failed to fetch recipes. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [debouncedSearch, selectedCuisine]);

  const filteredRecipes = recipes.filter((recipe) => {
    return !showOnlyFavorites || favorites.includes(recipe.id);
  });

  // Group recipes by cuisine when showing all cuisines
  const groupedRecipes = selectedCuisine === 'All' 
    ? cuisineTypes.slice(1).reduce((acc, cuisine) => {
        const cuisineRecipes = filteredRecipes.filter(recipe => recipe.cuisine === cuisine);
        if (cuisineRecipes.length > 0) {
          acc[cuisine] = cuisineRecipes;
        }
        return acc;
      }, {} as Record<string, Recipe[]>)
    : { [selectedCuisine]: filteredRecipes };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fId => fId !== id)
        : [...prev, id]
    );
  };

  const displayRecipes = debouncedSearch ? groupedRecipes : popularRecipes;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">Recipe Finder</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search recipes or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex flex-wrap gap-2">
              {cuisineTypes.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCuisine === cuisine
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                showOnlyFavorites
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Favorites
            </button>
          </div>
        </div>

        {/* Loading States */}
        {(loading || initialLoading) && (
          <div className="text-center py-12">
            <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">
              {initialLoading ? 'Loading popular recipes...' : 'Searching for recipes...'}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Recipe Sections */}
        {!loading && !initialLoading && !error && Object.entries(displayRecipes).map(([cuisine, recipes]) => (
          recipes.length > 0 && (
            <div key={cuisine} className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{cuisine} Cuisine</h2>
                {!debouncedSearch && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-orange-100 rounded-full">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-orange-700">Popular Recipes</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={favorites.includes(recipe.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </div>
          )
        ))}

        {/* Empty State */}
        {!loading && !initialLoading && !error && Object.keys(displayRecipes).length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No recipes found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;