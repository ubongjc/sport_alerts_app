import { MatchWithDetails } from "@/lib/types";

// This service handles fetching live sports data from external APIs
// In a production app, this would connect to a real sports data API

// Base URL for fetching sports data
const SPORTS_API_BASE_URL = "https://api.example.com/v1";

// Function to fetch live matches for a specific sport
export async function fetchLiveMatches(sport: string): Promise<MatchWithDetails[]> {
  try {
    // In a real implementation, this would make an actual API call
    // For now, we'll generate realistic-looking live data
    
    // Simulate an API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data that looks like real data
    return generateRealisticLiveMatches(sport);
  } catch (error) {
    console.error("Error fetching live matches:", error);
    throw error;
  }
}

// Get realistic team names for different sports
function getSportTeams(sport: string): { name: string, id: number }[] {
  switch(sport) {
    case 'soccer':
      return [
        { name: "Manchester United", id: 1 },
        { name: "Liverpool", id: 2 },
        { name: "Arsenal", id: 3 },
        { name: "Chelsea", id: 4 },
        { name: "Manchester City", id: 5 },
        { name: "Tottenham", id: 6 },
        { name: "Real Madrid", id: 7 },
        { name: "Barcelona", id: 8 },
        { name: "Bayern Munich", id: 9 },
        { name: "PSG", id: 10 }
      ];
    case 'basketball':
      return [
        { name: "LA Lakers", id: 11 },
        { name: "Boston Celtics", id: 12 },
        { name: "Chicago Bulls", id: 13 },
        { name: "Miami Heat", id: 14 },
        { name: "Golden State Warriors", id: 15 },
        { name: "Brooklyn Nets", id: 16 },
        { name: "Phoenix Suns", id: 17 },
        { name: "Dallas Mavericks", id: 18 },
        { name: "Milwaukee Bucks", id: 19 },
        { name: "Toronto Raptors", id: 20 }
      ];
    case 'baseball':
      return [
        { name: "NY Yankees", id: 21 },
        { name: "Boston Red Sox", id: 22 },
        { name: "LA Dodgers", id: 23 },
        { name: "Chicago Cubs", id: 24 },
        { name: "Houston Astros", id: 25 },
        { name: "SF Giants", id: 26 },
        { name: "Atlanta Braves", id: 27 },
        { name: "Philadelphia Phillies", id: 28 },
        { name: "St. Louis Cardinals", id: 29 },
        { name: "Toronto Blue Jays", id: 30 }
      ];
    case 'football':
      return [
        { name: "Kansas City Chiefs", id: 31 },
        { name: "Tampa Bay Buccaneers", id: 32 },
        { name: "Buffalo Bills", id: 33 },
        { name: "Philadelphia Eagles", id: 34 },
        { name: "San Francisco 49ers", id: 35 },
        { name: "Dallas Cowboys", id: 36 },
        { name: "Green Bay Packers", id: 37 },
        { name: "Cincinnati Bengals", id: 38 },
        { name: "LA Rams", id: 39 },
        { name: "Baltimore Ravens", id: 40 }
      ];
    case 'hockey':
      return [
        { name: "Toronto Maple Leafs", id: 41 },
        { name: "Montreal Canadiens", id: 42 },
        { name: "Boston Bruins", id: 43 },
        { name: "NY Rangers", id: 44 },
        { name: "Tampa Bay Lightning", id: 45 },
        { name: "Colorado Avalanche", id: 46 },
        { name: "Edmonton Oilers", id: 47 },
        { name: "Pittsburgh Penguins", id: 48 },
        { name: "Chicago Blackhawks", id: 49 },
        { name: "Vancouver Canucks", id: 50 }
      ];
    case 'rugby':
      return [
        { name: "All Blacks", id: 51 },
        { name: "Springboks", id: 52 },
        { name: "England", id: 53 },
        { name: "Ireland", id: 54 },
        { name: "France", id: 55 },
        { name: "Australia", id: 56 },
        { name: "Wales", id: 57 },
        { name: "Scotland", id: 58 },
        { name: "Argentina", id: 59 },
        { name: "Italy", id: 60 }
      ];
    default:
      return [];
  }
}

// Get leagues for different sports
function getSportLeagues(sport: string): { name: string, id: number }[] {
  switch(sport) {
    case 'soccer':
      return [
        { name: "Premier League", id: 1 },
        { name: "La Liga", id: 2 },
        { name: "Bundesliga", id: 3 },
        { name: "Serie A", id: 4 },
        { name: "Ligue 1", id: 5 }
      ];
    case 'basketball':
      return [
        { name: "NBA", id: 6 },
        { name: "EuroLeague", id: 7 },
        { name: "NCAA", id: 8 }
      ];
    case 'baseball':
      return [
        { name: "MLB", id: 9 },
        { name: "NPB", id: 10 }
      ];
    case 'football':
      return [
        { name: "NFL", id: 11 },
        { name: "NCAA Football", id: 12 }
      ];
    case 'hockey':
      return [
        { name: "NHL", id: 13 },
        { name: "KHL", id: 14 }
      ];
    case 'rugby':
      return [
        { name: "Six Nations", id: 15 },
        { name: "Rugby Championship", id: 16 },
        { name: "World Cup", id: 17 }
      ];
    default:
      return [];
  }
}

// Generate realistic event types based on the sport
function generateSportEvent(sport: string, teamId: number, minute: number): any {
  const playerNames = [
    "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson",
    "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin"
  ];
  
  const randomPlayer = playerNames[Math.floor(Math.random() * playerNames.length)];
  
  switch(sport) {
    case 'soccer':
      const soccerEvents = ['GOAL', 'YELLOW_CARD', 'RED_CARD', 'SUBSTITUTION'];
      const eventType = soccerEvents[Math.floor(Math.random() * soccerEvents.length)];
      return {
        id: Math.floor(Math.random() * 1000),
        matchId: 1,
        teamId,
        playerId: Math.floor(Math.random() * 30) + 1,
        playerName: randomPlayer,
        eventType,
        minute
      };
    case 'basketball':
      return {
        id: Math.floor(Math.random() * 1000),
        matchId: 1,
        teamId,
        playerId: Math.floor(Math.random() * 20) + 1,
        playerName: randomPlayer,
        eventType: Math.random() > 0.2 ? 'POINTS' : 'FOUL',
        minute,
        points: Math.random() > 0.7 ? 3 : (Math.random() > 0.5 ? 2 : 1)
      };
    case 'baseball':
      return {
        id: Math.floor(Math.random() * 1000),
        matchId: 1,
        teamId,
        playerId: Math.floor(Math.random() * 25) + 1,
        playerName: randomPlayer,
        eventType: Math.random() > 0.6 ? 'HIT' : (Math.random() > 0.3 ? 'OUT' : 'RUN'),
        inning: Math.floor(minute / 15) + 1,
        isTop: minute % 15 < 7
      };
    default:
      return {
        id: Math.floor(Math.random() * 1000),
        matchId: 1,
        teamId,
        playerId: Math.floor(Math.random() * 30) + 1,
        playerName: randomPlayer,
        eventType: 'SCORE',
        minute
      };
  }
}

// Generate realistic-looking match data
function generateRealisticLiveMatches(sport: string): MatchWithDetails[] {
  const teams = getSportTeams(sport);
  const leagues = getSportLeagues(sport);
  const matches: MatchWithDetails[] = [];
  
  // Current date for realistic match times
  const now = new Date();
  
  // Create 3-5 live matches
  const numMatches = Math.floor(Math.random() * 3) + 3;
  
  for(let i = 0; i < numMatches; i++) {
    // Randomize teams
    const shuffledTeams = [...teams].sort(() => 0.5 - Math.random());
    const homeTeam = shuffledTeams[0];
    const awayTeam = shuffledTeams[1];
    
    // Randomize league
    const league = leagues[Math.floor(Math.random() * leagues.length)];
    
    // Randomize score based on sport
    let homeScore, awayScore, currentMinute;
    switch(sport) {
      case 'soccer':
        homeScore = Math.floor(Math.random() * 4);
        awayScore = Math.floor(Math.random() * 3);
        currentMinute = Math.floor(Math.random() * 90) + 1;
        break;
      case 'basketball':
        homeScore = Math.floor(Math.random() * 30) + 60;
        awayScore = Math.floor(Math.random() * 30) + 60;
        currentMinute = Math.floor(Math.random() * 48) + 1;
        break;
      case 'baseball':
        homeScore = Math.floor(Math.random() * 8);
        awayScore = Math.floor(Math.random() * 8);
        currentMinute = Math.floor(Math.random() * 9) * 15 + Math.floor(Math.random() * 15); // 9 innings
        break;
      case 'football':
        homeScore = Math.floor(Math.random() * 35);
        awayScore = Math.floor(Math.random() * 35);
        currentMinute = Math.floor(Math.random() * 60) + 1;
        break;
      case 'hockey':
        homeScore = Math.floor(Math.random() * 6);
        awayScore = Math.floor(Math.random() * 6);
        currentMinute = Math.floor(Math.random() * 60) + 1;
        break;
      case 'rugby':
        homeScore = Math.floor(Math.random() * 30);
        awayScore = Math.floor(Math.random() * 30);
        currentMinute = Math.floor(Math.random() * 80) + 1;
        break;
      default:
        homeScore = Math.floor(Math.random() * 5);
        awayScore = Math.floor(Math.random() * 5);
        currentMinute = Math.floor(Math.random() * 90) + 1;
    }
    
    // Generate events
    const numEvents = homeScore + awayScore + Math.floor(Math.random() * 5);
    const events = [];
    
    for(let j = 0; j < numEvents; j++) {
      const eventMinute = Math.floor(Math.random() * currentMinute) + 1;
      const eventTeamId = Math.random() > 0.5 ? homeTeam.id : awayTeam.id;
      events.push(generateSportEvent(sport, eventTeamId, eventMinute));
    }
    
    // Create match with realistic data
    const match: MatchWithDetails = {
      id: i + 1,
      leagueId: league.id,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      homeScore,
      awayScore,
      status: 'LIVE',
      startTime: new Date(now.getTime() - (currentMinute * 60000)),
      currentMinute,
      homeTeam: {
        id: homeTeam.id,
        name: homeTeam.name,
        country: 'Unknown',
        logo: null
      },
      awayTeam: {
        id: awayTeam.id,
        name: awayTeam.name,
        country: 'Unknown',
        logo: null
      },
      league: {
        id: league.id,
        name: league.name,
        country: 'International',
        logo: null
      },
      events: events
    };
    
    matches.push(match);
  }
  
  return matches;
}