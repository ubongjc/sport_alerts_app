import React from 'react';
import { useAlertPreferences } from '@/hooks/useAlerts';
import { getSportDisplayName, ALL_SPORTS_IN_ORDER } from '@/data/sportLeagues';

interface SportNavigationProps {
  currentSport: string;
  onNavigate?: (sport: string) => void;
}

export const SportNavigation: React.FC<SportNavigationProps> = ({ currentSport, onNavigate }) => {
  const { preferences } = useAlertPreferences();
  
  // Get list of selected sports
  const selectedSports = preferences?.sports 
    ? ALL_SPORTS_IN_ORDER.filter(sportId => preferences.sports[sportId])
    : [currentSport];
    
  // Find index of current sport
  const currentIndex = selectedSports.indexOf(currentSport);
  
  // Function to get next sport in the sequence
  const getNextSport = () => {
    const nextIndex = currentIndex + 1;
    return nextIndex < selectedSports.length ? selectedSports[nextIndex] : null;
  };
  
  // Store next sport in window object for easy access
  if (typeof window !== 'undefined') {
    (window as any).nextSportInSequence = getNextSport();
  }
  
  return (
    <div className="flex flex-col items-center my-4">
      <div className="flex justify-center gap-1 mb-2">
        {selectedSports.map((sportId, index) => (
          <div 
            key={sportId}
            className={`rounded-full h-3 w-3 ${
              index < currentIndex 
                ? 'bg-green-500' 
                : index === currentIndex 
                  ? 'bg-[hsl(var(--sky-blue))]' 
                  : 'bg-gray-300'
            }`}
            title={getSportDisplayName(sportId)}
          />
        ))}
      </div>
      
      {selectedSports.length > 1 && (
        <div className="text-xs text-muted-foreground">
          {currentIndex + 1} of {selectedSports.length}: {getSportDisplayName(currentSport)}
        </div>
      )}
    </div>
  );
};