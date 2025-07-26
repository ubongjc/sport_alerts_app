import { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MatchWithDetails } from '@/lib/types';
import { fetchMatchDetails } from '@/services/sportradarService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GoalIcon, YellowCardIcon, RedCardIcon, ClockIcon } from '@/lib/icons';
import { Skeleton } from '@/components/ui/skeleton';

interface MatchDetailsModalProps {
  match: MatchWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

interface StatItemProps {
  label: string;
  homeValue: number;
  awayValue: number;
}

const StatItem = ({ label, homeValue, awayValue }: StatItemProps) => {
  const total = homeValue + awayValue;
  const homePercentage = total > 0 ? (homeValue / total) * 100 : 50;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{homeValue}</span>
        <span className="text-gray-500">{label}</span>
        <span className="font-medium">{awayValue}</span>
      </div>
      <div className="flex items-center gap-2">
        <Progress value={homePercentage} className="h-2" />
      </div>
    </div>
  );
};

export const MatchDetailsModal = ({ match, isOpen, onClose }: MatchDetailsModalProps) => {
  const [matchStats, setMatchStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  
  useEffect(() => {
    if (isOpen && match && match.sportradarId) {
      setIsLoading(true);
      fetchMatchDetails(match.sportradarId)
        .then(data => {
          setMatchStats(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching match details:', error);
          setIsLoading(false);
        });
    }
  }, [isOpen, match]);
  
  if (!match) return null;
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(date));
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
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
  
  // Extract basic match info
  const { homeTeam, awayTeam, homeScore, awayScore, status, currentMinute, league, date, startTime } = match;
  const matchDate = date || startTime; // Use date if available, otherwise fallback to startTime
  
  // Default stats in case API doesn't return actual values
  const defaultStats = {
    possession: { home: 50, away: 50 },
    shots: { home: 0, away: 0 },
    shotsOnTarget: { home: 0, away: 0 },
    corners: { home: 0, away: 0 },
    fouls: { home: 0, away: 0 },
    yellowCards: { home: 0, away: 0 },
    redCards: { home: 0, away: 0 }
  };
  
  // Extract detailed stats from API response if available
  const stats = matchStats?.statistics?.totals || defaultStats;
  
  // Extract events like goals, cards, etc.
  const events = matchStats?.timeline || match.events || [];
  
  // Sort events chronologically
  const sortedEvents = [...events].sort((a, b) => {
    const timeA = a.minute || 0;
    const timeB = b.minute || 0;
    return timeB - timeA; // Recent events first
  });
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {league?.name}
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            {formatDate(matchDate)} • {formatTime(matchDate)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between items-center py-4">
          <div className="flex flex-col items-center w-1/3">
            <img 
              src={homeTeam.crest} 
              alt={homeTeam.name} 
              className="w-16 h-16 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=Team';
              }}
            />
            <p className="text-sm font-medium mt-2 text-center">{homeTeam.name}</p>
          </div>
          
          <div className="w-1/3 text-center">
            <div className="text-3xl font-bold">
              {homeScore} - {awayScore}
            </div>
            <div className="mt-1 flex items-center justify-center gap-1 text-sm text-gray-500">
              <ClockIcon />
              {status === 'IN_PLAY' ? `${currentMinute}'` : status}
            </div>
          </div>
          
          <div className="flex flex-col items-center w-1/3">
            <img 
              src={awayTeam.crest} 
              alt={awayTeam.name} 
              className="w-16 h-16 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=Team';
              }}
            />
            <p className="text-sm font-medium mt-2 text-center">{awayTeam.name}</p>
          </div>
        </div>
        
        <Separator />
        
        <Tabs defaultValue="summary" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="mt-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <div>
                <h3 className="font-semibold mb-2">Match Summary</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {homeTeam.name} {homeScore} - {awayScore} {awayTeam.name} in the {league.name}.
                </p>
                
                <h4 className="font-medium mb-2">Key Stats</h4>
                <StatItem label="Possession %" homeValue={stats.possession?.home || 50} awayValue={stats.possession?.away || 50} />
                <StatItem label="Shots" homeValue={stats.shots?.home || 0} awayValue={stats.shots?.away || 0} />
                <StatItem label="Shots on Target" homeValue={stats.shotsOnTarget?.home || 0} awayValue={stats.shotsOnTarget?.away || 0} />
                
                <h4 className="font-medium mb-2 mt-4">Location</h4>
                <p className="text-sm text-gray-600">
                  {matchStats?.venue?.name || 'Stadium information not available'}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="stats" className="mt-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <div>
                <StatItem label="Possession %" homeValue={stats.possession?.home || 50} awayValue={stats.possession?.away || 50} />
                <StatItem label="Shots" homeValue={stats.shots?.home || 0} awayValue={stats.shots?.away || 0} />
                <StatItem label="Shots on Target" homeValue={stats.shotsOnTarget?.home || 0} awayValue={stats.shotsOnTarget?.away || 0} />
                <StatItem label="Corners" homeValue={stats.corners?.home || 0} awayValue={stats.corners?.away || 0} />
                <StatItem label="Fouls" homeValue={stats.fouls?.home || 0} awayValue={stats.fouls?.away || 0} />
                <StatItem label="Yellow Cards" homeValue={stats.yellowCards?.home || 0} awayValue={stats.yellowCards?.away || 0} />
                <StatItem label="Red Cards" homeValue={stats.redCards?.home || 0} awayValue={stats.redCards?.away || 0} />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : sortedEvents.length > 0 ? (
              <div className="space-y-3">
                {sortedEvents.map((event, index) => (
                  <Card key={index}>
                    <CardContent className="py-3">
                      <div className="flex items-center">
                        <div className="w-12 text-center font-medium">
                          {event.minute ? formatMatchTime(event.minute) : '-'}
                        </div>
                        <div className="ml-2 flex-1">
                          {event.type === 'goal' && (
                            <div className="flex items-center">
                              <GoalIcon className="mr-2 h-5 w-5 text-[hsl(var(--sky-blue))]" />
                              <span className="font-medium">{event.player_name || 'Goal'}</span>
                              <span className="ml-1 text-sm text-gray-500">
                                ({event.team_name || (event.team === 'home' ? homeTeam.name : awayTeam.name)})
                              </span>
                            </div>
                          )}
                          {event.type === 'yellow_card' && (
                            <div className="flex items-center">
                              <YellowCardIcon className="mr-2 h-5 w-5 text-yellow-500" />
                              <span className="font-medium">{event.player_name || 'Yellow Card'}</span>
                              <span className="ml-1 text-sm text-gray-500">
                                ({event.team_name || (event.team === 'home' ? homeTeam.name : awayTeam.name)})
                              </span>
                            </div>
                          )}
                          {event.type === 'red_card' && (
                            <div className="flex items-center">
                              <RedCardIcon className="mr-2 h-5 w-5 text-red-500" />
                              <span className="font-medium">{event.player_name || 'Red Card'}</span>
                              <span className="ml-1 text-sm text-gray-500">
                                ({event.team_name || (event.team === 'home' ? homeTeam.name : awayTeam.name)})
                              </span>
                            </div>
                          )}
                          {event.type === 'substitution' && (
                            <div>
                              <span className="font-medium">Substitution</span>
                              <div className="text-sm text-gray-500">
                                {event.player_in} in, {event.player_out} out
                                <span className="ml-1">
                                  ({event.team_name || (event.team === 'home' ? homeTeam.name : awayTeam.name)})
                                </span>
                              </div>
                            </div>
                          )}
                          {!['goal', 'yellow_card', 'red_card', 'substitution'].includes(event.type) && (
                            <div>
                              <span className="font-medium">{event.type}</span>
                              <span className="ml-1 text-sm text-gray-500">
                                {event.player_name && `${event.player_name} - `}
                                ({event.team_name || (event.team === 'home' ? homeTeam.name : awayTeam.name)})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No events recorded for this match yet.</p>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};