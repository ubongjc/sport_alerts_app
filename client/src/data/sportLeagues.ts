// Sport-specific leagues and tournaments
export interface League {
  id: string;
  name: string;
  country: string;
  tier: number; // 1 = top tier, 2 = second tier, etc.
  selected: boolean;
}

export interface SportLeaguesData {
  popular: League[];
  all: {
    [country: string]: League[];
  };
}

export function getSportLeagues(sportId: string): SportLeaguesData {
  switch(sportId) {
    case 'soccer':
      return {
        popular: [
          { id: 'epl', name: 'Premier League', country: 'England', tier: 1, selected: false },
          { id: 'laliga', name: 'La Liga', country: 'Spain', tier: 1, selected: false },
          { id: 'seriea', name: 'Serie A', country: 'Italy', tier: 1, selected: false },
          { id: 'bundesliga', name: 'Bundesliga', country: 'Germany', tier: 1, selected: false },
          { id: 'ligue1', name: 'Ligue 1', country: 'France', tier: 1, selected: false },
          { id: 'champions', name: 'Champions League', country: 'Europe', tier: 1, selected: false },
          { id: 'europa', name: 'Europa League', country: 'Europe', tier: 1, selected: false }
        ],
        all: {
          'England': [
            { id: 'epl', name: 'Premier League', country: 'England', tier: 1, selected: false },
            { id: 'championship', name: 'Championship', country: 'England', tier: 2, selected: false },
            { id: 'league_one', name: 'League One', country: 'England', tier: 3, selected: false },
            { id: 'fa_cup', name: 'FA Cup', country: 'England', tier: 1, selected: false }
          ],
          'Spain': [
            { id: 'laliga', name: 'La Liga', country: 'Spain', tier: 1, selected: false },
            { id: 'laliga2', name: 'La Liga 2', country: 'Spain', tier: 2, selected: false }
          ],
          'Italy': [
            { id: 'seriea', name: 'Serie A', country: 'Italy', tier: 1, selected: false },
            { id: 'serieb', name: 'Serie B', country: 'Italy', tier: 2, selected: false }
          ],
          'Germany': [
            { id: 'bundesliga', name: 'Bundesliga', country: 'Germany', tier: 1, selected: false },
            { id: 'bundesliga2', name: '2. Bundesliga', country: 'Germany', tier: 2, selected: false }
          ],
          'France': [
            { id: 'ligue1', name: 'Ligue 1', country: 'France', tier: 1, selected: false },
            { id: 'ligue2', name: 'Ligue 2', country: 'France', tier: 2, selected: false }
          ],
          'Europe': [
            { id: 'champions', name: 'Champions League', country: 'Europe', tier: 1, selected: false },
            { id: 'europa', name: 'Europa League', country: 'Europe', tier: 1, selected: false }
          ],
          'USA': [
            { id: 'mls', name: 'MLS', country: 'USA', tier: 1, selected: false }
          ]
        }
      };
    case 'basketball':
      return {
        popular: [
          { id: 'nba', name: 'NBA', country: 'USA', tier: 1, selected: false },
          { id: 'euroleague', name: 'EuroLeague', country: 'Europe', tier: 1, selected: false },
          { id: 'ncaa', name: 'NCAA', country: 'USA', tier: 1, selected: false },
          { id: 'fiba_world_cup', name: 'FIBA World Cup', country: 'International', tier: 1, selected: false }
        ],
        all: {
          'USA': [
            { id: 'nba', name: 'NBA', country: 'USA', tier: 1, selected: false },
            { id: 'ncaa', name: 'NCAA', country: 'USA', tier: 1, selected: false },
            { id: 'wnba', name: 'WNBA', country: 'USA', tier: 1, selected: false }
          ],
          'Europe': [
            { id: 'euroleague', name: 'EuroLeague', country: 'Europe', tier: 1, selected: false },
            { id: 'eurocup', name: 'EuroCup', country: 'Europe', tier: 2, selected: false }
          ],
          'Spain': [
            { id: 'acb', name: 'Liga ACB', country: 'Spain', tier: 1, selected: false }
          ],
          'International': [
            { id: 'fiba_world_cup', name: 'FIBA World Cup', country: 'International', tier: 1, selected: false },
            { id: 'olympics', name: 'Olympic Basketball', country: 'International', tier: 1, selected: false }
          ]
        }
      };
    case 'football':
      return {
        popular: [
          { id: 'nfl', name: 'NFL', country: 'USA', tier: 1, selected: false },
          { id: 'ncaa_football', name: 'NCAA Football', country: 'USA', tier: 1, selected: false },
          { id: 'super_bowl', name: 'Super Bowl', country: 'USA', tier: 1, selected: false }
        ],
        all: {
          'USA': [
            { id: 'nfl', name: 'NFL', country: 'USA', tier: 1, selected: false },
            { id: 'ncaa_football', name: 'NCAA Football', country: 'USA', tier: 1, selected: false }
          ],
          'Canada': [
            { id: 'cfl', name: 'Canadian Football League', country: 'Canada', tier: 1, selected: false }
          ]
        }
      };
    case 'baseball':
      return {
        popular: [
          { id: 'mlb', name: 'MLB', country: 'USA', tier: 1, selected: false },
          { id: 'npb', name: 'Nippon Professional Baseball', country: 'Japan', tier: 1, selected: false }
        ],
        all: {
          'USA': [
            { id: 'mlb', name: 'MLB', country: 'USA', tier: 1, selected: false },
            { id: 'ncaa_baseball', name: 'NCAA Baseball', country: 'USA', tier: 1, selected: false }
          ],
          'Japan': [
            { id: 'npb', name: 'Nippon Professional Baseball', country: 'Japan', tier: 1, selected: false }
          ],
          'International': [
            { id: 'world_baseball_classic', name: 'World Baseball Classic', country: 'International', tier: 1, selected: false }
          ]
        }
      };
    case 'hockey':
      return {
        popular: [
          { id: 'nhl', name: 'NHL', country: 'USA/Canada', tier: 1, selected: false },
          { id: 'khl', name: 'Kontinental Hockey League', country: 'Russia', tier: 1, selected: false }
        ],
        all: {
          'USA/Canada': [
            { id: 'nhl', name: 'NHL', country: 'USA/Canada', tier: 1, selected: false },
            { id: 'ahl', name: 'American Hockey League', country: 'USA/Canada', tier: 2, selected: false }
          ],
          'Russia': [
            { id: 'khl', name: 'Kontinental Hockey League', country: 'Russia', tier: 1, selected: false }
          ],
          'International': [
            { id: 'iihf_world', name: 'IIHF World Championship', country: 'International', tier: 1, selected: false }
          ]
        }
      };
    case 'rugby':
      return {
        popular: [
          { id: 'six_nations', name: 'Six Nations', country: 'Europe', tier: 1, selected: false },
          { id: 'rugby_world_cup', name: 'Rugby World Cup', country: 'International', tier: 1, selected: false },
          { id: 'premiership_rugby', name: 'Premiership Rugby', country: 'England', tier: 1, selected: false }
        ],
        all: {
          'Europe': [
            { id: 'six_nations', name: 'Six Nations', country: 'Europe', tier: 1, selected: false },
            { id: 'champions_cup', name: 'Champions Cup', country: 'Europe', tier: 1, selected: false }
          ],
          'England': [
            { id: 'premiership_rugby', name: 'Premiership Rugby', country: 'England', tier: 1, selected: false }
          ],
          'Australia/NZ': [
            { id: 'super_rugby', name: 'Super Rugby', country: 'Australia/NZ', tier: 1, selected: false }
          ],
          'International': [
            { id: 'rugby_world_cup', name: 'Rugby World Cup', country: 'International', tier: 1, selected: false }
          ]
        }
      };
    case 'formula1':
      return {
        popular: [
          { id: 'f1', name: 'Formula 1', country: 'International', tier: 1, selected: false },
          { id: 'f2', name: 'Formula 2', country: 'International', tier: 2, selected: false }
        ],
        all: {
          'International': [
            { id: 'f1', name: 'Formula 1', country: 'International', tier: 1, selected: false },
            { id: 'f2', name: 'Formula 2', country: 'International', tier: 2, selected: false },
            { id: 'f3', name: 'Formula 3', country: 'International', tier: 3, selected: false }
          ],
          'USA': [
            { id: 'indy', name: 'IndyCar Series', country: 'USA', tier: 1, selected: false },
            { id: 'nascar', name: 'NASCAR Cup Series', country: 'USA', tier: 1, selected: false }
          ]
        }
      };
    case 'tennis':
      return {
        popular: [
          { id: 'wimbledon', name: 'Wimbledon', country: 'England', tier: 1, selected: false },
          { id: 'us_open_tennis', name: 'US Open', country: 'USA', tier: 1, selected: false },
          { id: 'french_open', name: 'French Open', country: 'France', tier: 1, selected: false },
          { id: 'australian_open', name: 'Australian Open', country: 'Australia', tier: 1, selected: false },
          { id: 'atp_tour', name: 'ATP Tour', country: 'International', tier: 1, selected: false },
          { id: 'wta_tour', name: 'WTA Tour', country: 'International', tier: 1, selected: false }
        ],
        all: {
          'Grand Slams': [
            { id: 'wimbledon', name: 'Wimbledon', country: 'England', tier: 1, selected: false },
            { id: 'us_open_tennis', name: 'US Open', country: 'USA', tier: 1, selected: false },
            { id: 'french_open', name: 'French Open', country: 'France', tier: 1, selected: false },
            { id: 'australian_open', name: 'Australian Open', country: 'Australia', tier: 1, selected: false }
          ],
          'Professional Tours': [
            { id: 'atp_tour', name: 'ATP Tour', country: 'International', tier: 1, selected: false },
            { id: 'wta_tour', name: 'WTA Tour', country: 'International', tier: 1, selected: false },
            { id: 'atp_challengers', name: 'ATP Challengers', country: 'International', tier: 2, selected: false }
          ]
        }
      };
    case 'cricket':
      return {
        popular: [
          { id: 'ipl', name: 'Indian Premier League', country: 'India', tier: 1, selected: false },
          { id: 'big_bash', name: 'Big Bash League', country: 'Australia', tier: 1, selected: false },
          { id: 'county_championship', name: 'County Championship', country: 'England', tier: 1, selected: false },
          { id: 'world_cup_cricket', name: 'Cricket World Cup', country: 'International', tier: 1, selected: false },
          { id: 't20_world_cup', name: 'T20 World Cup', country: 'International', tier: 1, selected: false }
        ],
        all: {
          'International': [
            { id: 'world_cup_cricket', name: 'Cricket World Cup', country: 'International', tier: 1, selected: false },
            { id: 't20_world_cup', name: 'T20 World Cup', country: 'International', tier: 1, selected: false },
            { id: 'test_championship', name: 'World Test Championship', country: 'International', tier: 1, selected: false }
          ],
          'India': [
            { id: 'ipl', name: 'Indian Premier League', country: 'India', tier: 1, selected: false },
            { id: 'ranji_trophy', name: 'Ranji Trophy', country: 'India', tier: 2, selected: false }
          ],
          'England': [
            { id: 'county_championship', name: 'County Championship', country: 'England', tier: 1, selected: false },
            { id: 'vitality_blast', name: 'Vitality Blast', country: 'England', tier: 1, selected: false }
          ],
          'Australia': [
            { id: 'big_bash', name: 'Big Bash League', country: 'Australia', tier: 1, selected: false },
            { id: 'sheffield_shield', name: 'Sheffield Shield', country: 'Australia', tier: 2, selected: false }
          ]
        }
      };
    case 'golf':
      return {
        popular: [
          { id: 'pga_tour', name: 'PGA Tour', country: 'USA', tier: 1, selected: false },
          { id: 'european_tour', name: 'European Tour', country: 'Europe', tier: 1, selected: false },
          { id: 'masters', name: 'Masters Tournament', country: 'USA', tier: 1, selected: false },
          { id: 'us_open_golf', name: 'US Open', country: 'USA', tier: 1, selected: false },
          { id: 'british_open', name: 'The Open Championship', country: 'Scotland', tier: 1, selected: false },
          { id: 'pga_championship', name: 'PGA Championship', country: 'USA', tier: 1, selected: false }
        ],
        all: {
          'Majors': [
            { id: 'masters', name: 'Masters Tournament', country: 'USA', tier: 1, selected: false },
            { id: 'us_open_golf', name: 'US Open', country: 'USA', tier: 1, selected: false },
            { id: 'british_open', name: 'The Open Championship', country: 'Scotland', tier: 1, selected: false },
            { id: 'pga_championship', name: 'PGA Championship', country: 'USA', tier: 1, selected: false }
          ],
          'Professional Tours': [
            { id: 'pga_tour', name: 'PGA Tour', country: 'USA', tier: 1, selected: false },
            { id: 'european_tour', name: 'European Tour', country: 'Europe', tier: 1, selected: false },
            { id: 'lpga_tour', name: 'LPGA Tour', country: 'International', tier: 1, selected: false },
            { id: 'champions_tour', name: 'Champions Tour', country: 'USA', tier: 2, selected: false }
          ]
        }
      };
    case 'boxing':
      return {
        popular: [
          { id: 'wbc', name: 'WBC Championship', country: 'International', tier: 1, selected: false },
          { id: 'wba', name: 'WBA Championship', country: 'International', tier: 1, selected: false },
          { id: 'ibf', name: 'IBF Championship', country: 'International', tier: 1, selected: false },
          { id: 'wbo', name: 'WBO Championship', country: 'International', tier: 1, selected: false }
        ],
        all: {
          'Professional': [
            { id: 'wbc', name: 'WBC Championship', country: 'International', tier: 1, selected: false },
            { id: 'wba', name: 'WBA Championship', country: 'International', tier: 1, selected: false },
            { id: 'ibf', name: 'IBF Championship', country: 'International', tier: 1, selected: false },
            { id: 'wbo', name: 'WBO Championship', country: 'International', tier: 1, selected: false }
          ]
        }
      };
    case 'tabletennis':
      return {
        popular: [
          { id: 'olympics_tt', name: 'Olympics Table Tennis', country: 'International', tier: 1, selected: false },
          { id: 'world_championships_tt', name: 'World Championships', country: 'International', tier: 1, selected: false },
          { id: 'world_cup_tt', name: 'World Cup', country: 'International', tier: 1, selected: false }
        ],
        all: {
          'International': [
            { id: 'olympics_tt', name: 'Olympics Table Tennis', country: 'International', tier: 1, selected: false },
            { id: 'world_championships_tt', name: 'World Championships', country: 'International', tier: 1, selected: false },
            { id: 'world_cup_tt', name: 'World Cup', country: 'International', tier: 1, selected: false }
          ]
        }
      };
    case 'volleyball':
      return {
        popular: [
          { id: 'olympics_vb', name: 'Olympics Volleyball', country: 'International', tier: 1, selected: false },
          { id: 'world_championships_vb', name: 'World Championships', country: 'International', tier: 1, selected: false },
          { id: 'nations_league', name: 'Nations League', country: 'International', tier: 1, selected: false }
        ],
        all: {
          'International': [
            { id: 'olympics_vb', name: 'Olympics Volleyball', country: 'International', tier: 1, selected: false },
            { id: 'world_championships_vb', name: 'World Championships', country: 'International', tier: 1, selected: false },
            { id: 'nations_league', name: 'Nations League', country: 'International', tier: 1, selected: false }
          ]
        }
      };
    case 'handball':
      return {
        popular: [
          { id: 'olympics_hb', name: 'Olympics Handball', country: 'International', tier: 1, selected: false },
          { id: 'world_championships_hb', name: 'World Championships', country: 'International', tier: 1, selected: false },
          { id: 'ehf_champions', name: 'EHF Champions League', country: 'Europe', tier: 1, selected: false }
        ],
        all: {
          'International': [
            { id: 'olympics_hb', name: 'Olympics Handball', country: 'International', tier: 1, selected: false },
            { id: 'world_championships_hb', name: 'World Championships', country: 'International', tier: 1, selected: false }
          ],
          'Europe': [
            { id: 'ehf_champions', name: 'EHF Champions League', country: 'Europe', tier: 1, selected: false }
          ]
        }
      };
    case 'mma':
      return {
        popular: [
          { id: 'ufc', name: 'UFC', country: 'International', tier: 1, selected: false },
          { id: 'bellator', name: 'Bellator MMA', country: 'USA', tier: 2, selected: false },
          { id: 'one_championship', name: 'ONE Championship', country: 'Asia', tier: 2, selected: false }
        ],
        all: {
          'International': [
            { id: 'ufc', name: 'UFC', country: 'International', tier: 1, selected: false }
          ],
          'USA': [
            { id: 'bellator', name: 'Bellator MMA', country: 'USA', tier: 2, selected: false }
          ],
          'Asia': [
            { id: 'one_championship', name: 'ONE Championship', country: 'Asia', tier: 2, selected: false }
          ]
        }
      };
    case 'nascar':
      return {
        popular: [
          { id: 'nascar_cup', name: 'NASCAR Cup Series', country: 'USA', tier: 1, selected: false },
          { id: 'nascar_xfinity', name: 'NASCAR Xfinity Series', country: 'USA', tier: 2, selected: false },
          { id: 'nascar_truck', name: 'NASCAR Truck Series', country: 'USA', tier: 3, selected: false }
        ],
        all: {
          'USA': [
            { id: 'nascar_cup', name: 'NASCAR Cup Series', country: 'USA', tier: 1, selected: false },
            { id: 'nascar_xfinity', name: 'NASCAR Xfinity Series', country: 'USA', tier: 2, selected: false },
            { id: 'nascar_truck', name: 'NASCAR Truck Series', country: 'USA', tier: 3, selected: false }
          ]
        }
      };
    case 'darts':
      return {
        popular: [
          { id: 'pdc_world_championship', name: 'PDC World Championship', country: 'England', tier: 1, selected: false },
          { id: 'world_matchplay', name: 'World Matchplay', country: 'England', tier: 1, selected: false },
          { id: 'premier_league_darts', name: 'Premier League Darts', country: 'International', tier: 1, selected: false }
        ],
        all: {
          'Professional': [
            { id: 'pdc_world_championship', name: 'PDC World Championship', country: 'England', tier: 1, selected: false },
            { id: 'world_matchplay', name: 'World Matchplay', country: 'England', tier: 1, selected: false },
            { id: 'premier_league_darts', name: 'Premier League Darts', country: 'International', tier: 1, selected: false },
            { id: 'world_grand_prix', name: 'World Grand Prix', country: 'Ireland', tier: 1, selected: false }
          ]
        }
      };
    case 'lacrosse':
      return {
        popular: [
          { id: 'nll', name: 'National Lacrosse League', country: 'North America', tier: 1, selected: false },
          { id: 'pll', name: 'Premier Lacrosse League', country: 'USA', tier: 1, selected: false },
          { id: 'world_lacrosse', name: 'World Lacrosse Championship', country: 'International', tier: 1, selected: false }
        ],
        all: {
          'Professional': [
            { id: 'nll', name: 'National Lacrosse League', country: 'North America', tier: 1, selected: false },
            { id: 'pll', name: 'Premier Lacrosse League', country: 'USA', tier: 1, selected: false }
          ],
          'International': [
            { id: 'world_lacrosse', name: 'World Lacrosse Championship', country: 'International', tier: 1, selected: false }
          ]
        }
      };
    case 'esports':
      return {
        popular: [
          { id: 'lol_worlds', name: 'League of Legends Worlds', country: 'International', tier: 1, selected: false },
          { id: 'csgo_majors', name: 'CS:GO Majors', country: 'International', tier: 1, selected: false },
          { id: 'valorant_champions', name: 'VALORANT Champions', country: 'International', tier: 1, selected: false },
          { id: 'dota_ti', name: 'Dota 2 The International', country: 'International', tier: 1, selected: false }
        ],
        all: {
          'MOBA': [
            { id: 'lol_worlds', name: 'League of Legends Worlds', country: 'International', tier: 1, selected: false },
            { id: 'dota_ti', name: 'Dota 2 The International', country: 'International', tier: 1, selected: false }
          ],
          'FPS': [
            { id: 'csgo_majors', name: 'CS:GO Majors', country: 'International', tier: 1, selected: false },
            { id: 'valorant_champions', name: 'VALORANT Champions', country: 'International', tier: 1, selected: false }
          ],
          'Battle Royale': [
            { id: 'fortnite_world_cup', name: 'Fortnite World Cup', country: 'International', tier: 1, selected: false }
          ]
        }
      };
    default:
      return {
        popular: [],
        all: {}
      };
  }
}

// Utility function to get sport name for display
export function getSportDisplayName(sportId: string): string {
  switch(sportId) {
    case 'soccer': return 'Soccer';
    case 'basketball': return 'Basketball';
    case 'football': return 'American Football';
    case 'baseball': return 'Baseball';
    case 'hockey': return 'Ice Hockey';
    case 'rugby': return 'Rugby';
    case 'formula1': return 'Formula 1';
    case 'tennis': return 'Tennis';
    case 'cricket': return 'Cricket';
    case 'golf': return 'Golf';
    case 'boxing': return 'Boxing';
    case 'tabletennis': return 'Table Tennis';
    case 'volleyball': return 'Volleyball';
    case 'handball': return 'Handball';
    case 'mma': return 'MMA';
    case 'nascar': return 'NASCAR';
    case 'darts': return 'Darts';
    case 'lacrosse': return 'Lacrosse';
    case 'esports': return 'Esports';
    default: return sportId.charAt(0).toUpperCase() + sportId.slice(1);
  }
}

// List of all supported sports in order of priority
export const ALL_SPORTS_IN_ORDER = [
  'soccer', 
  'basketball', 
  'football', 
  'baseball', 
  'hockey', 
  'rugby', 
  'formula1',
  'tennis',
  'cricket',
  'golf',
  'boxing',
  'tabletennis',
  'volleyball',
  'handball',
  'mma',
  'nascar',
  'darts',
  'lacrosse',
  'esports'
];

// Get sport-specific alerts configuration
export function getSportAlertOptions(sportId: string) {
  switch(sportId) {
    case 'soccer':
      return [
        { id: 'goals', label: 'Goals', description: 'Goals scored by either team' },
        { id: 'redCards', label: 'Red Cards', description: 'Red cards shown to players' },
        { id: 'yellowCards', label: 'Yellow Cards', description: 'Yellow cards shown to players' },
        { id: 'penalties', label: 'Penalties', description: 'Penalty kicks awarded' },
        { id: 'corners', label: 'Corner Kicks', description: 'Corner kicks awarded' },
        { id: 'freekicks', label: 'Free Kicks', description: 'Free kicks in dangerous areas' },
        { id: 'substitutions', label: 'Substitutions', description: 'Player substitutions made' },
        { id: 'offsides', label: 'Offsides', description: 'Offside calls made' },
        { id: 'saves', label: 'Goalkeeper Saves', description: 'Important saves by goalkeepers' },
        { id: 'shots', label: 'Shots on Target', description: 'Shots hitting the target' }
      ];
    case 'basketball':
      return [
        { id: 'points', label: 'Points Scored', description: 'Points scored by either team' },
        { id: 'threePointers', label: '3-Point Shots', description: 'Three-point shots made' },
        { id: 'freeThrows', label: 'Free Throws', description: 'Free throw attempts and makes' },
        { id: 'rebounds', label: 'Rebounds', description: 'Rebounds grabbed by players' },
        { id: 'assists', label: 'Assists', description: 'Assists made by players' },
        { id: 'steals', label: 'Steals', description: 'Steals made by defenders' },
        { id: 'blocks', label: 'Blocks', description: 'Shots blocked by defenders' },
        { id: 'turnovers', label: 'Turnovers', description: 'Turnovers committed' },
        { id: 'timeouts', label: 'Timeouts', description: 'Timeouts called by teams' },
        { id: 'fouls', label: 'Personal Fouls', description: 'Personal fouls committed' }
      ];
    case 'football':
      return [
        { id: 'touchdowns', label: 'Touchdowns', description: 'Touchdowns scored' },
        { id: 'fieldGoals', label: 'Field Goals', description: 'Field goals attempted and made' },
        { id: 'interceptions', label: 'Interceptions', description: 'Passes intercepted by defense' },
        { id: 'fumbles', label: 'Fumbles', description: 'Fumbles lost by offense' },
        { id: 'sacks', label: 'Sacks', description: 'Quarterback sacks by defense' },
        { id: 'penalties', label: 'Penalties', description: 'Penalties called on teams' },
        { id: 'safeties', label: 'Safeties', description: 'Safeties scored (2 points)' },
        { id: 'firstDowns', label: 'First Downs', description: 'First downs achieved' },
        { id: 'passCompletions', label: 'Pass Completions', description: 'Completed forward passes' },
        { id: 'rushingYards', label: 'Rushing Yards', description: 'Rushing yards gained' }
      ];
    case 'baseball':
      return [
        { id: 'homeRuns', label: 'Home Runs', description: 'Home runs hit by batters' },
        { id: 'hits', label: 'Hits', description: 'Base hits by batters' },
        { id: 'strikeouts', label: 'Strikeouts', description: 'Strikeouts by pitchers' },
        { id: 'walks', label: 'Walks', description: 'Walks issued by pitchers' },
        { id: 'doubles', label: 'Doubles', description: 'Double hits by batters' },
        { id: 'triples', label: 'Triples', description: 'Triple hits by batters' },
        { id: 'rbis', label: 'RBIs', description: 'Runs batted in' },
        { id: 'stolenBases', label: 'Stolen Bases', description: 'Bases stolen by runners' },
        { id: 'errors', label: 'Fielding Errors', description: 'Fielding errors committed' },
        { id: 'runs', label: 'Runs Scored', description: 'Runs scored by teams' }
      ];
    case 'hockey':
      return [
        { id: 'goals', label: 'Goals', description: 'Goals scored by either team' },
        { id: 'assists', label: 'Assists', description: 'Assists on goals' },
        { id: 'penalties', label: 'Penalties', description: 'Penalties called on players' },
        { id: 'saves', label: 'Goalie Saves', description: 'Saves made by goalkeepers' },
        { id: 'shots', label: 'Shots on Goal', description: 'Shots directed at goal' },
        { id: 'powerPlays', label: 'Power Plays', description: 'Power play opportunities' },
        { id: 'shortHanded', label: 'Short-Handed Goals', description: 'Goals while short-handed' },
        { id: 'faceoffs', label: 'Faceoff Wins', description: 'Faceoffs won by team' },
        { id: 'hits', label: 'Body Checks', description: 'Body checks delivered' },
        { id: 'blocks', label: 'Blocked Shots', description: 'Shots blocked by defenders' }
      ];
    case 'rugby':
      return [
        { id: 'tries', label: 'Tries', description: 'Tries scored (5 points)' },
        { id: 'conversions', label: 'Conversions', description: 'Conversion kicks after tries' },
        { id: 'penalties', label: 'Penalty Kicks', description: 'Penalty kicks awarded' },
        { id: 'dropGoals', label: 'Drop Goals', description: 'Drop goals scored' },
        { id: 'lineouts', label: 'Lineouts', description: 'Lineout throws' },
        { id: 'scrums', label: 'Scrums', description: 'Scrum formations' },
        { id: 'tackles', label: 'Tackles', description: 'Successful tackles made' },
        { id: 'rucks', label: 'Rucks', description: 'Ruck formations' },
        { id: 'mauls', label: 'Mauls', description: 'Maul formations' },
        { id: 'turnovers', label: 'Turnovers', description: 'Ball turnovers' }
      ];
    case 'formula1':
      return [
        { id: 'overtakes', label: 'Overtakes', description: 'Position changes between drivers' },
        { id: 'lapRecords', label: 'Lap Records', description: 'Fastest lap times set' },
        { id: 'pitStops', label: 'Pit Stops', description: 'Cars entering pit lane' },
        { id: 'crashes', label: 'Crashes/Incidents', description: 'Racing incidents and crashes' },
        { id: 'safetyCar', label: 'Safety Car', description: 'Safety car deployments' },
        { id: 'drs', label: 'DRS Zones', description: 'DRS (drag reduction system) usage' },
        { id: 'penalties', label: 'Penalties', description: 'Racing penalties issued' },
        { id: 'retirements', label: 'Retirements', description: 'Cars retiring from race' },
        { id: 'podiumChanges', label: 'Podium Changes', description: 'Changes in top 3 positions' },
        { id: 'weatherChanges', label: 'Weather Changes', description: 'Significant weather changes' }
      ];
    case 'tennis':
      return [
        { id: 'aces', label: 'Aces', description: 'Aces served by players' },
        { id: 'breakPoints', label: 'Break Points', description: 'Break point opportunities' },
        { id: 'doubleFaults', label: 'Double Faults', description: 'Double faults committed' },
        { id: 'winners', label: 'Winners', description: 'Winning shots hit' },
        { id: 'unforced', label: 'Unforced Errors', description: 'Unforced errors made' },
        { id: 'netPoints', label: 'Net Points', description: 'Points won at the net' },
        { id: 'longRallies', label: 'Long Rallies', description: 'Rallies over 10 shots' },
        { id: 'challenges', label: 'Hawk-Eye Challenges', description: 'Line call challenges made' },
        { id: 'tiebreaks', label: 'Tiebreaks', description: 'Tiebreak games played' },
        { id: 'setWins', label: 'Sets Won', description: 'Sets won by players' }
      ];
    case 'cricket':
      return [
        { id: 'wickets', label: 'Wickets', description: 'Wickets taken by bowlers' },
        { id: 'boundaries', label: 'Boundaries', description: 'Fours and sixes hit' },
        { id: 'centuries', label: 'Centuries', description: '100+ runs scored by batsman' },
        { id: 'fifties', label: 'Half-Centuries', description: '50+ runs scored by batsman' },
        { id: 'catches', label: 'Catches', description: 'Catches taken by fielders' },
        { id: 'runouts', label: 'Run Outs', description: 'Batsmen run out' },
        { id: 'lbws', label: 'LBWs', description: 'Leg before wicket dismissals' },
        { id: 'maidens', label: 'Maiden Overs', description: 'Maiden overs bowled' },
        { id: 'partnerships', label: 'Partnerships', description: 'Significant batting partnerships' },
        { id: 'appeals', label: 'Appeals', description: 'Appeals made by fielding team' }
      ];
    case 'golf':
      return [
        { id: 'birdies', label: 'Birdies', description: 'Birdies scored by golfers' },
        { id: 'eagles', label: 'Eagles', description: 'Eagles scored by golfers' },
        { id: 'holeinone', label: 'Hole-in-One', description: 'Holes-in-one achieved' },
        { id: 'bogeys', label: 'Bogeys', description: 'Bogeys scored by golfers' },
        { id: 'chipins', label: 'Chip-ins', description: 'Chip shots holed from off green' },
        { id: 'longputts', label: 'Long Putts', description: 'Putts made from 20+ feet' },
        { id: 'sandSaves', label: 'Sand Saves', description: 'Up and down from bunkers' },
        { id: 'fairways', label: 'Fairways Hit', description: 'Fairways hit in regulation' },
        { id: 'greens', label: 'Greens in Regulation', description: 'Greens hit in regulation' },
        { id: 'leaderChanges', label: 'Leader Changes', description: 'Changes in tournament lead' }
      ];
    case 'boxing':
      return [
        { id: 'knockouts', label: 'Knockouts', description: 'Knockout finishes' },
        { id: 'knockdowns', label: 'Knockdowns', description: 'Knockdowns during fight' },
        { id: 'rounds', label: 'Rounds Completed', description: 'Number of rounds completed' },
        { id: 'punches', label: 'Power Punches', description: 'Significant power punches landed' },
        { id: 'combinations', label: 'Combinations', description: 'Punch combinations thrown' },
        { id: 'bodyShots', label: 'Body Shots', description: 'Punches to the body' },
        { id: 'headShots', label: 'Head Shots', description: 'Punches to the head' },
        { id: 'jabs', label: 'Jabs', description: 'Jab punches thrown' },
        { id: 'uppercuts', label: 'Uppercuts', description: 'Uppercut punches thrown' },
        { id: 'warnings', label: 'Referee Warnings', description: 'Official warnings issued' }
      ];
    case 'tabletennis':
      return [
        { id: 'points', label: 'Points Won', description: 'Points won by players' },
        { id: 'rallies', label: 'Long Rallies', description: 'Rallies over 20 shots' },
        { id: 'serves', label: 'Ace Serves', description: 'Unreturnable serves' },
        { id: 'smashes', label: 'Smashes', description: 'Powerful smash shots' },
        { id: 'backhands', label: 'Backhand Winners', description: 'Winning backhand shots' },
        { id: 'forehands', label: 'Forehand Winners', description: 'Winning forehand shots' },
        { id: 'blocks', label: 'Defensive Blocks', description: 'Successful defensive blocks' },
        { id: 'netShots', label: 'Net Shots', description: 'Close-to-net winning shots' },
        { id: 'timeouts', label: 'Timeouts', description: 'Timeouts called by players' },
        { id: 'games', label: 'Games Won', description: 'Games won by players' }
      ];
    case 'volleyball':
      return [
        { id: 'spikes', label: 'Spikes/Kills', description: 'Successful spike attacks' },
        { id: 'blocks', label: 'Blocks', description: 'Successful blocks at net' },
        { id: 'serves', label: 'Service Aces', description: 'Unreturnable serves' },
        { id: 'digs', label: 'Digs', description: 'Successful defensive digs' },
        { id: 'sets', label: 'Assists/Sets', description: 'Assists for attacking players' },
        { id: 'errors', label: 'Attack Errors', description: 'Failed attack attempts' },
        { id: 'receptions', label: 'Reception Errors', description: 'Failed serve receptions' },
        { id: 'substitutions', label: 'Substitutions', description: 'Player substitutions' },
        { id: 'timeouts', label: 'Timeouts', description: 'Timeouts called by teams' },
        { id: 'challenges', label: 'Video Challenges', description: 'Video review challenges' }
      ];
    case 'handball':
      return [
        { id: 'goals', label: 'Goals', description: 'Goals scored by players' },
        { id: 'penalties', label: 'Penalty Goals', description: 'Goals from penalty throws' },
        { id: 'saves', label: 'Goalkeeper Saves', description: 'Saves made by goalkeepers' },
        { id: 'assists', label: 'Assists', description: 'Assists for goals' },
        { id: 'steals', label: 'Steals', description: 'Ball steals from opponents' },
        { id: 'blocks', label: 'Shot Blocks', description: 'Blocked shots by defense' },
        { id: 'fastBreaks', label: 'Fast Break Goals', description: 'Goals from fast breaks' },
        { id: 'cards', label: 'Cards', description: 'Yellow and red cards shown' },
        { id: 'suspensions', label: 'Suspensions', description: 'Player suspensions' },
        { id: 'turnovers', label: 'Turnovers', description: 'Ball turnovers' }
      ];
    case 'mma':
      return [
        { id: 'knockouts', label: 'Knockouts', description: 'Knockout finishes' },
        { id: 'submissions', label: 'Submissions', description: 'Submission finishes' },
        { id: 'takedowns', label: 'Takedowns', description: 'Successful takedowns' },
        { id: 'strikes', label: 'Significant Strikes', description: 'Significant strikes landed' },
        { id: 'ground', label: 'Ground Control', description: 'Ground control time' },
        { id: 'reversals', label: 'Reversals', description: 'Position reversals' },
        { id: 'escapes', label: 'Escapes', description: 'Escapes from bottom position' },
        { id: 'clinch', label: 'Clinch Strikes', description: 'Strikes from clinch position' },
        { id: 'cuts', label: 'Cuts/Blood', description: 'Cuts causing bleeding' },
        { id: 'warnings', label: 'Referee Warnings', description: 'Official warnings issued' }
      ];
    case 'nascar':
      return [
        { id: 'overtakes', label: 'Overtakes', description: 'Position changes during race' },
        { id: 'leadChanges', label: 'Lead Changes', description: 'Changes in race leader' },
        { id: 'cautions', label: 'Caution Flags', description: 'Caution periods called' },
        { id: 'crashes', label: 'Crashes', description: 'Racing incidents and crashes' },
        { id: 'pitStops', label: 'Pit Stops', description: 'Cars entering pit road' },
        { id: 'penalties', label: 'Penalties', description: 'Racing penalties issued' },
        { id: 'fastLaps', label: 'Fast Laps', description: 'Fastest lap times set' },
        { id: 'restarts', label: 'Restarts', description: 'Race restarts after cautions' },
        { id: 'stageWins', label: 'Stage Wins', description: 'Stage race victories' },
        { id: 'dnfs', label: 'DNFs', description: 'Cars that did not finish' }
      ];
    case 'darts':
      return [
        { id: 'bullseyes', label: 'Bullseyes', description: 'Hits on bullseye (50 points)' },
        { id: 'oneEighties', label: '180s', description: 'Maximum 180-point throws' },
        { id: 'checkouts', label: 'Checkouts', description: 'Successful game finishes' },
        { id: 'highFinish', label: 'High Finishes', description: 'Finishes over 100 points' },
        { id: 'doubles', label: 'Doubles Hit', description: 'Successful double hits' },
        { id: 'trebles', label: 'Trebles Hit', description: 'Successful treble hits' },
        { id: 'nineMarks', label: '9-Mark Throws', description: 'Nine marks in cricket games' },
        { id: 'averages', label: 'High Averages', description: 'High scoring averages' },
        { id: 'misses', label: 'Missed Doubles', description: 'Failed double attempts' },
        { id: 'legs', label: 'Legs Won', description: 'Individual legs won' }
      ];
    case 'lacrosse':
      return [
        { id: 'goals', label: 'Goals', description: 'Goals scored by players' },
        { id: 'assists', label: 'Assists', description: 'Assists on goals' },
        { id: 'saves', label: 'Goalkeeper Saves', description: 'Saves made by goalkeepers' },
        { id: 'faceoffs', label: 'Faceoff Wins', description: 'Faceoffs won by players' },
        { id: 'groundBalls', label: 'Ground Balls', description: 'Ground ball pickups' },
        { id: 'turnovers', label: 'Turnovers', description: 'Ball turnovers caused' },
        { id: 'penalties', label: 'Penalties', description: 'Penalties called on players' },
        { id: 'checks', label: 'Successful Checks', description: 'Successful defensive checks' },
        { id: 'clears', label: 'Clears', description: 'Successful clearing attempts' },
        { id: 'shots', label: 'Shots on Goal', description: 'Shots directed at goal' }
      ];
    case 'esports':
      return [
        { id: 'kills', label: 'Eliminations/Kills', description: 'Player eliminations' },
        { id: 'deaths', label: 'Deaths', description: 'Player deaths' },
        { id: 'assists', label: 'Assists', description: 'Assist contributions' },
        { id: 'objectives', label: 'Objectives', description: 'Objective completions' },
        { id: 'streaks', label: 'Kill Streaks', description: 'Multiple consecutive kills' },
        { id: 'powerups', label: 'Power-ups', description: 'Power-up acquisitions' },
        { id: 'rounds', label: 'Rounds Won', description: 'Round victories' },
        { id: 'damage', label: 'Damage Dealt', description: 'Total damage dealt' },
        { id: 'headshots', label: 'Headshots', description: 'Precision headshot kills' },
        { id: 'clutches', label: 'Clutch Plays', description: '1vX situational wins' }
      ];
    default:
      return [];
  }
}