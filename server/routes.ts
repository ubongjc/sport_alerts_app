import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer } from 'ws';
import { z } from "zod";
import { alertPreferencesSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Set up WebSocket server for live updates
  // Use a specific path to avoid conflicts with Vite's WebSocket
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: "/ws" 
  });
  
  wss.on('connection', (ws) => {
    console.log('Client connected to match updates WebSocket');
    
    ws.on('message', (message) => {
      console.log('Received message:', message.toString());
    });
    
    ws.on('close', () => {
      console.log('Client disconnected from match updates WebSocket');
    });
  });

  // Function to send updates to all connected clients
  const broadcastUpdate = (type: string, data: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(JSON.stringify({ type, data }));
      }
    });
  };

  // Schedule simulated match updates
  setupMatchSimulation(broadcastUpdate);

  // API Routes
  app.get('/api/matches/upcoming', async (req, res) => {
    try {
      // Import the football data service (for real upcoming matches)
      const { fetchUpcomingMatches } = await import('./footballDataService');
      
      try {
        // First try to get real upcoming matches from the Football Data API
        console.log('Fetching real upcoming matches from API...');
        const realMatches = await fetchUpcomingMatches();
        
        if (realMatches && realMatches.length > 0) {
          console.log(`Successfully fetched ${realMatches.length} real upcoming matches`);
          return res.json(realMatches);
        }
        
        console.log('No real matches found, falling back to generated matches');
      } catch (error) {
        console.error('Error fetching real matches:', error);
        console.log('Falling back to generated matches');
      }
      
      // Fallback: Get sample upcoming matches from our DB
      const matches = await storage.getUpcomingMatches();
      
      // Each match has details fields
      res.json(matches);
    } catch (error) {
      console.error('Error fetching upcoming matches:', error);
      res.status(500).json({ message: 'Failed to fetch upcoming matches' });
    }
  });

  app.get('/api/matches/live', async (req, res) => {
    try {
      const matches = await storage.getLiveMatches();
      res.json(matches);
    } catch (error) {
      console.error('Error fetching live matches:', error);
      res.status(500).json({ message: 'Failed to fetch live matches' });
    }
  });

  app.get('/api/matches/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid match ID' });
      }
      
      const match = await storage.getMatch(id);
      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      }
      
      // Get additional match details
      const homeTeam = await storage.getTeam(match.homeTeamId);
      const awayTeam = await storage.getTeam(match.awayTeamId);
      const league = await storage.getLeague(match.leagueId);
      const events = await storage.getMatchEvents(match.id);
      
      res.json({
        ...match,
        homeTeam,
        awayTeam,
        league,
        events,
      });
    } catch (error) {
      console.error('Error fetching match:', error);
      res.status(500).json({ message: 'Failed to fetch match details' });
    }
  });

  // Get real-time match data from Football Data API
  app.get('/api/football-data/live-matches', async (req, res) => {
    try {
      // First try to get all matches across all competitions (more comprehensive)
      console.log('Fetching all live matches from Football Data API...');
      const apiBase = process.env.FOOTBALL_DATA_API_URL || 'https://api.football-data.org/v4';
      const apiKey = process.env.FOOTBALL_DATA_API_KEY;
      
      if (!apiKey) {
        console.log('No Football Data API key found, using direct endpoint...');
        console.log('Trying direct call to Football Data API...');
        
        // Make the request without an API key - will be limited but can still work
        const response = await fetch(`${apiBase}/competitions/PPL/matches?status=LIVE`);
        
        if (!response.ok) {
          // If the first endpoint fails, try Premier League as a fallback
          console.log('First endpoint failed, trying Premier League live matches...');
          const plResponse = await fetch(`${apiBase}/competitions/PL/matches?status=LIVE`);
          
          if (!plResponse.ok) {
            return res.status(plResponse.status).json({ 
              message: 'Error fetching live matches from Football Data API (tried multiple endpoints)' 
            });
          }
          
          const plData = await plResponse.json();
          const mappedData = { matches: plData.matches || [] };
          
          console.log(`Found ${mappedData.matches.length} live Premier League matches`);
          return res.json(mappedData);
        }
        
        return res.status(response.status).json({ 
          message: 'Error fetching live matches from Football Data API' 
        });
      }
      
      const data = await response.json();
      
      // Log the total number of matches found
      if (data && data.matches) {
        console.log(`Found ${data.matches.length} total live matches across all competitions`);
        
        // Log the different competitions
        const competitions = new Set();
        data.matches.forEach(match => {
          if (match.competition && match.competition.name) {
            competitions.add(match.competition.name);
          }
        });
        
        if (competitions.size > 0) {
          console.log(`Live matches found in: ${Array.from(competitions).join(', ')}`);
        }
      }
      
      res.json(data);
    } catch (error) {
      console.error('Error fetching live matches from Football Data API:', error);
      res.status(500).json({ 
        message: 'Failed to fetch live matches from external API',
        error: error.message 
      });
    }
  });

  // Get alert preferences for the current user
  app.get('/api/alert-preferences', async (req, res) => {
    try {
      // In a real app, we would get the user ID from the session
      const userId = 1; // Default user for demo
      const preferences = await storage.getAlertPreferences(userId);
      
      if (!preferences) {
        return res.status(404).json({ message: 'Alert preferences not found' });
      }
      
      res.json({ preferences: preferences.preferences });
    } catch (error) {
      console.error('Error fetching alert preferences:', error);
      res.status(500).json({ message: 'Failed to fetch alert preferences' });
    }
  });

  // Save alert preferences for the current user
  app.post('/api/alert-preferences', async (req, res) => {
    try {
      // Validate the request body
      const result = alertPreferencesSchema.safeParse(req.body);
      
      if (!result.success) {
        console.error('Invalid alert preferences:', result.error);
        return res.status(400).json({ message: 'Invalid alert preferences', errors: result.error.format() });
      }
      
      // In a real app, we would get the user ID from the session
      const userId = 1; // Default user for demo
      const existingPrefs = await storage.getAlertPreferences(userId);
      
      let preferences;
      if (existingPrefs) {
        console.log('Updating existing preferences for user', userId);
        preferences = await storage.updateAlertPreferences(existingPrefs.id, result.data);
      } else {
        console.log('Creating new preferences for user', userId);
        preferences = await storage.createAlertPreferences({
          userId,
          preferences: result.data,
        });
      }
      
      console.log('Alert preferences saved:', preferences);
      res.json(preferences);
    } catch (error) {
      console.error('Error saving alert preferences:', error);
      res.status(500).json({ message: 'Failed to update alert preferences' });
    }
  });

  return httpServer;
}

// Function to simulate match updates
function setupMatchSimulation(broadcastUpdate: (type: string, data: any) => void) {
  const simulateMatchUpdates = async () => {
    try {
      // Get current live matches
      const liveMatches = await storage.getLiveMatches();
      
      // No need to simulate if no live matches
      if (liveMatches.length === 0) return;
      
      // Choose a random match to update
      const matchToUpdate = liveMatches[Math.floor(Math.random() * liveMatches.length)];
      
      // Clone the match for updates
      const updatedMatch = { ...matchToUpdate };
      
      // Decide what kind of update to simulate
      const updateType = Math.floor(Math.random() * 10);
      
      if (updateType < 2) {
        // Goal scored (20% chance)
        const scoringTeam = Math.random() > 0.5 ? 'home' : 'away';
        
        if (scoringTeam === 'home') {
          updatedMatch.homeScore = updatedMatch.homeScore + 1;
          
          // Create event
          await storage.createMatchEvent({
            matchId: updatedMatch.id,
            teamId: updatedMatch.homeTeamId,
            playerName: `Player ${Math.floor(Math.random() * 11) + 1}`,
            eventType: 'goal',
            minute: updatedMatch.currentMinute,
          });
        } else {
          updatedMatch.awayScore = updatedMatch.awayScore + 1;
          
          // Create event
          await storage.createMatchEvent({
            matchId: updatedMatch.id,
            teamId: updatedMatch.awayTeamId,
            playerName: `Player ${Math.floor(Math.random() * 11) + 1}`,
            eventType: 'goal',
            minute: updatedMatch.currentMinute,
          });
        }
        
        // Update match score
        await storage.updateMatchScore(
          updatedMatch.id, 
          updatedMatch.homeScore, 
          updatedMatch.awayScore
        );
        
        console.log(`Simulated goal for ${scoringTeam} team in match ${updatedMatch.id}`);
      } else if (updateType < 3) {
        // Card given (10% chance)
        const cardTeam = Math.random() > 0.5 ? 'home' : 'away';
        const cardType = Math.random() > 0.7 ? 'red_card' : 'yellow_card';
        
        // Create event
        await storage.createMatchEvent({
          matchId: updatedMatch.id,
          teamId: cardTeam === 'home' ? updatedMatch.homeTeamId : updatedMatch.awayTeamId,
          playerName: `Player ${Math.floor(Math.random() * 11) + 1}`,
          eventType: cardType,
          minute: updatedMatch.currentMinute,
        });
        
        console.log(`Simulated ${cardType} for ${cardTeam} team in match ${updatedMatch.id}`);
      }
      
      // Advance match time (always happens)
      if (updatedMatch.currentMinute < 90) {
        updatedMatch.currentMinute += 1;
        
        // Update match minute
        await storage.updateMatchStatus(
          updatedMatch.id,
          updatedMatch.status,
          updatedMatch.currentMinute
        );
      } else {
        // Match ended
        updatedMatch.status = 'finished';
        
        // Update match status
        await storage.updateMatchStatus(
          updatedMatch.id,
          updatedMatch.status,
          updatedMatch.currentMinute
        );
      }
      
      // Get updated match with all details for broadcast
      const matchDetails = await storage.getMatch(updatedMatch.id);
      const homeTeam = await storage.getTeam(matchDetails.homeTeamId);
      const awayTeam = await storage.getTeam(matchDetails.awayTeamId);
      const league = await storage.getLeague(matchDetails.leagueId);
      const events = await storage.getMatchEvents(matchDetails.id);
      
      const matchWithDetails = {
        ...matchDetails,
        homeTeam,
        awayTeam,
        league,
        events,
      };
      
      // Broadcast update
      broadcastUpdate('match_update', matchWithDetails);
    } catch (error) {
      console.error('Error in match simulation:', error);
    }
  };
  
  // Simulate updates every 10 seconds
  setInterval(async () => {
    try {
      await simulateMatchUpdates();
    } catch (error) {
      console.error('Error in match simulation:', error);
    }
  }, 10000); // Update every 10 seconds
}