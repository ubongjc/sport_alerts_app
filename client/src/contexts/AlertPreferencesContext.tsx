import { createContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { AlertPreferencesData } from '@shared/schema';

interface AlertPreferencesContextType {
  preferences: AlertPreferencesData | null;
  isLoading: boolean;
  updatePreferences: (prefs: AlertPreferencesData) => Promise<void>;
}

export const AlertPreferencesContext = createContext<AlertPreferencesContextType>({
  preferences: null,
  isLoading: false,
  updatePreferences: async () => {},
});

export const AlertPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  
  // Fetch user's alert preferences
  const { data, isLoading } = useQuery<{ preferences: AlertPreferencesData }>({
    queryKey: ['/api/alert-preferences'],
    refetchOnWindowFocus: false,
  });
  
  // Mutation for updating preferences
  const mutation = useMutation({
    mutationFn: async (preferences: AlertPreferencesData) => {
      await apiRequest('POST', '/api/alert-preferences', preferences);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alert-preferences'] });
    },
  });
  
  const updatePreferences = async (prefs: AlertPreferencesData) => {
    await mutation.mutateAsync(prefs);
  };
  
  return (
    <AlertPreferencesContext.Provider 
      value={{ 
        preferences: data?.preferences || null, 
        isLoading, 
        updatePreferences 
      }}
    >
      {children}
    </AlertPreferencesContext.Provider>
  );
};