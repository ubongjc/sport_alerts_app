import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { useAlertPreferences } from "@/hooks/useAlerts";
import { AlertPreferencesData } from "@shared/schema";
import { ALL_SPORTS_IN_ORDER } from "@/data/sportLeagues";
import { getSportDisplayName } from "@/data/sportLeagues";
import SportAnimation from "@/components/SportAnimation";
import { useToast } from "@/hooks/use-toast";

interface StepButtonProps {
  sportId: string;
  stepName: string;
  done: boolean;
  onClick: () => void;
}

const StepButton = ({ sportId, stepName, done, onClick }: StepButtonProps) => {
  return (
    <Button
      className={`w-full flex items-center justify-between ${
        done 
          ? "bg-green-600 hover:bg-green-700" 
          : "bg-[hsl(var(--sky-blue))] hover:bg-[hsl(var(--claret))]"
      }`}
      onClick={onClick}
    >
      <span>{stepName}</span>
      {done && <Check className="h-4 w-4 ml-2" />}
    </Button>
  );
};

export default function MultiSportSetup() {
  const [, setLocation] = useLocation();
  const { preferences, isLoading, updatePreferences } = useAlertPreferences();
  const { toast } = useToast();
  
  // State for tracking which sports are selected and configured
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [configuredAlerts, setConfiguredAlerts] = useState<Record<string, boolean>>({});
  const [configuredLeagues, setConfiguredLeagues] = useState<Record<string, boolean>>({});
  
  // Load selected sports and configuration status when preferences change
  useEffect(() => {
    if (preferences?.sports) {
      // Get the selected sports in order
      const sports = ALL_SPORTS_IN_ORDER.filter(sportId => 
        preferences.sports[sportId] === true
      );
      setSelectedSports(sports);
      
      // Check which sports have configured alerts
      const alertsStatus: Record<string, boolean> = {};
      const leaguesStatus: Record<string, boolean> = {};
      
      sports.forEach(sportId => {
        // Check if the sport has alerts configured
        const sportAlerts = preferences.sportAlerts?.[sportId];
        alertsStatus[sportId] = !!sportAlerts?.enabled;
        
        // Check if the sport has leagues selected
        leaguesStatus[sportId] = sportAlerts?.leagues && 
          Object.keys(sportAlerts.leagues).length > 0;
      });
      
      setConfiguredAlerts(alertsStatus);
      setConfiguredLeagues(leaguesStatus);
    }
  }, [preferences]);
  
  // Check if all sports are fully configured
  const allSportsConfigured = selectedSports.every(sportId => 
    configuredAlerts[sportId] && configuredLeagues[sportId]
  );
  
  // Handle finishing the setup process
  const handleFinish = () => {
    // Complete the onboarding process
    localStorage.setItem('onboardingCompleted', 'true');
    
    // Navigate to the live matches page
    setLocation('/live');
    
    toast({
      title: "Setup complete!",
      description: "Your sports preferences have been configured. You're now ready to view matches."
    });
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
          <div className="text-center p-8">
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
            <p className="mb-4 text-gray-600">
              Configure alerts and leagues for each sport below:
            </p>
            
            <div className="space-y-4 mb-8">
              {selectedSports.map((sportId) => (
                <Card key={sportId} className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10">
                      <SportAnimation sport={sportId} isSelected={true} />
                    </div>
                    <h2 className="text-lg font-semibold">{getSportDisplayName(sportId)}</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <StepButton 
                      sportId={sportId}
                      stepName="Configure Alerts"
                      done={configuredAlerts[sportId]}
                      onClick={() => setLocation(`/alert-setup/${sportId}`)}
                    />
                    
                    <StepButton 
                      sportId={sportId}
                      stepName="Select Leagues"
                      done={configuredLeagues[sportId]}
                      onClick={() => setLocation(`/league-selection/${sportId}`)}
                    />
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setLocation('/sport-selection')}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sport Selection
              </Button>
              
              <Button
                onClick={handleFinish}
                disabled={!allSportsConfigured}
                className="flex items-center bg-[hsl(var(--sky-blue))] hover:bg-[hsl(var(--claret))]"
              >
                {allSportsConfigured ? "View Live Matches" : "Complete All Steps First"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}