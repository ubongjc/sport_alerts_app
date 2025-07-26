import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base user schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Teams schema
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  logo: text("logo").notNull(),
  country: text("country").notNull(),
  tla: text("tla"),
  crest: text("crest"),
});

export const insertTeamSchema = createInsertSchema(teams).pick({
  name: true,
  shortName: true,
  logo: true,
  country: true,
  tla: true,
  crest: true,
});

// Leagues schema
export const leagues = pgTable("leagues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  logo: text("logo"),
});

export const insertLeagueSchema = createInsertSchema(leagues).pick({
  name: true,
  country: true,
  logo: true,
});

// Match Events schema (goals, cards, etc.)
export const matchEvents = pgTable("match_events", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").notNull(),
  teamId: integer("team_id").notNull(),
  playerId: integer("player_id"),
  playerName: text("player_name").notNull(),
  eventType: text("event_type").notNull(), // goal, red_card, yellow_card
  minute: integer("minute").notNull(),
});

export const insertMatchEventSchema = createInsertSchema(matchEvents).pick({
  matchId: true,
  teamId: true,
  playerId: true,
  playerName: true,
  eventType: true,
  minute: true,
});

// Matches schema
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id").notNull(),
  homeTeamId: integer("home_team_id").notNull(),
  awayTeamId: integer("away_team_id").notNull(),
  homeScore: integer("home_score").default(0),
  awayScore: integer("away_score").default(0),
  status: text("status").notNull(), // upcoming, live, finished
  startTime: timestamp("start_time").notNull(),
  currentMinute: integer("current_minute"),
  date: timestamp("date"),
  sportId: integer("sport_id").default(1), // 1 = soccer, 2 = basketball, etc.
  sportradarId: text("sportradar_id"), // Sportradar match ID for detailed stats
});

export const insertMatchSchema = createInsertSchema(matches).pick({
  leagueId: true,
  homeTeamId: true,
  awayTeamId: true,
  homeScore: true,
  awayScore: true,
  status: true,
  startTime: true,
  currentMinute: true,
  date: true,
  sportId: true,
  sportradarId: true,
});

// Alert Preferences schema
export const alertPreferences = pgTable("alert_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  preferences: jsonb("preferences").notNull(),
});

export const alertPreferencesSchema = z.object({
  // Basic alerts - now sport-specific
  sportAlerts: z.record(z.string(), z.object({
    enabled: z.boolean().default(true),
    goalAlerts: z.boolean().default(false),
    redCardAlerts: z.boolean().default(false),
    yellowCardAlerts: z.boolean().default(false),
    
    // Goal difference alerts with thresholds
    goalDifferenceAlerts: z.object({
      enabled: z.boolean().default(false),
      threshold: z.number().min(1).max(10).default(2),
      targetTeam: z.enum(['any', 'home', 'away']).default('any'),
    }),
    
    // Time-based alerts
    halfTimeFullTimeAlerts: z.boolean().default(false),
    lateGameAlerts: z.object({
      enabled: z.boolean().default(false),
      startMinute: z.number().min(1).max(90).default(85),
    }),
    
    // Sport-specific leagues
    leagues: z.record(z.string(), z.boolean()).default({}),
  })).default({
    soccer: {
      enabled: true,
      goalAlerts: false,
      redCardAlerts: false,
      yellowCardAlerts: false,
      goalDifferenceAlerts: {
        enabled: false,
        threshold: 2,
        targetTeam: 'any',
      },
      halfTimeFullTimeAlerts: false,
      lateGameAlerts: {
        enabled: false,
        startMinute: 85,
      },
      leagues: {},
    }
  }),
  
  // Sports preferences - record of sport IDs to selection state
  sports: z.record(z.string(), z.boolean()).default({
    soccer: true,
    basketball: false,
    football: false,
    hockey: false,
    baseball: false,
    rugby: false,
    formula1: false
  }),
  
  // Global league preferences - using record to support dynamic league IDs
  leagues: z.record(z.string(), z.boolean()).default({}),
  
  // Fully customizable combined alerts
  customAlerts: z.array(z.object({
    id: z.string(),
    name: z.string(),
    enabled: z.boolean().default(false),
    conditions: z.array(z.object({
      eventType: z.string(),
      team: z.string(),
      threshold: z.number().min(1).default(1),
      comparison: z.string(),
    })),
    operator: z.string().default('AND'),
  })).default([
    {
      id: 'redCardAndGoals',
      name: 'Red Card + Multiple Goals',
      enabled: false,
      conditions: [
        {
          eventType: 'redCards',
          team: 'teamA',
          threshold: 1,
          comparison: 'greaterThan',
        },
        {
          eventType: 'goals',
          team: 'teamB',
          threshold: 2,
          comparison: 'greaterThan',
        }
      ],
      operator: 'AND'
    },
    {
      id: 'comeback',
      name: 'Comeback Alert',
      enabled: false,
      conditions: [
        {
          eventType: 'goals',
          team: 'teamA',
          threshold: 2,
          comparison: 'greaterThan',
        }
      ],
      operator: 'AND'
    }
  ]),
});

export const insertAlertPreferencesSchema = createInsertSchema(alertPreferences).extend({
  preferences: alertPreferencesSchema,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

export type InsertLeague = z.infer<typeof insertLeagueSchema>;
export type League = typeof leagues.$inferSelect;

export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;

export type InsertMatchEvent = z.infer<typeof insertMatchEventSchema>;
export type MatchEvent = typeof matchEvents.$inferSelect;

export type AlertPreferencesData = z.infer<typeof alertPreferencesSchema>;
export type InsertAlertPreferences = z.infer<typeof insertAlertPreferencesSchema>;
export type AlertPreferences = typeof alertPreferences.$inferSelect;
