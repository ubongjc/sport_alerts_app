import { AlertPreferencesData } from '@shared/schema';
import { ALL_SPORTS_IN_ORDER } from '@/data/sportLeagues'; 

// A simple utility to help reliably manage the multi-sport workflow

/**
 * Get the selected sports in the correct order
 */
export function getSelectedSportsInOrder(preferences: AlertPreferencesData | null): string[] {
  if (!preferences?.sports) return [];
  
  return ALL_SPORTS_IN_ORDER.filter(sportId => 
    preferences.sports[sportId] === true
  );
}

/**
 * Get the next sport in the sequence after current sport
 */
export function getNextSport(preferences: AlertPreferencesData | null, currentSport: string): string | null {
  const selectedSports = getSelectedSportsInOrder(preferences);
  const currentIndex = selectedSports.indexOf(currentSport);
  
  if (currentIndex === -1 || currentIndex >= selectedSports.length - 1) {
    return null; // No next sport
  }
  
  return selectedSports[currentIndex + 1];
}

/**
 * Track and manage the multi-sport flow using localStorage
 */
interface MultiSportState {
  sports: string[];
  currentSportIndex: number;
  step: 'alerts' | 'leagues';
}

export function saveMultiSportState(state: MultiSportState): void {
  localStorage.setItem('multiSportFlow', JSON.stringify(state));
}

export function getMultiSportState(): MultiSportState | null {
  const state = localStorage.getItem('multiSportFlow');
  if (!state) return null;
  
  try {
    return JSON.parse(state) as MultiSportState;
  } catch (e) {
    console.error('Failed to parse multi-sport state', e);
    return null;
  }
}

export function clearMultiSportState(): void {
  localStorage.removeItem('multiSportFlow');
}

/**
 * Initialize the multi-sport flow
 */
export function initializeMultiSportFlow(preferences: AlertPreferencesData): void {
  const selectedSports = getSelectedSportsInOrder(preferences);
  
  if (selectedSports.length > 0) {
    saveMultiSportState({
      sports: selectedSports,
      currentSportIndex: 0,
      step: 'alerts'
    });
  }
}

/**
 * Advance to the next step in the multi-sport flow
 * Returns the next URL to navigate to
 */
export function getNextFlowStep(currentSport: string, currentStep: 'alerts' | 'leagues'): string {
  const state = getMultiSportState();
  
  if (!state) {
    // Fallback if no state is found
    return currentStep === 'alerts' 
      ? `/league-selection/${currentSport}` 
      : '/live';
  }
  
  const { sports, currentSportIndex } = state;
  
  // If we're on alerts, next step is leagues for the same sport
  if (currentStep === 'alerts') {
    saveMultiSportState({
      ...state,
      step: 'leagues'
    });
    return `/league-selection/${currentSport}`;
  }
  
  // If we're on leagues, next step is alerts for the next sport (or finish)
  const nextSportIndex = currentSportIndex + 1;
  
  if (nextSportIndex < sports.length) {
    // Move to next sport, starting with alerts
    saveMultiSportState({
      ...state,
      currentSportIndex: nextSportIndex,
      step: 'alerts'
    });
    return `/alert-setup/${sports[nextSportIndex]}`;
  }
  
  // We've completed all sports, clear the state and go to live matches
  clearMultiSportState();
  return '/live';
}