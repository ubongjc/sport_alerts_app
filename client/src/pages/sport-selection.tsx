import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useAlertPreferences } from "@/hooks/useAlerts";
import SportAnimation from "@/components/SportAnimation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertPreferencesData } from "@shared/schema";
import { ALL_SPORTS_IN_ORDER } from "@/data/sportLeagues";

// Sport options with icons - expanded list of sports
const SPORTS = [
  {
    id: "soccer",
    name: "Soccer",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <path d="M2 12h20" />
      </svg>
    ),
    active: true,
  },
  {
    id: "basketball",
    name: "Basketball",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M4.93 4.93l4.24 4.24" />
        <path d="M14.83 14.83l4.24 4.24" />
        <path d="M14.83 9.17l4.24-4.24" />
        <path d="M9.17 14.83l-4.24 4.24" />
      </svg>
    ),
    active: true,
  },
  {
    id: "football",
    name: "Football",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M16 8l-4 4-4-4" />
        <path d="M8 16l4-4 4 4" />
      </svg>
    ),
    active: true,
  },
  {
    id: "hockey",
    name: "Hockey",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20" />
        <path d="M2 12h20" />
        <path d="M20 16H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2z" />
      </svg>
    ),
    active: true,
  },
  {
    id: "baseball",
    name: "Baseball",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M5.3 7.3a15.3 15.3 0 0 1 13.4 0" />
        <path d="M5.3 16.7a15.3 15.3 0 0 0 13.4 0" />
      </svg>
    ),
    active: true,
  },
  {
    id: "rugby",
    name: "Rugby",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="12" rx="8" ry="10" />
        <path d="M7 10h10" />
        <path d="M7 14h10" />
        <path d="M12 22v-20" />
      </svg>
    ),
    active: true,
  },
  {
    id: "cricket",
    name: "Cricket",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22v-5" />
        <path d="M9 8h6" />
        <path d="M7 6l10 4" />
        <path d="M7 14l10-4" />
      </svg>
    ),
    active: true,
  },
  {
    id: "tennis",
    name: "Tennis",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    active: true,
  },
  {
    id: "tabletennis",
    name: "Table Tennis",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <path d="M18 12a6 6 0 0 0-6-6" />
      </svg>
    ),
    active: true,
  },
  {
    id: "volleyball",
    name: "Volleyball",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <path d="M2 12h20" />
      </svg>
    ),
    active: true,
  },
  {
    id: "handball",
    name: "Handball",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M5.3 7.3a15.3 15.3 0 0 1 13.4 0" />
        <path d="M5.3 16.7a15.3 15.3 0 0 0 13.4 0" />
      </svg>
    ),
    active: true,
  },
  {
    id: "mma",
    name: "MMA",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M9 12h6" />
        <path d="M9 8h6" />
        <path d="M9 16h6" />
      </svg>
    ),
    active: true,
  },
  {
    id: "boxing",
    name: "Boxing",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5a2 2 0 0 1 2 2v1h2V7a2 2 0 0 1 2 -2h3a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-3a2 2 0 0 1 -2 -2v-1h-2v1a2 2 0 0 1 -2 2H6a2 2 0 0 1 -2 -2V7a2 2 0 0 1 2 -2h3z" />
      </svg>
    ),
    active: true,
  },
  {
    id: "golf",
    name: "Golf",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 18v-11l7 9" />
        <path d="M9 9a3 3 0 0 1 6 0" />
        <circle cx="12" cy="18" r="2" />
      </svg>
    ),
    active: true,
  },
  {
    id: "formula1",
    name: "Formula 1",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="8" rx="1" />
        <circle cx="7" cy="16" r="2" />
        <circle cx="17" cy="16" r="2" />
      </svg>
    ),
    active: true,
  },
  {
    id: "nascar",
    name: "NASCAR",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="8" rx="1" />
        <circle cx="7" cy="16" r="2" />
        <circle cx="17" cy="16" r="2" />
        <path d="M14 6l3 5" />
      </svg>
    ),
    active: true,
  },
  {
    id: "darts",
    name: "Darts",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    active: true,
  },
  {
    id: "lacrosse",
    name: "Lacrosse",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M18 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M21 3l-5 2" />
        <path d="M21 3l-5 2" />
        <path d="M3 21l5 -2" />
        <path d="M9 6l-3 3c-2 2 -2 4 0 6l6 6c2 2 5 1 7 -1l3 -3" />
      </svg>
    ),
    active: true,
  },
  {
    id: "esports",
    name: "Esports",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 12h4" />
        <path d="M8 10v4" />
        <line x1="15" y1="13" x2="17" y2="13" />
        <line x1="15" y1="11" x2="17" y2="11" />
      </svg>
    ),
    active: true,
  },
];

export default function SportSelection() {
  const [, setLocation] = useLocation();
  const { skipOnboarding } = useOnboarding();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { preferences, isLoading, updatePreferences } = useAlertPreferences();
  const [selectedSports, setSelectedSports] = useState<Record<string, boolean>>({
    soccer: false,
    basketball: false,
    football: false,
    hockey: false,
    baseball: false,
    rugby: false,
    formula1: false
  });
  
  // Initialize selected sports from user preferences if available
  useEffect(() => {
    if (preferences?.sports) {
      setSelectedSports(preferences.sports);
    }
  }, [preferences]);
  
  const handleSportToggle = (sportId: string) => {
    console.log(`Toggling sport: ${sportId}`);
    setSelectedSports(prev => {
      const newState = {
        ...prev,
        [sportId]: !prev[sportId]
      };
      console.log(`New sports state:`, newState);
      return newState;
    });
  };

  const handleContinue = async () => {
    console.log("=== HANDLE CONTINUE START ===");
    
    // Simple sports list - exactly like soccer/basketball work
    const selectedSportsList = Object.entries(selectedSports)
      .filter(([_, isSelected]) => isSelected)
      .map(([sportId]) => sportId);
    
    console.log("Selected sports:", selectedSportsList);
    
    if (selectedSportsList.length > 0) {
      const firstSport = selectedSportsList[0];
      console.log(`Navigating to: /alert-setup/${firstSport}`);
      setLocation(`/alert-setup/${firstSport}`);
    } else {
      console.log("No sports selected");
    }
  };

  // Function to reset entire onboarding flow for development/testing
  const handleResetFlow = () => {
    if (preferences) {
      const resetPrefs = {
        ...preferences,
        // Reset all sports selections
        sports: {
          soccer: false,
          basketball: false,
          football: false,
          baseball: false,
          hockey: false,
          rugby: false,
          formula1: false
        }
      };
      updatePreferences(resetPrefs);
      // Clear any local storage navigation helpers
      localStorage.removeItem('nextSport');
      localStorage.removeItem('inMultiSportFlow');
      // Refresh the page
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[hsl(var(--sky-blue))] text-white p-4 flex justify-center shadow-md">
        <h1 className="text-xl font-bold">Choose Your Sport</h1>
      </header>

      {/* Main Content */}
      <main className="p-4 flex-1 pb-24">
        {preferences?.sports && Object.values(preferences.sports).some(v => v) && (
          <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-md">
            <p className="font-medium">Sports setup in progress</p>
            <p className="text-sm">You've already selected some sports. To configure each sport individually, 
            select the sport below and configure alerts and leagues one at a time.</p>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">
            Select multiple sports you want to follow
          </p>
          
          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-2 h-8">
              <button 
                onClick={() => setViewMode("grid")}
                className={`text-xs px-2 h-full ${viewMode === "grid" ? "bg-[hsl(var(--sky-blue))] text-white" : "bg-gray-100"}`}
              >
                GRID VIEW
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`text-xs px-2 h-full ${viewMode === "list" ? "bg-[hsl(var(--sky-blue))] text-white" : "bg-gray-100"}`}
              >
                LIST VIEW
              </button>
            </div>
          </div>
        </div>
        
        {viewMode === "grid" && (
          <div className="grid grid-cols-3 gap-2">
            {SPORTS.map((sport) => (
              <Card 
                key={sport.id}
                className={`p-2 cursor-pointer flex flex-col items-center justify-center ${
                  selectedSports[sport.id] 
                    ? "border-[hsl(var(--claret))] border-2" 
                    : "border-gray-200"
                } ${!sport.active ? "opacity-50" : ""}`}
                onClick={() => sport.active && handleSportToggle(sport.id)}
              >
                <div className={selectedSports[sport.id] ? "text-[hsl(var(--claret))]" : "text-gray-500"}>
                  <SportAnimation 
                    sport={sport.id} 
                    isSelected={selectedSports[sport.id]} 
                  />
                </div>
                <h3 className="mt-1 text-xs font-medium text-center uppercase">{sport.name}</h3>
                {selectedSports[sport.id] && (
                  <div className="absolute top-2 right-2 bg-[hsl(var(--sky-blue))] rounded-full flex items-center justify-center w-5 h-5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {viewMode === "list" && (
          <div className="space-y-1">
            {SPORTS.map((sport) => (
              <div 
                key={sport.id}
                className={`p-3 cursor-pointer flex items-center justify-between ${
                  selectedSports[sport.id] 
                    ? "bg-[hsl(var(--claret))]/10 border-l-4 border-[hsl(var(--claret))]" 
                    : "bg-gray-50 hover:bg-gray-100"
                } ${!sport.active ? "opacity-50" : ""}`}
                onClick={() => sport.active && handleSportToggle(sport.id)}
              >
                <div className="flex items-center">
                  <div className={`${selectedSports[sport.id] ? "text-[hsl(var(--claret))]" : "text-gray-500"} mr-3 w-6 h-6`}>
                    {sport.icon}
                  </div>
                  <h3 className="font-medium">{sport.name}</h3>
                </div>
                
                {selectedSports[sport.id] && (
                  <div className="bg-[hsl(var(--sky-blue))] rounded-full flex items-center justify-center w-5 h-5 ml-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      


      {/* Fixed Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50">
        <div className="container max-w-md mx-auto">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              {Object.values(selectedSports).filter(Boolean).length > 0 ? (
                <div>
                  <span className="font-medium">
                    {Object.values(selectedSports).filter(Boolean).length}
                  </span> sport{Object.values(selectedSports).filter(Boolean).length !== 1 ? 's' : ''} selected
                </div>
              ) : (
                <div className="text-red-500">Please select at least one sport</div>
              )}
            </div>
            <Button 
              onClick={async () => {
                console.log("Continue button clicked!");
                console.log("Selected sports:", selectedSports);
                console.log("Preferences:", preferences);
                
                // Get all selected sports in order
                const allSportsInOrder = [
                  'soccer', 'basketball', 'football', 'baseball', 'hockey', 'rugby', 'formula1',
                  'tennis', 'cricket', 'golf', 'boxing', 'tabletennis', 'volleyball', 'handball', 
                  'mma', 'nascar', 'darts', 'lacrosse', 'esports'
                ];
                const selectedSportsList = allSportsInOrder.filter(id => selectedSports[id]);
                
                console.log("Selected sports list:", selectedSportsList);
                
                if (selectedSportsList.length > 0) {
                  // Save primary sport to localStorage for backward compatibility
                  const firstSport = selectedSportsList[0];
                  localStorage.setItem('selectedSport', firstSport);
                  
                  // Save multi-sport state in localStorage
                  localStorage.setItem('multiSportFlow', JSON.stringify({
                    sports: selectedSportsList,
                    currentSportIndex: 0,
                    step: 'alerts'
                  }));
                  
                  console.log(`Navigating to sport configuration for ${firstSport}`);
                  
                  // Navigate to sport configuration for the first sport
                  setLocation(`/sport-configuration/${firstSport}`);
                  return;
                }
                
                // Save selected sports to preferences if available
                if (preferences) {
                  // Create or update sportAlerts for each selected sport
                  const updatedSportAlerts = { ...preferences.sportAlerts || {} };
                  
                  // For each selected sport, ensure there's a corresponding entry in sportAlerts
                  Object.entries(selectedSports).forEach(([sportId, isSelected]) => {
                    if (isSelected) {
                      // If this sport doesn't exist in sportAlerts yet, add it with default settings
                      if (!updatedSportAlerts[sportId]) {
                        updatedSportAlerts[sportId] = {
                          enabled: true,
                          goalAlerts: false,
                          redCardAlerts: false,
                          yellowCardAlerts: false,
                          goalDifferenceAlerts: {
                            enabled: false,
                            threshold: 2,
                            targetTeam: 'any',
                          },
                          halfTimeFullTimeAlerts: false,
                          lateGameAlerts: {
                            enabled: false,
                            startMinute: 85,
                          },
                          leagues: {},
                        };
                      }
                    }
                  });
                  
                  const updatedPreferences: AlertPreferencesData = {
                    ...preferences,
                    sports: selectedSports,
                    sportAlerts: updatedSportAlerts
                  };
                  
                  await updatePreferences(updatedPreferences);
                  
                  // Get all selected sports in order
                  const allSportsInOrder = ['soccer', 'basketball', 'football', 'baseball', 'hockey', 'rugby', 'formula1'];
                  const selectedSportsList = allSportsInOrder.filter(id => selectedSports[id]);
                  
                  if (selectedSportsList.length > 0) {
                    // Go to the first sport's alert setup
                    const firstSport = selectedSportsList[0];
                    
                    console.log(`Navigating to alert setup for ${firstSport}`);
                    console.log(`Selected sports:`, selectedSportsList);
                    
                    // Save multi-sport state in localStorage
                    localStorage.setItem('multiSportFlow', JSON.stringify({
                      sports: selectedSportsList,
                      currentSportIndex: 0,
                      step: 'alerts'
                    }));
                    
                    // Navigate to sport configuration for the first sport
                    setLocation(`/sport-configuration/${firstSport}`);
                  }
                }
              }} 
              className="gap-1 bg-[hsl(var(--sky-blue))] hover:bg-[hsl(var(--claret))]"
              disabled={Object.values(selectedSports).filter(Boolean).length === 0}
            >
              Continue
            </Button>
          </div>
          
          <div className="mt-2 text-center">
            <button 
              onClick={() => {
                // Set a default sport
                const defaultSports = { soccer: true };
                
                // Save to preferences if available
                if (preferences) {
                  updatePreferences({
                    ...preferences,
                    sports: defaultSports
                  });
                }
                
                // Also save to localStorage for backward compatibility
                localStorage.setItem('selectedSport', 'soccer');
                
                // Mark onboarding as complete to prevent redirect loop
                localStorage.setItem('onboardingCompleted', 'true');
                
                // Go directly to main app - to live matches page
                setLocation('/live');
              }} 
              className="text-gray-500 text-xs underline"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}