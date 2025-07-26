import {
  type User,
  type InsertUser,
  type Team,
  type InsertTeam,
  type League,
  type InsertLeague,
  type Match,
  type InsertMatch,
  type MatchEvent,
  type InsertMatchEvent,
  type AlertPreferences,
  type InsertAlertPreferences,
  type AlertPreferencesData,
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Team operations
  getTeam(id: number): Promise<Team | undefined>;
  getTeams(): Promise<Team[]>;
  createTeam(team: InsertTeam): Promise<Team>;

  // League operations
  getLeague(id: number): Promise<League | undefined>;
  getLeagues(): Promise<League[]>;
  createLeague(league: InsertLeague): Promise<League>;

  // Match operations
  getMatch(id: number): Promise<Match | undefined>;
  getMatchesWithDetails(): Promise<any[]>;
  getUpcomingMatches(): Promise<any[]>;
  getLiveMatches(): Promise<any[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatchScore(id: number, homeScore: number, awayScore: number): Promise<Match | undefined>;
  updateMatchStatus(id: number, status: string, currentMinute?: number): Promise<Match | undefined>;

  // Match event operations
  getMatchEvents(matchId: number): Promise<MatchEvent[]>;
  createMatchEvent(event: InsertMatchEvent): Promise<MatchEvent>;

  // Alert preferences operations
  getAlertPreferences(userId: number): Promise<AlertPreferences | undefined>;
  createAlertPreferences(prefs: InsertAlertPreferences): Promise<AlertPreferences>;
  updateAlertPreferences(id: number, preferences: AlertPreferencesData): Promise<AlertPreferences | undefined>;
}

// Simple in-memory storage with persistence
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private teams: Map<number, Team>;
  private leagues: Map<number, League>;
  private matches: Map<number, Match>;
  private matchEvents: Map<number, MatchEvent>;
  private alertPreferences: Map<number, AlertPreferences>;
  
  private currentUserId: number;
  private currentTeamId: number;
  private currentLeagueId: number;
  private currentMatchId: number;
  private currentEventId: number;
  private currentPreferenceId: number;

  constructor() {
    this.users = new Map();
    this.teams = new Map();
    this.leagues = new Map();
    this.matches = new Map();
    this.matchEvents = new Map();
    this.alertPreferences = new Map();
    
    this.currentUserId = 1;
    this.currentTeamId = 1;
    this.currentLeagueId = 1;
    this.currentMatchId = 1;
    this.currentEventId = 1;
    this.currentPreferenceId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Team operations
  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async getTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const id = this.currentTeamId++;
    const team: Team = { 
      ...insertTeam, 
      id,
      tla: insertTeam.tla || null,
      crest: insertTeam.crest || null 
    };
    this.teams.set(id, team);
    return team;
  }

  // League operations
  async getLeague(id: number): Promise<League | undefined> {
    return this.leagues.get(id);
  }

  async getLeagues(): Promise<League[]> {
    return Array.from(this.leagues.values());
  }

  async createLeague(insertLeague: InsertLeague): Promise<League> {
    const id = this.currentLeagueId++;
    const league: League = { 
      ...insertLeague, 
      id,
      logo: insertLeague.logo || null 
    };
    this.leagues.set(id, league);
    return league;
  }

  // Match operations
  async getMatch(id: number): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async getMatchesWithDetails(): Promise<any[]> {
    const allMatches = Array.from(this.matches.values());
    return Promise.all(
      allMatches.map(async (match) => {
        const homeTeam = await this.getTeam(match.homeTeamId);
        const awayTeam = await this.getTeam(match.awayTeamId);
        const league = await this.getLeague(match.leagueId);
        const events = await this.getMatchEvents(match.id);
        
        return {
          ...match,
          homeTeam,
          awayTeam,
          league,
          events,
        };
      })
    );
  }

  async getUpcomingMatches(): Promise<any[]> {
    const matches = await this.getMatchesWithDetails();
    const upcomingMatches = matches.filter(match => match.status === 'upcoming')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
    // If we don't have any upcoming matches, generate some sample ones
    if (upcomingMatches.length === 0) {
      const teams = Array.from(this.teams.values());
      const leagues = Array.from(this.leagues.values());
      
      if (teams.length >= 8 && leagues.length > 0) {
        const now = new Date();
        
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(19, 30, 0, 0);
        
        const dayAfter = new Date();
        dayAfter.setDate(now.getDate() + 2);
        dayAfter.setHours(20, 0, 0, 0);
        
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);
        nextWeek.setHours(18, 0, 0, 0);
        
        return [
          {
            id: 901,
            leagueId: leagues[0].id,
            homeTeamId: teams[0].id,
            awayTeamId: teams[1].id,
            homeScore: 0,
            awayScore: 0,
            status: 'upcoming',
            startTime: tomorrow,
            date: tomorrow,
            currentMinute: null,
            sportId: 1,
            sportradarId: null,
            homeTeam: teams[0],
            awayTeam: teams[1],
            league: leagues[0],
            events: []
          },
          {
            id: 902,
            leagueId: leagues[0].id,
            homeTeamId: teams[2].id,
            awayTeamId: teams[3].id,
            homeScore: 0,
            awayScore: 0,
            status: 'upcoming',
            startTime: dayAfter,
            date: dayAfter,
            currentMinute: null,
            sportId: 1,
            sportradarId: null,
            homeTeam: teams[2],
            awayTeam: teams[3],
            league: leagues[0],
            events: []
          },
          {
            id: 903,
            leagueId: leagues[1 % leagues.length].id,
            homeTeamId: teams[4].id,
            awayTeamId: teams[5].id,
            homeScore: 0,
            awayScore: 0,
            status: 'upcoming',
            startTime: nextWeek,
            date: nextWeek,
            currentMinute: null,
            sportId: 1,
            sportradarId: null,
            homeTeam: teams[4],
            awayTeam: teams[5],
            league: leagues[1 % leagues.length],
            events: []
          }
        ];
      }
    }
    
    return upcomingMatches;
  }

  async getLiveMatches(): Promise<any[]> {
    const matches = await this.getMatchesWithDetails();
    return matches.filter(match => match.status === 'live')
      .sort((a, b) => (b.currentMinute || 0) - (a.currentMinute || 0));
  }

  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const id = this.currentMatchId++;
    const match: Match = { 
      ...insertMatch, 
      id,
      homeScore: insertMatch.homeScore ?? 0,
      awayScore: insertMatch.awayScore ?? 0,
      currentMinute: insertMatch.currentMinute ?? null,
      date: insertMatch.date ?? null,
      sportId: insertMatch.sportId ?? 1,
      sportradarId: insertMatch.sportradarId ?? null,
    };
    this.matches.set(id, match);
    return match;
  }

  async updateMatchScore(id: number, homeScore: number, awayScore: number): Promise<Match | undefined> {
    const match = this.matches.get(id);
    if (!match) return undefined;
    
    const updatedMatch = { ...match, homeScore, awayScore };
    this.matches.set(id, updatedMatch);
    return updatedMatch;
  }

  async updateMatchStatus(id: number, status: string, currentMinute?: number): Promise<Match | undefined> {
    const match = this.matches.get(id);
    if (!match) return undefined;
    
    const updatedMatch = { 
      ...match, 
      status, 
      currentMinute: currentMinute ?? null 
    };
    this.matches.set(id, updatedMatch);
    return updatedMatch;
  }

  // Match event operations
  async getMatchEvents(matchId: number): Promise<MatchEvent[]> {
    return Array.from(this.matchEvents.values())
      .filter(event => event.matchId === matchId)
      .sort((a, b) => a.minute - b.minute);
  }

  async createMatchEvent(insertEvent: InsertMatchEvent): Promise<MatchEvent> {
    const id = this.currentEventId++;
    const event: MatchEvent = { 
      ...insertEvent, 
      id,
      playerId: insertEvent.playerId ?? null
    };
    this.matchEvents.set(id, event);
    return event;
  }

  // Alert preferences operations
  async getAlertPreferences(userId: number): Promise<AlertPreferences | undefined> {
    return Array.from(this.alertPreferences.values()).find(
      (pref) => pref.userId === userId
    );
  }

  async createAlertPreferences(insertPrefs: InsertAlertPreferences): Promise<AlertPreferences> {
    const id = this.currentPreferenceId++;
    const prefs: AlertPreferences = { ...insertPrefs, id };
    this.alertPreferences.set(id, prefs);
    console.log('Created alert preferences:', prefs);
    return prefs;
  }

  async updateAlertPreferences(id: number, preferences: AlertPreferencesData): Promise<AlertPreferences | undefined> {
    const prefs = this.alertPreferences.get(id);
    if (!prefs) return undefined;
    
    const updatedPrefs = { ...prefs, preferences };
    this.alertPreferences.set(id, updatedPrefs);
    console.log('Updated alert preferences:', updatedPrefs);
    return updatedPrefs;
  }

  // Initialize sample data
  private async initializeSampleData() {
    console.log('Initializing sample data...');
    
    // Create leagues
    const premierLeague = await this.createLeague({
      name: "Premier League",
      country: "England",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo.svg/1200px-Premier_League_Logo.svg.png",
    });

    const laLiga = await this.createLeague({
      name: "La Liga",
      country: "Spain",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/LaLiga.svg/1200px-LaLiga.svg.png",
    });

    const serieA = await this.createLeague({
      name: "Serie A",
      country: "Italy",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Serie_A_logo_%282019%29.svg/1200px-Serie_A_logo_%282019%29.svg.png",
    });

    const faCup = await this.createLeague({
      name: "FA Cup",
      country: "England",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/FA_Cup.svg/1200px-FA_Cup.svg.png",
    });

    // Create teams
    const manUtd = await this.createTeam({
      name: "Manchester United",
      shortName: "Man United",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/800px-Manchester_United_FC_crest.svg.png",
      country: "England",
      tla: "MUN",
      crest: null,
    });

    const chelsea = await this.createTeam({
      name: "Chelsea",
      shortName: "Chelsea",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/800px-Chelsea_FC.svg.png",
      country: "England",
      tla: "CHE",
      crest: null,
    });

    const barcelona = await this.createTeam({
      name: "FC Barcelona",
      shortName: "Barcelona",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/800px-FC_Barcelona_%28crest%29.svg.png",
      country: "Spain",
      tla: "FCB",
      crest: null,
    });

    const realMadrid = await this.createTeam({
      name: "Real Madrid",
      shortName: "Real Madrid",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/800px-Real_Madrid_CF.svg.png",
      country: "Spain",
      tla: "RMA",
      crest: null,
    });

    const juventus = await this.createTeam({
      name: "Juventus",
      shortName: "Juventus",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juventus_FC_2017_icon_%28black%29.svg/800px-Juventus_FC_2017_icon_%28black%29.svg.png",
      country: "Italy",
      tla: "JUV",
      crest: null,
    });

    const acMilan = await this.createTeam({
      name: "AC Milan",
      shortName: "AC Milan",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/AC_Milan_logo.svg/800px-AC_Milan_logo.svg.png",
      country: "Italy",
      tla: "MIL",
      crest: null,
    });

    const liverpool = await this.createTeam({
      name: "Liverpool",
      shortName: "Liverpool",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/800px-Liverpool_FC.svg.png",
      country: "England",
      tla: "LIV",
      crest: null,
    });

    const arsenal = await this.createTeam({
      name: "Arsenal",
      shortName: "Arsenal",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/800px-Arsenal_FC.svg.png",
      country: "England",
      tla: "ARS",
      crest: null,
    });

    // Create live matches
    const now = new Date();
    
    const match1 = await this.createMatch({
      leagueId: premierLeague.id,
      homeTeamId: manUtd.id,
      awayTeamId: chelsea.id,
      homeScore: 2,
      awayScore: 0,
      status: "live",
      startTime: new Date(now.getTime() - 62 * 60000),
      currentMinute: 62,
      date: now,
      sportId: 1,
      sportradarId: null,
    });

    await this.createMatchEvent({
      matchId: match1.id,
      teamId: manUtd.id,
      playerId: null,
      playerName: "Bruno Fernandes",
      eventType: "goal",
      minute: 23,
    });

    await this.createMatchEvent({
      matchId: match1.id,
      teamId: manUtd.id,
      playerId: null,
      playerName: "Bruno Fernandes",
      eventType: "goal",
      minute: 54,
    });

    const match2 = await this.createMatch({
      leagueId: laLiga.id,
      homeTeamId: barcelona.id,
      awayTeamId: realMadrid.id,
      homeScore: 1,
      awayScore: 1,
      status: "live",
      startTime: new Date(now.getTime() - 75 * 60000),
      currentMinute: 75,
      date: now,
      sportId: 1,
      sportradarId: null,
    });

    await this.createMatchEvent({
      matchId: match2.id,
      teamId: barcelona.id,
      playerId: null,
      playerName: "Lewandowski",
      eventType: "goal",
      minute: 32,
    });

    await this.createMatchEvent({
      matchId: match2.id,
      teamId: realMadrid.id,
      playerId: null,
      playerName: "Vinicius Jr",
      eventType: "goal",
      minute: 67,
    });

    await this.createMatchEvent({
      matchId: match2.id,
      teamId: barcelona.id,
      playerId: null,
      playerName: "Gavi",
      eventType: "red_card",
      minute: 58,
    });

    const match3 = await this.createMatch({
      leagueId: serieA.id,
      homeTeamId: juventus.id,
      awayTeamId: acMilan.id,
      homeScore: 0,
      awayScore: 0,
      status: "live",
      startTime: new Date(now.getTime() - 34 * 60000),
      currentMinute: 34,
      date: now,
      sportId: 1,
      sportradarId: null,
    });

    await this.createMatch({
      leagueId: premierLeague.id,
      homeTeamId: liverpool.id,
      awayTeamId: arsenal.id,
      homeScore: 0,
      awayScore: 0,
      status: "upcoming",
      startTime: new Date(now.getTime() + 3 * 60 * 60000),
      date: now,
      sportId: 1,
      sportradarId: null,
      currentMinute: null,
    });

    // Create some FA Cup matches
    const faCupMatch1 = await this.createMatch({
      leagueId: faCup.id,
      homeTeamId: liverpool.id,
      awayTeamId: chelsea.id,
      homeScore: 1,
      awayScore: 1,
      status: "live",
      startTime: new Date(now.getTime() - 45 * 60000),
      currentMinute: 45,
      date: now,
      sportId: 1,
      sportradarId: null,
    });

    await this.createMatchEvent({
      matchId: faCupMatch1.id,
      teamId: liverpool.id,
      playerId: null,
      playerName: "Mohamed Salah",
      eventType: "goal",
      minute: 28,
    });

    await this.createMatchEvent({
      matchId: faCupMatch1.id,
      teamId: chelsea.id,
      playerId: null,
      playerName: "Raheem Sterling",
      eventType: "goal",
      minute: 41,
    });

    const faCupMatch2 = await this.createMatch({
      leagueId: faCup.id,
      homeTeamId: arsenal.id,
      awayTeamId: manUtd.id,
      homeScore: 0,
      awayScore: 0,
      status: "upcoming",
      startTime: new Date(now.getTime() + 2 * 60 * 60000),
      date: now,
      sportId: 1,
      sportradarId: null,
      currentMinute: null,
    });
    
    // Default user and alert preferences
    const defaultUser = await this.createUser({
      username: "defaultuser",
      password: "password123",
    });
    
    await this.createAlertPreferences({
      userId: defaultUser.id,
      preferences: {
        sportAlerts: {
          soccer: {
            enabled: true,
            goalAlerts: true,
            redCardAlerts: true,
            yellowCardAlerts: false,
            goalDifferenceAlerts: {
              enabled: true,
              threshold: 2,
              targetTeam: 'any',
            },
            halfTimeFullTimeAlerts: false,
            lateGameAlerts: {
              enabled: false,
              startMinute: 85,
            },
            leagues: {
              "Premier League": true,
              "La Liga": true,
              "Serie A": true,
            },
          }
        },
        sports: {
          soccer: true,
          basketball: false,
          football: false,
          hockey: false,
          baseball: false,
          rugby: false,
          formula1: false
        },
        leagues: {
          "Premier League": true,
          "La Liga": true,
          "Serie A": true,
        },
        customAlerts: []
      }
    });
    
    console.log('Sample data initialization complete');
  }
}

export const storage = new MemStorage();