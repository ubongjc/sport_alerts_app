import { Team, League, Match, MatchEvent } from "@shared/schema";

export interface TeamWithDetails {
  id: number;
  name: string;
  shortName: string;
  logo?: string;
  country?: string;
  tla?: string;
  crest?: string;
}

export interface LeagueWithDetails {
  id: number;
  name: string;
  country: string;
  code?: string;
  logo?: string;
}

export interface MatchWithDetails {
  id: number;
  date: Date | null;
  startTime: Date;
  status: string;
  currentMinute: number | null;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number;
  awayScore: number;
  sportId: number;
  leagueId: number;
  sportradarId?: string | null; // ID used to fetch detailed match stats from Sportradar
  
  // Extended details
  homeTeam: TeamWithDetails;
  awayTeam: TeamWithDetails;
  league: LeagueWithDetails;
  events: any[];
}
