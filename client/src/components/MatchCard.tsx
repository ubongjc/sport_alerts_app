import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MatchWithDetails } from "@/lib/types";
import { GoalIcon, RedCardIcon, YellowCardIcon, ClockIcon } from "@/lib/icons";
import { MatchDetailsModal } from "@/components/MatchDetailsModal";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface MatchCardProps {
  match: MatchWithDetails;
  isLive?: boolean;
}

const MatchCard = ({ match, isLive = false }: MatchCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const { homeTeam, awayTeam, league, homeScore, awayScore, startTime, status, currentMinute, events } = match;
  
  // Format match time for display
  const formatTime = (date: Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
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
  
  // Count events by type for display
  const goalEvents = events?.filter(e => e.eventType === 'GOAL') || [];
  const redCardEvents = events?.filter(e => e.eventType === 'RED_CARD') || [];
  const yellowCardEvents = events?.filter(e => e.eventType === 'YELLOW_CARD') || [];
  
  // Determine home and away team goal counts
  const homeGoals = goalEvents.filter(e => e.teamId === homeTeam.id).length;
  const awayGoals = goalEvents.filter(e => e.teamId === awayTeam.id).length;
  
  // Check if match is live
  const isMatchLive = status === 'LIVE' || status === 'IN_PLAY';
  
  const handleOpenDetails = () => {
    setShowDetails(true);
  };
  
  return (
    <>
      <Card 
        className={`p-4 ${isMatchLive ? 'border-primary border-2' : ''} hover:shadow-md transition-shadow cursor-pointer relative`}
        onClick={handleOpenDetails}
      >
        {/* League and time info */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-600">{league.name}</span>
          </div>
          
          {isMatchLive ? (
            <div className="flex items-center">
              <Badge variant="outline" className="bg-gradient-to-r from-[hsl(var(--claret))] to-[hsl(var(--sky-blue))] text-white border-none shadow-sm flex items-center gap-1 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                LIVE {currentMinute !== undefined && currentMinute !== null ? formatMatchTime(currentMinute) : ''}
              </Badge>
            </div>
          ) : (
            <div className="flex items-center text-xs text-gray-500">
              <ClockIcon className="mr-1 h-3 w-3" />
              <span>{formatDate(startTime)} {formatTime(startTime)}</span>
            </div>
          )}
        </div>
        
        {/* Team names and scores */}
        <div className="flex justify-between items-center py-2">
          <div className="flex-1">
            <div className="flex items-center">
              {homeTeam.crest && (
                <img 
                  src={homeTeam.crest} 
                  alt={homeTeam.name} 
                  className="w-6 h-6 mr-2 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <h3 className="font-medium">{homeTeam.name}</h3>
            </div>
          </div>
          
          {isMatchLive || status === 'COMPLETED' ? (
            <div className="flex items-center justify-center px-3 py-1 bg-gradient-to-r from-[hsl(var(--claret)/0.9)] to-[hsl(var(--sky-blue)/0.9)] text-white rounded-lg shadow-sm">
              <span className="font-bold text-lg">{homeScore}</span>
              <span className="mx-1 text-white/80">-</span>
              <span className="font-bold text-lg">{awayScore}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center px-3 py-1 bg-gradient-to-r from-[hsl(var(--claret)/0.8)] to-[hsl(var(--sky-blue)/0.8)] text-white rounded-lg shadow-sm">
              <span className="text-sm font-medium">vs</span>
            </div>
          )}
          
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end">
              <h3 className="font-medium">{awayTeam.name}</h3>
              {awayTeam.crest && (
                <img 
                  src={awayTeam.crest} 
                  alt={awayTeam.name} 
                  className="w-6 h-6 ml-2 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
          </div>
        </div>
        
        {/* Match events */}
        {isLive && events && events.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex justify-center space-x-4">
              {homeGoals > 0 && (
                <div className="flex items-center text-sm text-gray-600">
                  <GoalIcon className="mr-1" />
                  <span>{homeGoals}</span>
                </div>
              )}
              
              {redCardEvents.length > 0 && (
                <div className="flex items-center text-sm text-gray-600">
                  <RedCardIcon className="mr-1" />
                  <span>{redCardEvents.length}</span>
                </div>
              )}
              
              {yellowCardEvents.length > 0 && (
                <div className="flex items-center text-sm text-gray-600">
                  <YellowCardIcon className="mr-1" />
                  <span>{yellowCardEvents.length}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* View details indicator */}
        <div className="absolute right-3 bottom-3">
          <Button variant="ghost" size="sm" className="p-1 h-auto">
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
        
        {/* Add warning if no detailed stats will be available */}
        {!match.sportradarId && isMatchLive && (
          <div className="text-xs text-gray-500 mt-2 text-center">
            Limited match statistics available
          </div>
        )}
      </Card>
      
      {/* Match details modal */}
      <MatchDetailsModal 
        match={match} 
        isOpen={showDetails} 
        onClose={() => setShowDetails(false)} 
      />
    </>
  );
};

export default MatchCard;