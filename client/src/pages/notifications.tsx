import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Bell, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAlertPreferences } from "@/hooks/useAlerts";
import { useMatches } from "@/hooks/useMatches";
import { MatchWithDetails } from "@/lib/types";

export default function Notifications() {
  const { preferences } = useAlertPreferences();
  const { liveMatches } = useMatches();
  const [matchesWithAlerts, setMatchesWithAlerts] = useState<MatchWithDetails[]>([]);

  useEffect(() => {
    if (!preferences || !liveMatches || liveMatches.length === 0) return;

    // Filter matches that meet the alert criteria
    const filteredMatches = liveMatches.filter(match => {
      // Count events
      const redCards = match.events?.filter(event => event.type === 'RED_CARD') || [];
      const yellowCards = match.events?.filter(event => event.type === 'YELLOW_CARD') || [];
      const lateEvents = match.events?.filter(event => 
        (event.type === 'GOAL' || event.type === 'RED_CARD') && event.minute >= 85
      ) || [];
      
      // Basic alerts
      // Goal score alerts
      if (preferences.goalAlerts && (match.homeScore > 0 || match.awayScore > 0)) {
        return true;
      }

      // Goal difference alerts - when there's a goal difference greater than the threshold
      if (preferences.goalDifferenceAlerts?.enabled && 
          Math.abs(match.homeScore - match.awayScore) >= preferences.goalDifferenceAlerts.threshold) {
        return true;
      }

      // Check for specific events (red cards, yellow cards, etc.)
      if (preferences.redCardAlerts && redCards.length > 0) {
        return true;
      }

      if (preferences.yellowCardAlerts && yellowCards.length > 0) {
        return true;
      }
      
      // Custom combined alerts
      if (preferences.customAlerts && preferences.customAlerts.length > 0) {
        // Loop through each custom alert
        for (const alert of preferences.customAlerts) {
          if (!alert.enabled) continue;
          
          // Check each condition in the alert
          const conditionsResults = alert.conditions.map(condition => {
            const { eventType, team, threshold, comparison } = condition;
            
            // Get the values based on team selection (teamA = home, teamB = away)
            let actualValue = 0;
            
            if (eventType === 'goals') {
              if (team === 'teamA') {
                actualValue = match.homeScore;
              } else if (team === 'teamB') {
                actualValue = match.awayScore;
              } else { // 'any'
                actualValue = Math.max(match.homeScore, match.awayScore);
              }
            } else if (eventType === 'redCards') {
              const teamRedCards = team === 'teamA' 
                ? redCards.filter(card => card.teamId === match.homeTeamId)
                : team === 'teamB'
                  ? redCards.filter(card => card.teamId === match.awayTeamId)
                  : redCards;
              actualValue = teamRedCards.length;
            } else if (eventType === 'yellowCards') {
              const teamYellowCards = team === 'teamA' 
                ? yellowCards.filter(card => card.teamId === match.homeTeamId)
                : team === 'teamB'
                  ? yellowCards.filter(card => card.teamId === match.awayTeamId)
                  : yellowCards;
              actualValue = teamYellowCards.length;
            } else if (eventType === 'corners') {
              // We would need corner data from the API
              // For now, using a placeholder implementation
              actualValue = Math.floor(Math.random() * 10); // Simulated value for demo
            }
            
            // Apply comparison
            if (comparison === 'equals') {
              return actualValue === threshold;
            } else if (comparison === 'greaterThan') {
              return actualValue >= threshold; // Using >= for "greater than or equal"
            } else if (comparison === 'lessThan') {
              return actualValue <= threshold; // Using <= for "less than or equal"
            }
            return false;
          });
          
          // Combine conditions based on operator (AND or OR)
          const alertTriggered = alert.operator === 'AND'
            ? conditionsResults.every(result => result) // All must be true
            : conditionsResults.some(result => result); // Any can be true
          
          if (alertTriggered) {
            return true;
          }
        }
      }
      
      // Late game alerts
      if (preferences.lateGameAlerts?.enabled && match.currentMinute) {
        const startMinute = preferences.lateGameAlerts.startMinute || 85;
        
        if (match.currentMinute >= startMinute) {
          // Check for significant events in late game
          const lateGoals = goalEvents.filter(event => event.minute >= startMinute);
          const lateRedCards = redCards.filter(event => event.minute >= startMinute);
          
          if (lateGoals.length > 0 || lateRedCards.length > 0) {
            return true;
          }
        }
      }

      return false;
    });

    setMatchesWithAlerts(filteredMatches);
  }, [liveMatches, preferences]);

  const formatTime = (time: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(time));
  };
  
  // Format match time based on soccer game rules (90 minutes max, plus stoppage time)
  const formatMatchTime = (minute: number | string) => {
    // If already formatted as a string with stoppage time (e.g. "45+2")
    if (typeof minute === 'string' && minute.includes('+')) {
      return `${minute}'`;
    }
    
    const minuteNum = Number(minute);
    
    // First half: 1-45 minutes
    if (minuteNum <= 45) {
      return `${minuteNum}'`;
    }
    
    // Halftime
    if (minuteNum > 45 && minuteNum < 46) {
      return 'HT';
    }
    
    // Second half: 46-90 minutes
    if (minuteNum >= 46 && minuteNum <= 90) {
      return `${minuteNum}'`;
    }
    
    // Stoppage time in second half
    if (minuteNum > 90 && minuteNum <= 100) {
      const stoppageTime = minuteNum - 90;
      return `90+${stoppageTime}'`;
    }
    
    // Full time or beyond normal time
    return 'FT';
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Link href="/alerts">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            Settings <ArrowUpRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      {matchesWithAlerts.length > 0 ? (
        <div className="space-y-4">
          {matchesWithAlerts.map(match => (
            <Card key={match.id} className="p-4 relative overflow-hidden">
              <div className="flex justify-between items-center mb-2">
                <Badge className="bg-[hsl(var(--sky-blue))]">Alert Triggered</Badge>
                <span className="text-sm text-gray-500">{match.league.name}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex flex-col items-center">
                  <img 
                    src={match.homeTeam.crest || 'https://via.placeholder.com/30'} 
                    alt={match.homeTeam.name} 
                    className="w-8 h-8 object-contain mb-1"
                  />
                  <span className="text-sm font-medium">{match.homeTeam.shortName}</span>
                </div>
                
                <div className="flex flex-col items-center px-4">
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-bold">{match.homeScore}</span>
                    <span className="text-lg font-medium">-</span>
                    <span className="text-xl font-bold">{match.awayScore}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {match.status === 'LIVE' && match.currentMinute ? formatMatchTime(match.currentMinute) : formatTime(match.startTime)}
                  </span>
                </div>
                
                <div className="flex flex-col items-center">
                  <img 
                    src={match.awayTeam.crest || 'https://via.placeholder.com/30'} 
                    alt={match.awayTeam.name} 
                    className="w-8 h-8 object-contain mb-1"
                  />
                  <span className="text-sm font-medium">{match.awayTeam.shortName}</span>
                </div>
              </div>
              
              <div className="mt-3 pt-2 border-t">
                <h4 className="text-sm font-medium mb-1">Alert Reasons:</h4>
                <div className="flex flex-wrap gap-2">
                  {preferences?.goalAlerts && (match.homeScore > 0 || match.awayScore > 0) && (
                    <Badge variant="outline" className="bg-gray-100">Goal Scored</Badge>
                  )}
                  {preferences?.goalDifferenceAlerts?.twoGoals && 
                    Math.abs(match.homeScore - match.awayScore) >= 2 && (
                    <Badge variant="outline" className="bg-gray-100">2+ Goal Difference</Badge>
                  )}
                  {preferences?.redCardAlerts && 
                    match.events?.some(event => event.type === 'RED_CARD') && (
                    <Badge variant="outline" className="bg-gray-100">Red Card</Badge>
                  )}
                  {preferences?.yellowCardAlerts && 
                    match.events?.some(event => event.type === 'YELLOW_CARD') && (
                    <Badge variant="outline" className="bg-gray-100">Yellow Card</Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Bell className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">No notifications yet</h3>
          <p className="text-gray-500 max-w-xs">
            When matches trigger your alert preferences, they'll appear here.
          </p>
          <Link href="/alerts" className="mt-4">
            <Button variant="outline">
              Review Alert Settings
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}