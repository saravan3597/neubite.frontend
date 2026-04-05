import React from 'react';
import { RecipeCard } from '../features/recipes/components/RecipeCard';

export const Dashboard: React.FC = () => {

  const mockRecipes = [
    {
      id: '1',
      title: 'Healthy Chicken Salad',
      matchedIngredients: [{ id: '1', name: 'Chicken Breast' }, { id: '2', name: 'Lettuce' }],
      missingIngredients: [{ id: '3', name: 'Olive Oil' }],
      nutritionalData: { calories: 350, protein: 40, carbs: 10, fat: 15 },
      timeToCook: '15 mins'
    },
    {
      id: '2',
      title: 'Beef Stir Fry',
      matchedIngredients: [{ id: '4', name: 'Beef' }],
      missingIngredients: [{ id: '5', name: 'Broccoli' }, { id: '6', name: 'Soy Sauce' }],
      nutritionalData: { calories: 500, protein: 45, carbs: 20, fat: 25 },
      timeToCook: '25 mins'
    },
    {
      id: '3',
      title: 'Avocado Toast & Egg',
      matchedIngredients: [{ id: '7', name: 'Bread' }, { id: '8', name: 'Eggs' }],
      missingIngredients: [{ id: '9', name: 'Avocado' }],
      nutritionalData: { calories: 420, protein: 18, carbs: 32, fat: 22 },
      timeToCook: '10 mins'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-surface-900">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">
          Welcome back! Here are your personalized recipe suggestions for today.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-surface-50">
          <h2 className="text-lg font-semibold text-surface-900">Suggested Recipes</h2>
          <button className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
            View all
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
