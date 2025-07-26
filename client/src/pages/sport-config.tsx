import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Settings, ListChecks } from "lucide-react";
import { useAlertPreferences } from "@/hooks/useAlerts";
import SportAnimation from "@/components/SportAnimation";
import { getSportDisplayName } from "@/data/sportLeagues";
import { ALL_SPORTS_IN_ORDER } from "@/data/sportLeagues";

export default function SportConfig() {
  const [, params] = useRoute("/sport-config/:sportId");
  const sportId = params?.sportId || "soccer";
  const [, setLocation] = useLocation();
  const { preferences, isLoading } = useAlertPreferences();

  // Check if this sport has already configured alerts and leagues
  const hasConfiguredAlerts = preferences?.sportAlerts?.[sportId]?.enabled === true;
  const hasConfiguredLeagues = preferences?.sportAlerts?.[sportId]?.leagues &&
    Object.keys(preferences.sportAlerts[sportId].leagues || {}).length > 0;

  // Find previous and next sports in the selected list
  const [prevSport, setPrevSport] = useState<string | null>(null);
  const [nextSport, setNextSport] = useState<string | null>(null);

  useEffect(() => {
    if (preferences?.sports) {
      // Get selected sports in order
      const selectedSports = ALL_SPORTS_IN_ORDER.filter(id => preferences.sports[id]);
      
      // Find current sport index
      const currentIndex = selectedSports.indexOf(sportId);
      
      // Set previous sport
      if (currentIndex > 0) {
        setPrevSport(selectedSports[currentIndex - 1]);
      } else {
        setPrevSport(null);
      }
      
      // Set next sport
      if (currentIndex < selectedSports.length - 1) {
        setNextSport(selectedSports[currentIndex + 1]);
      } else {
        setNextSport(null);
      }
    }
  }, [sportId, preferences]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[hsl(var(--sky-blue))] text-white p-4 flex justify-center shadow-md">
        <h1 className="text-xl font-bold">Configure {getSportDisplayName(sportId)}</h1>
      </header>

      {/* Main Content */}
      <main className="p-4 flex-1 pb-24">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLocation('/sport-selection')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Sports
          </Button>
          
          <div className="flex items-center gap-1">
            <div className="w-8 h-8">
              <SportAnimation sport={sportId} isSelected={true} />
            </div>
            <span className="font-semibold">{getSportDisplayName(sportId)}</span>
          </div>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Configuration Status</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-500" />
                <span>Alert Settings</span>
              </div>
              <div>
                {hasConfiguredAlerts ? (
                  <span className="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                    Configured
                  </span>
                ) : (
                  <span className="text-orange-600 text-sm font-medium bg-orange-50 px-2 py-1 rounded-full">
                    Not Configured
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-gray-500" />
                <span>League Selection</span>
              </div>
              <div>
                {hasConfiguredLeagues ? (
                  <span className="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                    {Object.keys(preferences?.sportAlerts?.[sportId]?.leagues || {}).length} Selected
                  </span>
                ) : (
                  <span className="text-orange-600 text-sm font-medium bg-orange-50 px-2 py-1 rounded-full">
                    Not Selected
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setLocation(`/alert-setup/${sportId}`)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure Alerts
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setLocation(`/league-selection/${sportId}`)}
            >
              <ListChecks className="h-4 w-4 mr-2" />
              Select Leagues
            </Button>
          </div>
        </Card>
        
        {/* Navigation to other sports */}
        <div className="flex justify-between">
          {prevSport ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation(`/sport-config/${prevSport}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous: {getSportDisplayName(prevSport)}
            </Button>
          ) : (
            <div></div>
          )}
          
          {nextSport ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation(`/sport-config/${nextSport}`)}
            >
              Next: {getSportDisplayName(nextSport)}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation('/live')}
            >
              Finish & Go to Live Matches
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}