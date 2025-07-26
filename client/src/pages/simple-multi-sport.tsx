import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useAlertPreferences } from '@/hooks/useAlerts';
import { AlertPreferencesData } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { getSportDisplayName, ALL_SPORTS_IN_ORDER } from '@/data/sportLeagues';
import SportAnimation from '@/components/SportAnimation';

export default function SimpleMultiSport() {
  const [, setLocation] = useLocation();
  const { preferences, isLoading } = useAlertPreferences();
  const { toast } = useToast();
  
  // State for the multi-sport setup
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [currentSportIndex, setCurrentSportIndex] = useState(0);
  const [sportConfigs, setSportConfigs] = useState<Record<string, {alerts: boolean, leagues: boolean}>>({});
  
  // Initialize from preferences
  useEffect(() => {
    if (preferences?.sports) {
      // Get selected sports in order
      const sports = ALL_SPORTS_IN_ORDER.filter(sportId => 
        preferences.sports[sportId] === true
      );
      setSelectedSports(sports);
      
      // Check configuration status for each sport
      const configs: Record<string, {alerts: boolean, leagues: boolean}> = {};
      
      sports.forEach(sportId => {
        const sportConfig = preferences.sportAlerts?.[sportId];
        
        configs[sportId] = {
          alerts: !!sportConfig?.enabled,
          leagues: sportConfig?.leagues ? Object.keys(sportConfig.leagues).length > 0 : false
        };
      });
      
      setSportConfigs(configs);
    }
  }, [preferences]);
  
  // Get current sport
  const currentSport = selectedSports[currentSportIndex] || 'soccer';
  
  // Check if current sport is configured
  const isCurrentSportConfigured = 
    sportConfigs[currentSport]?.alerts && 
    sportConfigs[currentSport]?.leagues;
  
  // Go to previous sport
  const goToPreviousSport = () => {
    if (currentSportIndex > 0) {
      setCurrentSportIndex(currentSportIndex - 1);
    }
  };
  
  // Go to next sport
  const goToNextSport = () => {
    if (currentSportIndex < selectedSports.length - 1) {
      setCurrentSportIndex(currentSportIndex + 1);
    } else {
      // All sports configured, go to live matches
      toast({
        title: "Setup complete!",
        description: "Your sports preferences have been saved. Now showing live matches."
      });
      
      // Mark onboarding as complete
      localStorage.setItem('onboardingCompleted', 'true');
      
      // Go to live matches
      setLocation('/live');
    }
  };
  
  // Configure alerts for current sport
  const configureAlerts = () => {
    setLocation(`/alert-setup/${currentSport}`);
  };
  
  // Configure leagues for current sport
  const configureLeagues = () => {
    setLocation(`/league-selection/${currentSport}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[hsl(var(--sky-blue))] text-white p-4 flex justify-center shadow-md">
        <h1 className="text-xl font-bold">Configure Your Sports</h1>
      </header>
      
      {/* Main Content */}
      <main className="p-4 flex-1 pb-24">
        {selectedSports.length === 0 ? (
          <div className="text-center py-8">
            <p className="mb-4">No sports selected yet.</p>
            <Button 
              onClick={() => setLocation('/sport-selection')}
              className="bg-[hsl(var(--sky-blue))] hover:bg-[hsl(var(--claret))]"
            >
              Select Sports
            </Button>
          </div>
        ) : (
          <>
            {/* Sport selection progress */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2">
                {selectedSports.map((sportId, index) => (
                  <React.Fragment key={sportId}>
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === currentSportIndex 
                          ? 'bg-[hsl(var(--sky-blue))] text-white'
                          : sportConfigs[sportId]?.alerts && sportConfigs[sportId]?.leagues
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                      }`}
                      onClick={() => setCurrentSportIndex(index)}
                    >
                      {sportConfigs[sportId]?.alerts && sportConfigs[sportId]?.leagues 
                        ? <Check className="h-4 w-4" /> 
                        : index + 1}
                    </div>
                    {index < selectedSports.length - 1 && (
                      <div className="w-4 h-[2px] bg-gray-300"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            {/* Current sport configuration */}
            <Card className="p-4 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12">
                  <SportAnimation sport={currentSport} isSelected={true} />
                </div>
                <h2 className="text-xl font-semibold">{getSportDisplayName(currentSport)}</h2>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h3 className="font-medium">Alert Settings</h3>
                    <p className="text-sm text-gray-500">Configure which events to get notified about</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {sportConfigs[currentSport]?.alerts && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Configured
                      </span>
                    )}
                    <Button 
                      onClick={configureAlerts}
                      className="bg-[hsl(var(--sky-blue))] hover:bg-[hsl(var(--claret))]"
                    >
                      {sportConfigs[currentSport]?.alerts ? 'Edit' : 'Configure'}
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h3 className="font-medium">League Selection</h3>
                    <p className="text-sm text-gray-500">Choose which leagues to follow</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {sportConfigs[currentSport]?.leagues && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Selected
                      </span>
                    )}
                    <Button 
                      onClick={configureLeagues}
                      className="bg-[hsl(var(--sky-blue))] hover:bg-[hsl(var(--claret))]"
                    >
                      {sportConfigs[currentSport]?.leagues ? 'Edit' : 'Select'}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={goToPreviousSport}
                  disabled={currentSportIndex === 0}
                  className="flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <Button
                  onClick={goToNextSport}
                  disabled={!isCurrentSportConfigured}
                  className="flex items-center gap-1 bg-[hsl(var(--sky-blue))] hover:bg-[hsl(var(--claret))]"
                >
                  {currentSportIndex < selectedSports.length - 1 ? 'Next' : 'Finish'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
            
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setLocation('/sport-selection')}
                className="text-gray-500 text-sm"
              >
                Back to Sport Selection
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}