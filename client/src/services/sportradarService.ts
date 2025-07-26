import { MatchWithDetails, TeamWithDetails, LeagueWithDetails } from '@/lib/types';

interface SportEvent {
  id: string;
  status: string;
  start_time: string;
  tournament: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
      country_code: string;
    };
  };
  competitors: Array<{
    id: string;
    name: string;
    country: string;
    country_code: string;
    abbreviation: string;
    qualifier: string; // 'home' or 'away'
  }>;
  venue?: {
    id: string;
    name: string;
    capacity: number;
    city_name: string;
    country_name: string;
    map_coordinates: string;
    country_code: string;
  };
}

interface SportEventStatus {
  status: string;
  match_status: string;
  home_score: number;
  away_score: number;
  winner_id?: string;
  period_scores?: Array<{
    home_score: number;
    away_score: number;
    type: string;
    number: number;
  }>;
  clock?: {
    played: string;
  };
}

interface SportradarLiveMatch {
  sport_event: SportEvent;
  sport_event_status: SportEventStatus;
  statistics?: any;
}

interface SportradarResponse {
  results: SportradarLiveMatch[];
}

export async function fetchLiveMatchesFromSportradar(): Promise<MatchWithDetails[]> {
  try {
    console.log('Fetching live matches from Sportradar API...');
    const response = await fetch('/api/sportradar/live-matches');
    
    if (!response.ok) {
      console.error(`Sportradar API responded with status: ${response.status}`);
      return [];
    }
    
    const data: SportradarResponse = await response.json();
    
    if (!data.results || data.results.length === 0) {
      console.log('No live matches found from Sportradar API');
      return [];
    }
    
    console.log(`Found ${data.results.length} live matches from Sportradar API`);
    
    // Transform Sportradar data to our app's match format
    return transformSportradarData(data.results);
  } catch (error) {
    console.error('Error fetching live matches from Sportradar:', error);
    return []; // Return empty array instead of throwing to prevent cascading errors
  }
}

export async function fetchMatchDetails(matchId: string): Promise<any> {
  try {
    const response = await fetch(`/api/sportradar/match/${matchId}`);
    
    if (!response.ok) {
      throw new Error(`Sportradar API responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching match details for ${matchId}:`, error);
    throw error;
  }
}

function transformSportradarData(matches: SportradarLiveMatch[]): MatchWithDetails[] {
  return matches.map((match) => {
    // Find home and away teams
    const homeTeam = match.sport_event.competitors.find(comp => comp.qualifier === 'home');
    const awayTeam = match.sport_event.competitors.find(comp => comp.qualifier === 'away');
    
    if (!homeTeam || !awayTeam) {
      throw new Error('Match data is missing home or away team information');
    }
    
    // Get current match time
    let currentMinute = 0;
    if (match.sport_event_status.clock && match.sport_event_status.clock.played) {
      // Format might be "PT45M" or similar
      const minutes = match.sport_event_status.clock.played;
      const minutesMatch = minutes.match(/PT(\d+)M/);
      if (minutesMatch && minutesMatch[1]) {
        currentMinute = parseInt(minutesMatch[1], 10);
      }
    }
    
    // Create match events (goals, cards, etc)
    const events: any[] = []; // We'll fill this when we get detailed stats
    
    // Create start time using the date
    const startTime = new Date(match.sport_event.start_time);
    
    // Create team objects that match our TeamWithDetails interface
    const homeTeamDetails: TeamWithDetails = {
      id: parseInt(homeTeam.id),
      name: homeTeam.name,
      shortName: homeTeam.abbreviation || homeTeam.name,
      tla: homeTeam.abbreviation || homeTeam.name.substring(0, 3).toUpperCase(),
      crest: `https://api.sportradar.us/soccer/production/v4/en/teams/${homeTeam.id}/image.png`, // Sportradar team image URL
      country: homeTeam.country || ''
    };
    
    const awayTeamDetails: TeamWithDetails = {
      id: parseInt(awayTeam.id),
      name: awayTeam.name,
      shortName: awayTeam.abbreviation || awayTeam.name,
      tla: awayTeam.abbreviation || awayTeam.name.substring(0, 3).toUpperCase(),
      crest: `https://api.sportradar.us/soccer/production/v4/en/teams/${awayTeam.id}/image.png`, // Sportradar team image URL
      country: awayTeam.country || ''
    };
    
    // Create league object that matches our LeagueWithDetails interface
    const leagueDetails: LeagueWithDetails = {
      id: parseInt(match.sport_event.tournament.id),
      name: match.sport_event.tournament.name,
      country: match.sport_event.tournament.category.name,
      code: match.sport_event.tournament.category.country_code || 'INT',
      logo: `https://api.sportradar.us/soccer/production/v4/en/tournaments/${match.sport_event.tournament.id}/image.png` // Sportradar tournament logo URL
    };
    
    // Create the complete match object with all required fields
    const matchDetails: MatchWithDetails = {
      id: parseInt(match.sport_event.id),
      date: new Date(match.sport_event.start_time),
      startTime, // Add this field to match the schema
      status: match.sport_event_status.match_status || 'LIVE',
      currentMinute: currentMinute,
      homeTeamId: parseInt(homeTeam.id),
      awayTeamId: parseInt(awayTeam.id),
      homeScore: match.sport_event_status.home_score,
      awayScore: match.sport_event_status.away_score,
      sportId: 1, // Soccer by default
      leagueId: parseInt(match.sport_event.tournament.id),
      
      // Add the detailed team and league info
      homeTeam: homeTeamDetails,
      awayTeam: awayTeamDetails,
      league: leagueDetails,
      events: events,
      
      // Add Sportradar-specific fields needed for fetching detailed stats later
      sportradarId: match.sport_event.id
    };
    
    return matchDetails;
  });
}