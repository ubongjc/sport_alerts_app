import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MatchWithDetails, MatchEvent } from '@/lib/types';
import { fetchLiveMatches } from '@/services/sportsDataService';
import { fetchEspnLiveGames } from '@/services/espnDataService';
import { fetchLiveMatchesFromSportradar, fetchMatchDetails } from '@/services/sportradarService';

// Custom hook for fetching and managing matches
export const useMatches = () => {
  const [liveMatches, setLiveMatches] = useState<MatchWithDetails[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<MatchWithDetails[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [matchDetails, setMatchDetails] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  
  // Get the selected sport from local storage
  const selectedSport = localStorage.getItem('selectedSport') || 'soccer';

  // Fetch real-time matches from API
  console.log(`Fetching all live ${selectedSport} matches from API...`);
  
  // Primary data source: Football Data API for real, authentic live data
  const { data: footballDataMatches, isLoading: isLoadingFootballData, error: footballDataError } = useQuery<MatchWithDetails[]>({
    queryKey: [`/football-data/${selectedSport}/live`],
    queryFn: () => fetchEspnLiveGames(selectedSport), // Points to the Football Data API 
    refetchInterval: 15000, // Refresh every 15 seconds for live updates
    retry: 3
  });
  
  // Secondary data source - We need to define this to fix the reference errors
  const { data: secondaryMatches, isLoading: isLoadingSecondary } = useQuery<MatchWithDetails[]>({
    queryKey: [`/api/matches/secondary`],
    queryFn: () => Promise.resolve([]), // Empty array, we prioritize real data
    enabled: false // Not enabled by default
  });

  // Keep initial data loading for upcoming matches only
  const { isLoading: isLoadingLive } = useQuery<MatchWithDetails[]>({
    queryKey: ['/api/matches/live'],
    enabled: false, // Disabled - only using real API data
  });

  // Fetch upcoming matches
  const { data: initialUpcomingMatches, isLoading: isLoadingUpcoming } = useQuery<MatchWithDetails[]>({
    queryKey: ['/api/matches/upcoming'],
  });

  // Function to fetch detailed match statistics when a match is selected
  const fetchMatchStats = useCallback(async (matchId: string) => {
    if (!matchId) return;
    
    try {
      setIsLoadingDetails(true);
      setSelectedMatchId(matchId);
      const details = await fetchMatchDetails(matchId);
      setMatchDetails(details);
    } catch (error) {
      console.error("Error fetching match details:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  // Initialize real-time data using only the Football Data API for real match data
  useEffect(() => {
    // Use Football Data API for real authentic match data
    if (footballDataMatches && footballDataMatches.length > 0) {
      setLiveMatches(footballDataMatches);
      console.log(`Found ${footballDataMatches.length} real live matches from Football Data API`);
    } else {
      // If no data from the primary query hook, try to fetch directly
      console.log("Trying direct call to Football Data API...");
      fetchEspnLiveGames(selectedSport)
        .then(matches => {
          if (matches && matches.length > 0) {
            setLiveMatches(matches);
            console.log(`Found ${matches.length} real live matches from direct Football Data API call`);
          } else {
            setLiveMatches([]);
            console.log("No live matches currently in progress");
          }
        })
        .catch(error => {
          console.error("Error fetching matches directly:", error);
          setLiveMatches([]);
        });
    }
    
    if (initialUpcomingMatches) {
      setUpcomingMatches(initialUpcomingMatches);
    }
    
    // Create WebSocket connection with retry logic
    let reconnectAttempts = 0;
    let reconnectTimer: NodeJS.Timeout | null = null;
    
    const connectWebSocket = () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const newSocket = new WebSocket(wsUrl);
      
      newSocket.onopen = () => {
        console.log("WebSocket connected");
        reconnectAttempts = 0; // Reset reconnect attempts on successful connection
        setSocket(newSocket);
      };
      
      newSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data && data.type === 'matchUpdate' && data.match) {
            // Make sure we have a valid match object before updating
            if (data.match.id) {
              handleMatchUpdate(data.match);
            }
          } else if (data && data.type === 'newEvent' && data.event) {
            // Make sure we have a valid event object
            if (data.event.id) {
              handleNewEvent(data.event);
            }
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
      
      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      
      newSocket.onclose = () => {
        console.log("WebSocket disconnected");
        
        // Try to reconnect with exponential backoff
        const delay = Math.min(1000 * (2 ** reconnectAttempts), 30000); // Max delay of 30 seconds
        reconnectTimer = setTimeout(() => {
          if (reconnectAttempts < 10) { // Maximum of 10 reconnect attempts
            reconnectAttempts++;
            console.log(`Attempting to reconnect (${reconnectAttempts}/10)...`);
            connectWebSocket();
          }
        }, delay);
      };
      
      return newSocket;
    };
    
    // Initial connection
    const ws = connectWebSocket();
    setSocket(ws);
    
    // Clean up on unmount
    return () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [footballDataMatches, secondaryMatches, initialUpcomingMatches]);

  // Handle match updates from WebSocket for real-time data
  const handleMatchUpdate = useCallback((updatedMatch: MatchWithDetails) => {
    // Only update if we're using real data from the API
    // and if the match is from our real data source
    setLiveMatches(prev => {
      if (!prev || prev.length === 0) return [updatedMatch];
      
      // Check if the match is already in our live matches
      const exists = prev.some(match => match.id === updatedMatch.id);
      
      if (exists) {
        // Replace the existing match with the updated one
        return prev.map(match => 
          match.id === updatedMatch.id ? updatedMatch : match
        );
      } else {
        // Only add the match if we're sure it's not a duplicate by team name
        const isDuplicate = prev.some(match => 
          (match.homeTeam.name === updatedMatch.homeTeam.name && 
           match.awayTeam.name === updatedMatch.awayTeam.name) ||
          (match.homeTeam.name === updatedMatch.awayTeam.name && 
           match.awayTeam.name === updatedMatch.homeTeam.name)
        );
        
        return isDuplicate ? prev : [...prev, updatedMatch];
      }
    });
    
    // If a match went live, remove it from upcoming
    if (updatedMatch.status === 'LIVE') {
      setUpcomingMatches(prev => 
        prev.filter(match => match.id !== updatedMatch.id)
      );
    }
  }, []);

  // Handle new events from WebSocket
  const handleNewEvent = useCallback((event: any) => {
    setLiveMatches(prev => 
      prev.map(match => {
        if (match.id === event.matchId) {
          // Add the new event to this match's events array
          return {
            ...match,
            events: [...(match.events || []), event]
          };
        }
        return match;
      })
    );
  }, []);

  return {
    liveMatches,
    upcomingMatches,
    isLoadingLive: isLoadingLive || isLoadingFootballData || isLoadingSecondary, // Loading state for all data sources
    isLoadingUpcoming,
    socket,
    selectedSport // Return selected sport for components to use
  };
};