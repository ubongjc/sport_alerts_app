import { useContext } from 'react';
import { AlertPreferencesContext } from '@/contexts/AlertPreferencesContext';

export const useAlertPreferences = () => {
  const context = useContext(AlertPreferencesContext);
  
  if (!context) {
    throw new Error('useAlertPreferences must be used within an AlertPreferencesProvider');
  }
  
  return context;
};