import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useAuthStore } from '../shared/stores/useAuthStore';
import { useGroceryPantryStore } from '../shared/stores/useGroceryPantryStore';
import { useRecipeStore } from '../shared/stores/useRecipeStore';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID as string,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID as string,
    },
  },
});

export const App: React.FC = () => {
  const { checkSession, isLoading } = useAuthStore();
  const loadPantryAndGrocery = useGroceryPantryStore((s) => s.loadFromServer);
  const loadSavedRecipes = useRecipeStore((s) => s.loadFromServer);

  useEffect(() => {
    checkSession();
    loadPantryAndGrocery();
    loadSavedRecipes();
  }, [checkSession, loadPantryAndGrocery, loadSavedRecipes]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary"></div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
};
