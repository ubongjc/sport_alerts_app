import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useMatches } from "@/hooks/useMatches";
import { useAlertPreferences } from "@/hooks/useAlerts";
import MatchCard from "./MatchCard";

interface MatchesListProps {
  activeTab: "upcoming" | "live";
  limit?: number;
}

const MatchesList = ({ activeTab, limit }: MatchesListProps) => {
  const { liveMatches, upcomingMatches, isLoadingLive, isLoadingUpcoming, selectedSport } = useMatches();
  const { preferences } = useAlertPreferences();
  const [currentTab, setCurrentTab] = useState<"upcoming" | "live">(activeTab);
  const [showMyGamesOnly, setShowMyGamesOnly] = useState<boolean>(false);
  const [, setLocation] = useLocation();
  
  // Honor the initial activeTab prop passed to the component
  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);
  
  // Only use real live matches from the API
  const realLiveMatches = liveMatches || [];
  
  // Debug the league names for troubleshooting
  const debugLeagueNames = (match: any) => {
    console.log('🏆 Match league debug:', {
      leagueName: match.league?.name,
      leagueId: match.leagueId || match.league?.id,
      leagueCode: match.league?.code,
      homeTeam: match.homeTeam?.name,
      awayTeam: match.awayTeam?.name
    });
    return true;
  };

  // Check if a match's league and sport are included in user preferences
  const isInUserPreferences = (match: any) => {
    // First check if the sport is selected by the user
    const sportId = match.sportId || 1; // Default to soccer (1) if not specified
    const sportMap: Record<number, string> = {
      1: 'soccer',
      2: 'basketball',
      3: 'football',
      4: 'hockey',
      5: 'baseball',
      6: 'rugby',
      7: 'formula1'
    };
    
    const sportName = sportMap[sportId] || 'soccer';
    
    // Check if user has any alerts configured for this sport
    const sportAlerts = localStorage.getItem(`${sportName}_alerts`);
    if (!sportAlerts) {
      return false; // No alerts configured for this sport
    }
    
    // Check if user has selected any leagues for this sport
    const sportLeagues = localStorage.getItem(`${sportName}_leagues`);
    if (!sportLeagues) return false;
    
    // Parse the leagues data from localStorage
    const leaguesData = JSON.parse(sportLeagues);
    
    // Get league info from the match
    const leagueName = match.league?.name || '';
    const leagueId = match.league?.id || match.leagueId;
    const leagueCode = match.league?.code || '';
    
    // Create a mapping of league identifiers to localStorage keys
    const leagueMapping: Record<string | number, string> = {
      // Premier League
      'PL': 'epl',
      'Premier League': 'epl',
      'English Premier League': 'epl',
      'EPL': 'epl',
      2021: 'epl',
      // La Liga
      'PD': 'laliga',
      'La Liga': 'laliga',
      'LaLiga': 'laliga',
      'Spanish La Liga': 'laliga',
      'Primera División': 'laliga',
      2014: 'laliga',
      // Serie A
      'SA': 'seriea',
      'Serie A': 'seriea',
      'Italian Serie A': 'seriea',
      'Serie A TIM': 'seriea',
      2019: 'seriea',
      // Bundesliga
      'BL1': 'bundesliga',
      'Bundesliga': 'bundesliga',
      'German Bundesliga': 'bundesliga',
      '1. Bundesliga': 'bundesliga',
      2002: 'bundesliga',
      // Ligue 1
      'FL1': 'ligue1',
      'Ligue 1': 'ligue1',
      'French Ligue 1': 'ligue1',
      'Ligue 1 Uber Eats': 'ligue1',
      2015: 'ligue1',
      // FA Cup
      'FA Cup': 'fa_cup',
      'English FA Cup': 'fa_cup',
      'The FA Cup': 'fa_cup',
      'fa_cup': 'fa_cup',
      'FAC': 'fa_cup',
      // Champions League
      'Champions League': 'champions',
      'UEFA Champions League': 'champions',
      'UCL': 'champions',
      'CL': 'champions',
      // Europa League
      'Europa League': 'europa',
      'UEFA Europa League': 'europa',
      'UEL': 'europa',
    };
    
    // Check various identifiers to find a match
    let matchingLeagueKey = null;
    
    // Check by league code
    if (leagueCode && leagueCode in leagueMapping) {
      matchingLeagueKey = leagueMapping[leagueCode];
    }
    // Check by league name
    else if (leagueName && leagueName in leagueMapping) {
      matchingLeagueKey = leagueMapping[leagueName];
    }
    // Check by league ID
    else if (leagueId && leagueId in leagueMapping) {
      matchingLeagueKey = leagueMapping[leagueId];
    }
    
    // Check if the league is selected in user preferences
    if (matchingLeagueKey && leaguesData[matchingLeagueKey]) {
      return true;
    }
    
    // Check for 'all' leagues option
    if (leaguesData.all) {
      return true;
    }

    // No matches found for user preferences
    return false;
  };

  // Filter matches based on user's selected leagues and sports if "My Alerts" is enabled
  const filteredLiveMatches = showMyGamesOnly 
    ? realLiveMatches.filter(isInUserPreferences)
    : realLiveMatches;
    
  const filteredUpcomingMatches = showMyGamesOnly
    ? (upcomingMatches || []).filter(isInUserPreferences)
    : upcomingMatches || [];
  
  // Filter matches based on limit if provided
  const displayedLiveMatches = limit 
    ? filteredLiveMatches.slice(0, limit)
    : filteredLiveMatches;
    
  const displayedUpcomingMatches = limit 
    ? filteredUpcomingMatches.slice(0, limit) 
    : filteredUpcomingMatches;

  // Always focus on "live" tab if coming from onboarding
  useEffect(() => {
    if (window.location.search.includes('from=onboarding')) {
      setCurrentTab('live');
    }
  }, []);

  return (
    <div className="space-y-4">
      {/* My Games Toggle - Styled with claret and blue */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center space-x-2">
          <Switch
            id="my-games"
            checked={showMyGamesOnly}
            onCheckedChange={setShowMyGamesOnly}
            className="data-[state=checked]:bg-[hsl(var(--claret))] data-[state=checked]:border-[hsl(var(--claret))]"
          />
          <Label htmlFor="my-games" className="text-sm font-medium">
            My Alerts Only
          </Label>
        </div>
        {showMyGamesOnly && (
          <span className="text-xs text-[hsl(var(--claret))] font-medium">
            Showing leagues you follow
          </span>
        )}
      </div>
      
      <Tabs 
        defaultValue={activeTab} 
        value={currentTab}
        onValueChange={(value) => setCurrentTab(value as "upcoming" | "live")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-gradient-to-r from-[hsl(var(--claret))] to-[hsl(var(--sky-blue))] shadow-md border-0">
          <TabsTrigger 
            value="upcoming"
            className="data-[state=active]:bg-white data-[state=active]:text-[hsl(var(--claret))] data-[state=active]:font-semibold data-[state=inactive]:text-white"
          >
            Upcoming
          </TabsTrigger>
          <TabsTrigger 
            value="live" 
            className="data-[state=active]:bg-white data-[state=active]:text-[hsl(var(--claret))] data-[state=active]:font-semibold data-[state=inactive]:text-white"
          >
            Live
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {isLoadingUpcoming ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </Card>
            ))
          ) : displayedUpcomingMatches.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No upcoming matches at the moment
            </div>
          ) : (
            displayedUpcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))
          )}
          
          {limit && upcomingMatches.length > limit && (
            <div className="text-center mt-4">
              <button
                onClick={() => setLocation("/live")}
                className="text-sm text-primary hover:underline"
              >
                View all matches
              </button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="live" className="space-y-4">
          {isLoadingLive ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </Card>
            ))
          ) : displayedLiveMatches.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No live matches at the moment
            </div>
          ) : (
            displayedLiveMatches.map((match) => (
              <MatchCard key={match.id} match={match} isLive={true} />
            ))
          )}
          
          {limit && liveMatches.length > limit && (
            <div className="text-center mt-4">
              <button
                onClick={() => setLocation("/live")}
                className="text-sm text-primary hover:underline"
              >
                View all live matches
              </button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatchesList;