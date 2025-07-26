import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAlertPreferences } from '@/hooks/useAlerts';
import { AlertPreferencesData } from '@shared/schema';

// Types for our sport configuration context
interface SportConfigContextType {
  selectedSports: string[];
  currentSportIndex: number;
  currentStep: 'alerts' | 'leagues';
  goToNextSport: () => void;
  goToNextStep: () => void;
  resetWorkflow: () => void;
  isWorkflowComplete: boolean;
  completeWorkflow: () => void;
}

// Default context values
const SportConfigContext = createContext<SportConfigContextType>({
  selectedSports: [],
  currentSportIndex: 0,
  currentStep: 'alerts',
  goToNextSport: () => {},
  goToNextStep: () => {},
  resetWorkflow: () => {},
  isWorkflowComplete: false,
  completeWorkflow: () => {},
});

// Hook to use the sport config context
export const useSportConfig = () => useContext(SportConfigContext);

export const SportConfigProvider = ({ children }: { children: ReactNode }) => {
  const [, setLocation] = useLocation();
  const { preferences } = useAlertPreferences();
  
  // State for tracking the configuration workflow
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [currentSportIndex, setCurrentSportIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState<'alerts' | 'leagues'>('alerts');
  const [isWorkflowComplete, setIsWorkflowComplete] = useState(false);
  
  // Load selected sports when preferences change
  useEffect(() => {
    if (preferences?.sports) {
      // Get array of selected sport IDs
      const sportsList = Object.entries(preferences.sports)
        .filter(([_, isSelected]) => isSelected)
        .map(([sportId]) => sportId);
      
      setSelectedSports(sportsList);
      
      // Check if we're in an active workflow
      const activeWorkflow = localStorage.getItem('sportConfigWorkflow');
      if (activeWorkflow) {
        const workflowData = JSON.parse(activeWorkflow);
        setCurrentSportIndex(workflowData.sportIndex || 0);
        setCurrentStep(workflowData.step || 'alerts');
      }
    }
  }, [preferences]);
  
  // Move to the next sport in the sequence
  const goToNextSport = () => {
    if (currentSportIndex < selectedSports.length - 1) {
      const nextIndex = currentSportIndex + 1;
      setCurrentSportIndex(nextIndex);
      setCurrentStep('alerts');
      
      // Save workflow state
      saveWorkflowState(nextIndex, 'alerts');
      
      // Navigate to the alert setup for the next sport
      const nextSport = selectedSports[nextIndex];
      setLocation(`/alert-setup/${nextSport}`);
    } else {
      // All sports are configured
      completeWorkflow();
    }
  };
  
  // Move from alerts to leagues for the current sport
  const goToNextStep = () => {
    if (currentStep === 'alerts') {
      setCurrentStep('leagues');
      
      // Save workflow state
      saveWorkflowState(currentSportIndex, 'leagues');
      
      // Navigate to league selection for current sport
      const currentSport = selectedSports[currentSportIndex];
      setLocation(`/league-selection/${currentSport}`);
    } else {
      // If we're already at leagues, go to the next sport
      goToNextSport();
    }
  };
  
  // Save the current workflow state to localStorage
  const saveWorkflowState = (sportIndex: number, step: 'alerts' | 'leagues') => {
    localStorage.setItem('sportConfigWorkflow', JSON.stringify({
      sportIndex,
      step,
      sports: selectedSports
    }));
  };
  
  // Reset the workflow
  const resetWorkflow = () => {
    setCurrentSportIndex(0);
    setCurrentStep('alerts');
    localStorage.removeItem('sportConfigWorkflow');
  };
  
  // Complete the workflow
  const completeWorkflow = () => {
    setIsWorkflowComplete(true);
    localStorage.removeItem('sportConfigWorkflow');
    setLocation('/live'); // Navigate to live matches
  };
  
  return (
    <SportConfigContext.Provider 
      value={{ 
        selectedSports,
        currentSportIndex,
        currentStep,
        goToNextSport,
        goToNextStep,
        resetWorkflow,
        isWorkflowComplete,
        completeWorkflow
      }}
    >
      {children}
    </SportConfigContext.Provider>
  );
};