// Football Data API Service
// This file handles communication with the football-data.org API

const API_KEY = process.env.FOOTBALL_DATA_API_KEY;

/**
 * Fetch upcoming matches from Football Data API
 * @returns Promise with upcoming matches data
 */
export async function fetchUpcomingMatches() {
  if (!API_KEY) {
    throw new Error('Football Data API key not found in environment');
  }
  
  try {
    // Get current date in ISO format
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate date 14 days from now for the date filter
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    const endDate = twoWeeksFromNow.toISOString().split('T')[0];
    
    // We'll fetch upcoming matches from multiple major leagues
    const leagueCodes = ['PL', 'BL1', 'SA', 'PD', 'FL1', 'PPL'];
    let allMatches = [];
    
    // Fetch matches from each league (in sequence to respect API rate limits)
    for (const leagueCode of leagueCodes) {
      try {
        console.log(`Fetching upcoming matches for ${leagueCode}...`);
        
        const upcomingEndpoint = `https://api.football-data.org/v4/competitions/${leagueCode}/matches?dateFrom=${today}&dateTo=${endDate}&status=SCHEDULED`;
        
        const response = await fetch(upcomingEndpoint, {
          headers: {
            'X-Auth-Token': API_KEY
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.matches && data.matches.length > 0) {
            console.log(`Found ${data.matches.length} upcoming matches for ${leagueCode}`);
            
            // Format the matches to match our application's data structure
            const formattedMatches = data.matches.map(match => {
              return {
                id: match.id,
                date: new Date(match.utcDate),
                startTime: new Date(match.utcDate),
                status: 'upcoming',
                currentMinute: null,
                homeTeamId: match.homeTeam.id,
                awayTeamId: match.awayTeam.id,
                homeScore: 0,
                awayScore: 0,
                sportId: 1, // Soccer
                leagueId: match.competition.id,
                sportradarId: `sr-match-${match.id}`,
                
                // Extended details
                homeTeam: {
                  id: match.homeTeam.id,
                  name: match.homeTeam.name,
                  shortName: match.homeTeam.shortName || match.homeTeam.tla || 'HOME',
                  country: match.homeTeam.area?.name || 'Unknown',
                  logo: match.homeTeam.crest || '⚽'
                },
                awayTeam: {
                  id: match.awayTeam.id,
                  name: match.awayTeam.name,
                  shortName: match.awayTeam.shortName || match.awayTeam.tla || 'AWAY',
                  country: match.awayTeam.area?.name || 'Unknown',
                  logo: match.awayTeam.crest || '⚽'
                },
                league: {
                  id: match.competition.id,
                  name: match.competition.name,
                  country: match.competition.area?.name || 'International',
                  logo: match.competition.emblem || '🏆'
                },
                events: [] // No events for upcoming matches
              };
            });
            
            allMatches = allMatches.concat(formattedMatches);
          }
        } else {
          console.log(`Could not fetch ${leagueCode} matches: ${response.status}`);
        }
        
        // Add a small delay between API calls to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (err) {
        console.error(`Error fetching ${leagueCode} matches:`, err);
      }
    }
    
    // Sort by date (earliest first)
    allMatches.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    
    // Limit to a reasonable number if there are too many
    if (allMatches.length > 50) {
      allMatches = allMatches.slice(0, 50);
    }
    
    return allMatches;
  } catch (error) {
    console.error('Error fetching upcoming matches:', error);
    throw error;
  }
}