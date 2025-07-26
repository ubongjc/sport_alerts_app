// Service to fetch real sports data using Football Data API and ESPN as fallback
import { MatchWithDetails } from "@/lib/types";

// Football Data API competitions (leagues) codes
const FOOTBALL_DATA_COMPETITIONS = {
  // Soccer leagues
  PL: 'Premier League (England)',
  PD: 'La Liga (Spain)',
  SA: 'Serie A (Italy)',
  BL1: 'Bundesliga (Germany)',
  FL1: 'Ligue 1 (France)',
  PPL: 'Primeira Liga (Portugal)',
  DED: 'Eredivisie (Netherlands)',
  ELC: 'Championship (England)',
  BSA: 'Brasileirão (Brazil)',
  
  // Cups and international competitions
  CL: 'Champions League',
  EC: 'European Championship',
  WC: 'World Cup'
};

// ESPN API endpoints mapping for different sports (fallback data)
const ESPN_API_ENDPOINTS = {
  soccer: 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard', // Premier League
  soccerAll: 'https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard',
  basketball: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard',
  baseball: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard',
  football: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard',
  hockey: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard',
  rugby: 'https://site.api.espn.com/apis/site/v2/sports/rugby/all/scoreboard'
};

// Fetch live games from ESPN API
export async function fetchEspnLiveGames(sport: string): Promise<MatchWithDetails[]> {
  try {
    // Use the API-Football or a similar available API
    // Note: For a production app, we would need an API key from one of these providers
    
    // Use the football-data.org API to get real live matches using the provided API key
    // Access the secret directly from server side (not exposed to client)
    const endpoint = '/api/football-data/live-matches';
    
    // No need for headers as our backend will handle the API key
    
    // Make request to get live matches
    const response = await fetch(endpoint);
    if (!response.ok) {
      console.log('Football API error, status:', response.status);
      
      // If our endpoint fails, use ESPN as fallback
      return fetchEspnFallbackData(sport);
    }
    
    const data = await response.json();
    console.log('Live football data received:', data);
    
    // Transform football-data.org response to our app format
    return transformFootballDataToMatchFormat(data, sport);
  } catch (error) {
    console.error("Error fetching live games:", error);
    
    // Use ESPN as a fallback
    return fetchEspnFallbackData(sport);
  }
}

// Fallback to ESPN data if needed
async function fetchEspnFallbackData(sport: string): Promise<MatchWithDetails[]> {
  try {
    // For soccer, try multiple leagues
    let matches: MatchWithDetails[] = [];
    
    if (sport === 'soccer') {
      // Premier League (England)
      const premierLeagueEndpoint = 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard';
      const premResponse = await fetch(premierLeagueEndpoint);
      if (premResponse.ok) {
        const premData = await premResponse.json();
        matches = matches.concat(transformEspnData(premData, sport));
      }
      
      // La Liga (Spain)
      const laLigaEndpoint = 'https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1/scoreboard';
      const laLigaResponse = await fetch(laLigaEndpoint);
      if (laLigaResponse.ok) {
        const laLigaData = await laLigaResponse.json();
        matches = matches.concat(transformEspnData(laLigaData, sport));
      }
      
      // Champions League
      const clEndpoint = 'https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard';
      const clResponse = await fetch(clEndpoint);
      if (clResponse.ok) {
        const clData = await clResponse.json();
        matches = matches.concat(transformEspnData(clData, sport));
      }
      
      // FA Cup
      const faEndpoint = 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.fa/scoreboard';
      const faResponse = await fetch(faEndpoint);
      if (faResponse.ok) {
        const faData = await faResponse.json();
        matches = matches.concat(transformEspnData(faData, sport));
      }
      
      return matches;
    } else {
      // For other sports, use regular endpoint
      const endpoint = ESPN_API_ENDPOINTS[sport as keyof typeof ESPN_API_ENDPOINTS] || ESPN_API_ENDPOINTS.soccer;
      
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`ESPN API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform ESPN data to our app format
      return transformEspnData(data, sport);
    }
  } catch (error) {
    console.error("Error fetching ESPN data:", error);
    return [];
  }
}

// Transform football-data.org response to our app format
function transformFootballDataToMatchFormat(data: any, sport: string): MatchWithDetails[] {
  if (!data || !data.matches || !data.matches.length) {
    console.log("No matches found in API response");
    return [];
  }
  
  console.log(`Found ${data.matches.length} live matches from Football Data API`);
  
  return data.matches.map((match: any, index: number) => {
    try {
      // Extract match information
      const homeTeam = match.homeTeam;
      const awayTeam = match.awayTeam;
      const score = match.score;
      const competition = match.competition;
      
      if (!homeTeam || !awayTeam || !score || !competition) {
        console.log("Match data incomplete, skipping:", match.id);
        return null;
      }
      
      // Calculate current minute based on when the match started
      let currentMinute = 0;
      if (match.utcDate) {
        const matchStartTime = new Date(match.utcDate);
        const now = new Date();
        const diffMs = now.getTime() - matchStartTime.getTime();
        currentMinute = Math.floor(diffMs / (1000 * 60));
        
        // Cap at reasonable values
        if (currentMinute < 0) currentMinute = 0;
        if (currentMinute > 120) currentMinute = match.minute || 80;
      }
      
      // Create appropriate match object
      return {
        id: match.id || (index + 1),
        leagueId: competition.id,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        homeScore: score.fullTime?.home || score.halfTime?.home || 0,
        awayScore: score.fullTime?.away || score.halfTime?.away || 0,
        status: 'LIVE',
        startTime: new Date(match.utcDate),
        currentMinute: match.minute || currentMinute || 45,
        homeTeam: {
          id: homeTeam.id,
          name: homeTeam.name,
          shortName: homeTeam.shortName || homeTeam.tla || 'HOME',
          country: homeTeam.area?.name || 'Unknown',
          logo: homeTeam.crest || '⚽'
        },
        awayTeam: {
          id: awayTeam.id,
          name: awayTeam.name,
          shortName: awayTeam.shortName || awayTeam.tla || 'AWAY',
          country: awayTeam.area?.name || 'Unknown',
          logo: awayTeam.crest || '⚽'
        },
        league: {
          id: competition.id,
          name: competition.name,
          country: competition.area?.name || 'International',
          logo: competition.emblem || '🏆'
        },
        events: [] // We don't have events data from this API
      };
    } catch (error) {
      console.error("Error processing match:", error);
      return null;
    }
  }).filter(Boolean) as MatchWithDetails[]; // Remove any null matches
}

// Transform ESPN data to our application's format
function transformEspnData(espnData: any, sport: string): MatchWithDetails[] {
  if (!espnData || !espnData.events) {
    return [];
  }

  // Include both live and recent games to ensure we see matches
  return espnData.events
    .filter((event: any) => {
      // Include live, in-progress, and recent games
      const status = event.status?.type?.state;
      return status === 'in' || status === 'live' || status === 'post';
    })
    .map((event: any, index: number) => {
      const competition = event.competitions?.[0];
      if (!competition) return null;
      
      const homeTeam = competition.competitors?.find((team: any) => team.homeAway === 'home');
      const awayTeam = competition.competitors?.find((team: any) => team.homeAway === 'away');
      
      if (!homeTeam || !awayTeam) return null;
      
      // Get current game time/period
      const status = competition.status || event.status;
      const period = status?.period || 1;
      const clock = status?.displayClock || '0:00';
      
      // Get league info
      const league = {
        id: espnData.leagues?.[0]?.id || 1,
        name: espnData.leagues?.[0]?.name || 'Unknown League',
        country: espnData.leagues?.[0]?.country || 'International',
        logo: espnData.leagues?.[0]?.logo || null
      };
      
      // Get scores based on sport
      const homeScore = parseInt(homeTeam.score, 10) || 0;
      const awayScore = parseInt(awayTeam.score, 10) || 0;
      
      // Convert time to minutes for our app format
      let currentMinute = 0;
      if (clock) {
        // Different sports have different time formats
        if (clock.includes(':')) {
          const [minutes, seconds] = clock.split(':').map(Number);
          currentMinute = period > 1 ? (period - 1) * (sport === 'soccer' ? 45 : 12) + minutes : minutes;
        } else {
          currentMinute = parseInt(clock, 10) || 0;
        }
      }
      
      // Create events based on score differences
      const events = [];
      // Generate some simulated events based on the score
      for (let i = 0; i < homeScore; i++) {
        events.push({
          id: 1000 + i,
          matchId: index + 1,
          teamId: parseInt(homeTeam.id, 10),
          playerId: 1,
          playerName: homeTeam.team.name,
          eventType: getEventTypeForSport(sport),
          minute: Math.floor(Math.random() * currentMinute) + 1
        });
      }
      
      for (let i = 0; i < awayScore; i++) {
        events.push({
          id: 2000 + i,
          matchId: index + 1,
          teamId: parseInt(awayTeam.id, 10),
          playerId: 2,
          playerName: awayTeam.team.name,
          eventType: getEventTypeForSport(sport),
          minute: Math.floor(Math.random() * currentMinute) + 1
        });
      }
      
      // Create match with ESPN data
      return {
        id: parseInt(event.id, 10) || (index + 1),
        leagueId: league.id,
        homeTeamId: parseInt(homeTeam.id, 10),
        awayTeamId: parseInt(awayTeam.id, 10),
        homeScore,
        awayScore,
        status: 'LIVE',
        startTime: new Date(event.date),
        currentMinute,
        homeTeam: {
          id: parseInt(homeTeam.id, 10),
          name: homeTeam.team.displayName || homeTeam.team.name,
          shortName: homeTeam.team.shortDisplayName || homeTeam.team.abbreviation || "TBD",
          country: homeTeam.team.location || "Unknown",
          logo: homeTeam.team.logo || ""
        },
        awayTeam: {
          id: parseInt(awayTeam.id, 10),
          name: awayTeam.team.displayName || awayTeam.team.name,
          shortName: awayTeam.team.shortDisplayName || awayTeam.team.abbreviation || "TBD",
          country: awayTeam.team.location || "Unknown",
          logo: awayTeam.team.logo || ""
        },
        league,
        events
      };
    })
    .filter(Boolean) as MatchWithDetails[];
}

// Get appropriate event type based on the sport
function getEventTypeForSport(sport: string): string {
  switch (sport) {
    case 'soccer':
      return 'GOAL';
    case 'basketball':
      return 'POINTS';
    case 'baseball':
      return 'RUN';
    case 'football':
      return 'TOUCHDOWN';
    case 'hockey':
      return 'GOAL';
    case 'rugby':
      return 'TRY';
    default:
      return 'SCORE';
  }
}