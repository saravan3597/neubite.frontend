import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useAuthStore } from '../shared/stores/useAuthStore';
import { useGroceryPantryStore } from '../shared/stores/useGroceryPantryStore';
import { useRecipeStore } from '../shared/stores/useRecipeStore';
import { Amplify } from 'aws-amplify';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { scheduleWeeklyMealNotifications } from '../shared/services/notificationService';

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
    // checkSession must complete first so the token is in the store
    // before any authenticated API calls are made.
    checkSession().then(() => {
      loadPantryAndGrocery();
      loadSavedRecipes();
    });
  }, [checkSession, loadPantryAndGrocery, loadSavedRecipes]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // Schedule 7-day rolling batch of meal-time notifications
    scheduleWeeklyMealNotifications();

    // When user taps a notification, navigate to the route stored in extra.route
    const listener = LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
      const route: string = action.notification.extra?.route ?? '/dashboard';
      router.navigate(route);
    });

    return () => {
      listener.then(l => l.remove());
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary"></div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
};
