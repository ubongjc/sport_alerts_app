import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Bell } from "lucide-react";
import { AlertPreferencesData } from "@shared/schema";
import { useAlertPreferences } from "@/hooks/useAlerts";
import { useToast } from "@/hooks/use-toast";
import { getSportDisplayName, getSportAlertOptions, ALL_SPORTS_IN_ORDER } from "@/data/sportLeagues";

// Helper function to get sport-appropriate default event type
const getDefaultEventTypeForSport = (sport: string) => {
  switch(sport) {
    case 'soccer':
      return 'goals';
    case 'basketball':
      return 'points';
    case 'baseball':
      return 'homeRuns';
    case 'football':
      return 'touchdowns';
    case 'hockey':
      return 'goals';
    case 'rugby':
      return 'tries';
    case 'formula1':
      return 'overtakes';
    case 'tennis':
      return 'aces';
    case 'cricket':
      return 'wickets';
    case 'golf':
      return 'birdies';
    case 'boxing':
      return 'knockouts';
    case 'tabletennis':
      return 'points';
    case 'volleyball':
      return 'spikes';
    case 'handball':
      return 'goals';
    case 'mma':
      return 'knockouts';
    case 'nascar':
      return 'overtakes';
    case 'darts':
      return 'bullseyes';
    case 'lacrosse':
      return 'goals';
    case 'esports':
      return 'kills';
    default:
      return 'goals';
  }
};
import { SportNavigation } from "@/components/SportNavigation";
import { getMultiSportState, saveMultiSportState, getNextFlowStep } from "@/utils/multiSportFlow";

interface AlertOption {
  id: string;
  label: string;
  description: string;
  thresholdLabel?: string;
}

interface AlertCondition {
  eventType: string;
  team: string;
  threshold: number;
  comparison: string;
}

interface CustomAlert {
  id: string;
  name: string;
  enabled: boolean;
  conditions: AlertCondition[];
  operator: string;
}

// Function to get sport-specific alerts
const getSportAlerts = (sportId: string): AlertOption[] => {
  switch(sportId) {
    case "soccer":
      return [
        {
          id: "goals",
          label: "Goals",
          description: "Get notified when goals are scored",
        },
        {
          id: "redCards",
          label: "Red Cards",
          description: "Get notified when red cards are issued",
        },
        {
          id: "yellowCards",
          label: "Yellow Cards",
          description: "Get notified when yellow cards are issued",
        },
        {
          id: "goalDifference",
          label: "Goal Difference",
          description: "Get notified when a team takes a lead by a specific number of goals",
          thresholdLabel: "Minimum goal difference",
        },
        {
          id: "freekicks",
          label: "Free Kicks",
          description: "Get notified for dangerous free kicks",
        },
        {
          id: "penalties",
          label: "Penalties",
          description: "Get notified when penalties are awarded",
        },
        {
          id: "corners",
          label: "Corner Kicks",
          description: "Get notified when corner kicks exceed a threshold",
          thresholdLabel: "Minimum corners"
        },
        {
          id: "offsides",
          label: "Offsides",
          description: "Get notified when offsides are called",
        },
        {
          id: "halftime",
          label: "Half-time/Full-time",
          description: "Get notified at half-time and full-time",
        }
      ];
    case "basketball":
      return [
        {
          id: "points",
          label: "Points Scored",
          description: "Get notified for big scoring plays",
        },
        {
          id: "threePointers",
          label: "Three Pointers",
          description: "Get notified for three point shots",
        },
        {
          id: "pointDifference",
          label: "Point Difference",
          description: "Get notified when a team takes a significant lead",
          thresholdLabel: "Minimum point difference",
        },
        {
          id: "quarterEnd",
          label: "Quarter End",
          description: "Get notified at the end of each quarter",
        },
        {
          id: "overtime",
          label: "Overtime",
          description: "Get notified when a game goes to overtime",
        },
        {
          id: "fouls",
          label: "Fouls",
          description: "Get notified when players commit fouls",
        }
      ];
    case "football":
      return [
        {
          id: "touchdown",
          label: "Touchdowns",
          description: "Get notified when touchdowns are scored",
        },
        {
          id: "fieldGoal",
          label: "Field Goals",
          description: "Get notified for field goal attempts",
        },
        {
          id: "interception",
          label: "Interceptions",
          description: "Get notified for interceptions",
        },
        {
          id: "fumble",
          label: "Fumbles",
          description: "Get notified for fumbles",
        },
        {
          id: "quarterEnd",
          label: "Quarter End",
          description: "Get notified at the end of each quarter",
        },
        {
          id: "pointDifference",
          label: "Point Difference",
          description: "Get notified when a team takes a significant lead",
          thresholdLabel: "Minimum point difference",
        }
      ];
    case "baseball":
      return [
        {
          id: "homeRun",
          label: "Home Runs",
          description: "Get notified for home runs",
        },
        {
          id: "runScored",
          label: "Runs",
          description: "Get notified when runs are scored",
        },
        {
          id: "inningEnd",
          label: "Inning End",
          description: "Get notified at the end of each inning",
        },
        {
          id: "strikeout",
          label: "Strikeouts",
          description: "Get notified for strikeouts",
        },
        {
          id: "bases",
          label: "Bases Loaded",
          description: "Get notified when bases are loaded",
        },
        {
          id: "runDifference",
          label: "Run Difference",
          description: "Get notified when a team takes a significant lead",
          thresholdLabel: "Minimum run difference",
        }
      ];
    case "hockey":
      return [
        {
          id: "goals",
          label: "Goals",
          description: "Get notified when goals are scored",
        },
        {
          id: "penalties",
          label: "Penalties",
          description: "Get notified when penalties are called",
        },
        {
          id: "powerPlay",
          label: "Power Plays",
          description: "Get notified for power play opportunities",
        },
        {
          id: "fights",
          label: "Fights",
          description: "Get notified when players fight",
        },
        {
          id: "periodEnd",
          label: "Period End",
          description: "Get notified at the end of each period",
        },
        {
          id: "goalDifference",
          label: "Goal Difference",
          description: "Get notified when a team takes a significant lead",
          thresholdLabel: "Minimum goal difference",
        }
      ];
    case "rugby":
      return [
        {
          id: "try",
          label: "Try",
          description: "Get notified when a try is scored",
        },
        {
          id: "conversion",
          label: "Conversion",
          description: "Get notified for conversion attempts",
        },
        {
          id: "penaltyKick",
          label: "Penalty Kicks",
          description: "Get notified for penalty kicks",
        },
        {
          id: "yellowCards",
          label: "Yellow Cards",
          description: "Get notified when yellow cards are issued",
        },
        {
          id: "redCards",
          label: "Red Cards",
          description: "Get notified when red cards are issued",
        },
        {
          id: "pointDifference",
          label: "Point Difference",
          description: "Get notified when a team takes a significant lead",
          thresholdLabel: "Minimum point difference",
        }
      ];
    case "formula1":
      return [
        {
          id: "leadChange",
          label: "Lead Change",
          description: "Get notified when the race leader changes",
        },
        {
          id: "fastestLap",
          label: "Fastest Lap",
          description: "Get notified when a driver sets the fastest lap",
        },
        {
          id: "pitStop",
          label: "Pit Stops",
          description: "Get notified for key pit stops",
        },
        {
          id: "crash",
          label: "Crashes/Incidents",
          description: "Get notified of crashes and safety cars",
        },
        {
          id: "timeDifference",
          label: "Time Gap",
          description: "Get notified when time gap exceeds threshold",
          thresholdLabel: "Minimum seconds gap",
        }
      ];
    case "boxing":
      return [
        {
          id: "knockouts",
          label: "Knockouts",
          description: "Get notified for knockout punches",
        },
        {
          id: "knockdowns",
          label: "Knockdowns",
          description: "Get notified when a fighter is knocked down",
        },
        {
          id: "roundEnd",
          label: "Round End",
          description: "Get notified at the end of each round",
        },
        {
          id: "powerPunches",
          label: "Power Punches",
          description: "Get notified for significant power punches",
        },
        {
          id: "combinations",
          label: "Combinations",
          description: "Get notified for effective punch combinations",
        }
      ];
    case "tennis":
      return [
        {
          id: "aces",
          label: "Aces",
          description: "Get notified for ace serves",
        },
        {
          id: "breakPoints",
          label: "Break Points",
          description: "Get notified for break point opportunities",
        },
        {
          id: "setEnd",
          label: "Set End",
          description: "Get notified at the end of each set",
        },
        {
          id: "doubleFaults",
          label: "Double Faults",
          description: "Get notified for double faults",
        },
        {
          id: "winners",
          label: "Winners",
          description: "Get notified for winning shots",
        }
      ];
    case "cricket":
      return [
        {
          id: "wickets",
          label: "Wickets",
          description: "Get notified when wickets fall",
        },
        {
          id: "boundaries",
          label: "Boundaries (4s & 6s)",
          description: "Get notified for boundaries scored",
        },
        {
          id: "centuries",
          label: "Centuries",
          description: "Get notified when players score 100 runs",
        },
        {
          id: "fifties",
          label: "Half Centuries",
          description: "Get notified when players score 50 runs",
        },
        {
          id: "runRate",
          label: "Run Rate Changes",
          description: "Get notified for significant run rate changes",
        }
      ];
    case "golf":
      return [
        {
          id: "birdies",
          label: "Birdies",
          description: "Get notified for birdie scores",
        },
        {
          id: "eagles",
          label: "Eagles",
          description: "Get notified for eagle scores",
        },
        {
          id: "holeInOne",
          label: "Hole-in-One",
          description: "Get notified for holes-in-one",
        },
        {
          id: "leaderChange",
          label: "Leader Change",
          description: "Get notified when the tournament leader changes",
        },
        {
          id: "bogeys",
          label: "Bogeys",
          description: "Get notified for bogey scores",
        }
      ];
    case "nascar":
      return [
        {
          id: "leadChange",
          label: "Lead Change",
          description: "Get notified when the race leader changes",
        },
        {
          id: "crashes",
          label: "Crashes",
          description: "Get notified for crashes and cautions",
        },
        {
          id: "pitStops",
          label: "Pit Stops",
          description: "Get notified for strategic pit stops",
        },
        {
          id: "fastestLap",
          label: "Fastest Lap",
          description: "Get notified for fastest lap times",
        },
        {
          id: "overtakes",
          label: "Overtakes",
          description: "Get notified for significant overtaking moves",
        }
      ];
    case "esports":
      return [
        {
          id: "kills",
          label: "Kills",
          description: "Get notified for player eliminations",
        },
        {
          id: "objectives",
          label: "Objectives",
          description: "Get notified when objectives are captured",
        },
        {
          id: "ultimates",
          label: "Ultimate Abilities",
          description: "Get notified for ultimate ability usage",
        },
        {
          id: "teamFights",
          label: "Team Fights",
          description: "Get notified for major team battles",
        },
        {
          id: "powerups",
          label: "Power-ups",
          description: "Get notified when power-ups are collected",
        }
      ];
    case "mma":
      return [
        {
          id: "knockouts",
          label: "Knockouts",
          description: "Get notified for knockout finishes",
        },
        {
          id: "submissions",
          label: "Submissions",
          description: "Get notified for submission attempts",
        },
        {
          id: "takedowns",
          label: "Takedowns",
          description: "Get notified for successful takedowns",
        },
        {
          id: "roundEnd",
          label: "Round End",
          description: "Get notified at the end of each round",
        },
        {
          id: "significantStrikes",
          label: "Significant Strikes",
          description: "Get notified for significant striking exchanges",
        }
      ];
    case "tabletennis":
      return [
        {
          id: "points",
          label: "Points",
          description: "Get notified for important points",
        },
        {
          id: "gameEnd",
          label: "Game End",
          description: "Get notified at the end of each game",
        },
        {
          id: "aces",
          label: "Service Aces",
          description: "Get notified for ace serves",
        },
        {
          id: "rallies",
          label: "Long Rallies",
          description: "Get notified for extended rallies",
        }
      ];
    case "volleyball":
      return [
        {
          id: "spikes",
          label: "Spikes",
          description: "Get notified for powerful spike attacks",
        },
        {
          id: "blocks",
          label: "Blocks",
          description: "Get notified for successful blocks",
        },
        {
          id: "aces",
          label: "Service Aces",
          description: "Get notified for ace serves",
        },
        {
          id: "setEnd",
          label: "Set End",
          description: "Get notified at the end of each set",
        }
      ];
    case "handball":
      return [
        {
          id: "goals",
          label: "Goals",
          description: "Get notified when goals are scored",
        },
        {
          id: "penalties",
          label: "Penalty Shots",
          description: "Get notified for penalty shot opportunities",
        },
        {
          id: "fastBreaks",
          label: "Fast Breaks",
          description: "Get notified for fast break attacks",
        },
        {
          id: "saves",
          label: "Goalkeeper Saves",
          description: "Get notified for crucial saves",
        }
      ];
    case "darts":
      return [
        {
          id: "bullseyes",
          label: "Bullseyes",
          description: "Get notified for bullseye hits",
        },
        {
          id: "checkouts",
          label: "Checkouts",
          description: "Get notified for game-winning checkouts",
        },
        {
          id: "maximums",
          label: "180s (Maximums)",
          description: "Get notified for maximum scores",
        },
        {
          id: "legEnd",
          label: "Leg End",
          description: "Get notified at the end of each leg",
        }
      ];
    case "lacrosse":
      return [
        {
          id: "goals",
          label: "Goals",
          description: "Get notified when goals are scored",
        },
        {
          id: "assists",
          label: "Assists",
          description: "Get notified for goal assists",
        },
        {
          id: "saves",
          label: "Goalkeeper Saves",
          description: "Get notified for important saves",
        },
        {
          id: "penalties",
          label: "Penalties",
          description: "Get notified for penalty situations",
        }
      ];
    case "baseball":
      return [
        {
          id: "homeRuns",
          label: "Home Runs",
          description: "Get notified for home runs",
        },
        {
          id: "strikeouts",
          label: "Strikeouts",
          description: "Get notified for strikeouts",
        },
        {
          id: "hits",
          label: "Base Hits",
          description: "Get notified for important hits",
        },
        {
          id: "inningEnd",
          label: "Inning End",
          description: "Get notified at the end of each inning",
        }
      ];
    case "hockey":
      return [
        {
          id: "goals",
          label: "Goals",
          description: "Get notified when goals are scored",
        },
        {
          id: "assists",
          label: "Assists",
          description: "Get notified for goal assists",
        },
        {
          id: "penalties",
          label: "Penalties",
          description: "Get notified for penalty calls",
        },
        {
          id: "saves",
          label: "Goalkeeper Saves",
          description: "Get notified for crucial saves",
        },
        {
          id: "periodEnd",
          label: "Period End",
          description: "Get notified at the end of each period",
        }
      ];
    default:
      return []; // Default empty alerts if sport not recognized
  }
};

export default function AlertSetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { preferences, updatePreferences } = useAlertPreferences();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  
  // Track all selected sports and which one we're currently configuring
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [currentSportIndex, setCurrentSportIndex] = useState(0);
  
  // Get the current sport we're configuring from URL param or from state
  const sportParam = params.sport || null;
  const selectedSport = sportParam || selectedSports[currentSportIndex] || 'soccer';
  
  // Load selected sports from preferences when component mounts
  useEffect(() => {
    if (preferences?.sports) {
      const sports = Object.entries(preferences.sports)
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);
      
      if (sports.length > 0) {
        setSelectedSports(sports);
        
        // Clean up localStorage for any sports that are no longer selected
        const allPossibleSports = ALL_SPORTS_IN_ORDER;
        const unselectedSports = allPossibleSports.filter(sport => !sports.includes(sport));
        
        unselectedSports.forEach(sport => {
          const storageKey = `${sport}_alerts`;
          if (localStorage.getItem(storageKey)) {
            console.log(`Cleaning up removed sport: ${sport}`);
            localStorage.removeItem(storageKey);
          }
        });
      } else {
        setSelectedSports(['soccer']); // Default to soccer if no sports selected
      }
    } else {
      setSelectedSports(['soccer']); // Default to soccer if no preferences
    }
  }, [preferences]);

  // Load existing custom alerts from localStorage when the sport changes (but only if there are saved ones)
  useEffect(() => {
    const existingAlerts = localStorage.getItem(`${selectedSport}_alerts`);
    if (existingAlerts) {
      const sportConfig = JSON.parse(existingAlerts);
      if (sportConfig.customAlerts && sportConfig.customAlerts.length > 0) {
        // Check if the custom alerts have conditions that match the current sport
        const validAlerts = sportConfig.customAlerts.filter((alert: any) => {
          // If alert has no conditions, it's valid (empty state)
          if (alert.conditions.length === 0) return true;
          
          // Check if all conditions have valid event types for current sport
          const validEventTypes = getSportAlertOptions(selectedSport).map(opt => opt.id);
          return alert.conditions.every((condition: any) => 
            validEventTypes.includes(condition.eventType)
          );
        });
        
        // Remove duplicates based on summary
        const uniqueAlerts = validAlerts.filter((alert: any, index: number, self: any[]) => 
          index === self.findIndex((a: any) => a.summary === alert.summary)
        );
        
        // Only override the default if there are actually saved custom alerts that are valid
        if (uniqueAlerts.length > 0) {
          setCustomAlerts(uniqueAlerts);
        }
      }
    }
  }, [selectedSport]);
  
  // Get the alerts for the selected sport
  const sportAlerts = getSportAlerts(selectedSport);
  
  // Create default selections object based on the sport's alerts - all OFF by default
  const getDefaultSelections = () => {
    const defaults: {[key: string]: boolean} = {};
    sportAlerts.forEach(alert => {
      defaults[alert.id] = false; // All alerts OFF by default
    });
    return defaults;
  };
  
  // Local state to track user selections
  const [selectedAlerts, setSelectedAlerts] = useState<{[key: string]: boolean}>(getDefaultSelections());
  
  // Reset alert selections and custom alerts when sport changes - user starts with clean slate
  useEffect(() => {
    setSelectedAlerts(getDefaultSelections());
    
    // Reset custom alerts with sport-appropriate defaults
    
    setCustomAlerts([
      {
        id: 'alert1',
        name: 'Custom Alert 1',
        enabled: false,
        conditions: [], // Start with no conditions - user must add them
        operator: 'AND'
      }
    ]);
  }, [selectedSport]);
  
  // Thresholds for alerts that need them
  const [thresholds, setThresholds] = useState<{[key: string]: number}>({
    goalDifference: 2,
    corners: 5,
    pointDifference: 15,
    runDifference: 3,
  });
  
  const handleToggleAlert = (alertId: string) => {
    console.log(`Toggling alert: ${alertId}`);
    setSelectedAlerts(prev => {
      const newState = {
        ...prev,
        [alertId]: !prev[alertId]
      };
      console.log(`New alert state for ${alertId}:`, newState[alertId]);
      console.log('Full alert state:', newState);
      return newState;
    });
  };
  
  const handleThresholdChange = (alertId: string, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setThresholds(prev => ({
        ...prev,
        [alertId]: numValue
      }));
    }
  };
  
  // Get all possible event types for the current sport - use the comprehensive sport-specific options
  const getEventTypesForSport = (sport: string) => {
    return getSportAlertOptions(sport);
  };
  
  // Get event type label by id
  const getEventTypeLabel = (eventTypeId: string) => {
    const eventTypes = getEventTypesForSport(selectedSport);
    const eventType = eventTypes.find(et => et.id === eventTypeId);
    return eventType ? eventType.label : eventTypeId;
  };
  
  // Generate sentence description for an alert condition
  const generateConditionSentence = (condition: any, conditionIndex: number = 0, alert: any = null) => {
    let teamLabel = condition.team === 'teamA' ? 'Home Team' : 
                   condition.team === 'teamB' ? 'Away Team' : 
                   condition.team === 'otherTeam' ? 'Other Team' : 'Either Team';
    
    // Add explanation for "Other Team" if needed
    if (condition.team === 'otherTeam') {
      teamLabel += ' (opposite of the team that triggered the first condition)';
    }
    
    const eventLabel = getEventTypeLabel(condition.eventType);
    const comparisonLabel = condition.comparison === 'equals' ? 'equals exactly' :
                           condition.comparison === 'greaterThan' ? 'is greater than or equal to' :
                           'is less than or equal to';
    
    return `${teamLabel} ${eventLabel} ${comparisonLabel} ${condition.threshold}`;
  };
  
  // Generate a complete human-readable sentence for the alert
  const generateAlertSentence = (alert: any) => {
    if (!alert.conditions.length) return 'No conditions set';
    
    if (alert.conditions.length === 1) {
      return generateConditionSentence(alert.conditions[0]);
    }
    
    const conditionSentences = alert.conditions.map((condition: any) => 
      generateConditionSentence(condition)
    );
    
    const operator = alert.operator === 'AND' ? 'AND' : 'OR';
    
    return conditionSentences.join(` ${operator} `);
  };

  // Generate a summary for saving to localStorage
  const generateAlertSummary = (alert: any) => {
    return generateAlertSentence(alert);
  };
  
  // Added state for customizable team-specific alerts
  const [customAlerts, setCustomAlerts] = useState<CustomAlert[]>([
    {
      id: 'alert1',
      name: 'Custom Alert 1',
      enabled: false,
      conditions: [], // Start with no conditions - user must add them
      operator: 'AND'
    }
  ]);
  
  // Function to add a new custom alert
  const addNewCustomAlert = () => {
    const newAlertId = `alert${customAlerts.length + 1}`;
    
    // Get sport-appropriate default event type
    const getDefaultEventTypeForSport = (sport: string) => {
      switch(sport) {
        case 'soccer':
          return 'goals';
        case 'basketball':
          return 'points';
        case 'baseball':
          return 'homeRuns';
        case 'football':
          return 'touchdowns';
        case 'hockey':
          return 'goals';
        case 'rugby':
          return 'tries';
        case 'formula1':
          return 'leadChange';
        default:
          return 'goals';
      }
    };
    
    setCustomAlerts(prev => [
      ...prev,
      {
        id: newAlertId,
        name: `Custom Alert ${customAlerts.length + 1}`,
        enabled: false,
        conditions: [], // Start with no conditions - user must add them
        operator: 'AND'
      }
    ]);
  };
  
  // Function to add a new condition to an alert
  const addCondition = (alertId: string) => {
    
    setCustomAlerts(prev => 
      prev.map(alert => {
        if (alert.id === alertId) {
          return {
            ...alert,
            conditions: [
              ...alert.conditions,
              {
                eventType: getDefaultEventTypeForSport(selectedSport),
                team: 'any',
                threshold: 1,
                comparison: 'greaterThan',
              }
            ]
          };
        }
        return alert;
      })
    );
  };
  
  // Function to remove a condition from an alert
  const removeCondition = (alertId: string, conditionIndex: number) => {
    setCustomAlerts(prev => 
      prev.map(alert => {
        if (alert.id === alertId) {
          const newConditions = [...alert.conditions];
          newConditions.splice(conditionIndex, 1);
          return {
            ...alert,
            conditions: newConditions
          };
        }
        return alert;
      })
    );
  };

  // Function to delete a custom alert entirely
  const deleteCustomAlert = (alertId: string) => {
    console.log(`Attempting to delete alert with ID: ${alertId}`);
    console.log(`Current customAlerts:`, customAlerts);
    
    // Remove from state
    const filteredAlerts = customAlerts.filter(alert => alert.id !== alertId);
    console.log(`Filtered alerts:`, filteredAlerts);
    setCustomAlerts(filteredAlerts);
    
    // Also remove from localStorage for the current sport
    const existingAlerts = localStorage.getItem(`${selectedSport}_alerts`);
    if (existingAlerts) {
      const sportConfig = JSON.parse(existingAlerts);
      console.log(`Current localStorage config:`, sportConfig);
      if (sportConfig.customAlerts) {
        const filteredStorageAlerts = sportConfig.customAlerts.filter((alert: any) => alert.id !== alertId);
        sportConfig.customAlerts = filteredStorageAlerts;
        localStorage.setItem(`${selectedSport}_alerts`, JSON.stringify(sportConfig));
        console.log(`Updated localStorage config:`, sportConfig);
      }
    }
    
    toast({
      title: "Alert deleted",
      description: "Custom alert has been removed successfully",
    });
  };
  
  // Handle toggling custom alert enabled state
  const handleToggleCustomAlert = (alertId: string) => {
    setCustomAlerts(prev => 
      prev.map(alert => {
        if (alert.id === alertId) {
          const newAlert = {...alert, enabled: !alert.enabled};
          // If enabling the alert and it has no conditions, add the first condition automatically
          if (newAlert.enabled && newAlert.conditions.length === 0) {
            newAlert.conditions = [{
              eventType: getDefaultEventTypeForSport(selectedSport),
              team: 'any',
              threshold: 1,
              comparison: 'greaterThan',
            }];
          }
          return newAlert;
        }
        return alert;
      })
    );
  };
  
  // Handle updating custom alert condition
  const handleUpdateCondition = (alertId: string, conditionIndex: number, field: string, value: any) => {
    setCustomAlerts(prev => 
      prev.map(alert => {
        if (alert.id === alertId) {
          const updatedConditions = [...alert.conditions];
          updatedConditions[conditionIndex] = {
            ...updatedConditions[conditionIndex],
            [field]: value
          };
          return {...alert, conditions: updatedConditions};
        }
        return alert;
      })
    );
  };
  
  const handleSavePreferences = async () => {
    try {
      // Initialize empty preferences if none exist yet
      let prefsToUpdate: AlertPreferencesData;
      
      if (!preferences) {
        // Create a new preferences object if none exists
        prefsToUpdate = {
          sports: { [selectedSport]: true },
          sportAlerts: {},
          leagues: {},
          customAlerts: []
        };
      } else {
        // Use existing preferences as the base
        prefsToUpdate = { ...preferences };
      }
      
      // Copy existing sportAlerts or initialize if undefined
      const updatedSportAlerts = { ...(prefsToUpdate.sportAlerts || {}) };
    
      // Set up the alerts for the current sport
      updatedSportAlerts[selectedSport] = {
        // Whether alerts for this sport are enabled
        enabled: true,
        
        // Basic alerts
        goalAlerts: selectedAlerts.goals || false,
        redCardAlerts: selectedAlerts.redCards || false,
        yellowCardAlerts: selectedAlerts.yellowCards || false,
        
        // Goal difference alerts with threshold
        goalDifferenceAlerts: {
          enabled: selectedAlerts.goalDifference || false,
          threshold: thresholds.goalDifference || 2,
          targetTeam: 'any'
        },
        
        // Time-based alerts
        halfTimeFullTimeAlerts: selectedAlerts.halftime || false,
        lateGameAlerts: {
          enabled: selectedAlerts.lateGame || false,
          startMinute: thresholds.lateGame || 85
        },
        
        // Keep the existing leagues configuration or initialize with all leagues
        leagues: updatedSportAlerts[selectedSport]?.leagues || { all: true }
      };
      
      // The updated preferences object
      const updatedPreferences: AlertPreferencesData = {
        // Keep existing sports selection
        sports: prefsToUpdate.sports || {},
        
        // Update sport-specific alerts
        sportAlerts: updatedSportAlerts,
        
        // Preserve existing additional fields
        leagues: prefsToUpdate.leagues || {},
        
        // Custom team-specific alerts
        customAlerts: customAlerts
      };
      
      // Save the preferences
      await updatePreferences(updatedPreferences);
      
      // Mark onboarding as complete to show main navigation tabs
      localStorage.setItem('onboardingCompleted', 'true');
      
      toast({
        title: "Preferences Saved",
        description: "Your alert preferences have been updated successfully.",
        variant: "default",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive"
      });
      
      return Promise.reject(error);
    }
  };

  // Function to navigate to league selection after alert setup
  const goToNextSport = () => {
    console.log("Continue button clicked!");
    
    const currentSport = sportParam || selectedSports[currentSportIndex] || 'soccer';
    console.log(`Navigating to league selection for ${currentSport}`);
    
    // Check for duplicates before saving
    const currentAlertPrefs = {
      enabled: true,
      goalAlerts: selectedAlerts.goals || false,
      redCardAlerts: selectedAlerts.redCards || false,
      yellowCardAlerts: selectedAlerts.yellowCards || false,
      freekickAlerts: selectedAlerts.freekicks || false,
      goalDifferenceAlerts: {
        enabled: selectedAlerts.goalDifference || false,
        threshold: thresholds.goalDifference || 2,
        targetTeam: 'any',
      },
      halfTimeFullTimeAlerts: selectedAlerts.halftime || false,
      lateGameAlerts: {
        enabled: selectedAlerts.lateGame || false,
        startMinute: thresholds.lateGame || 85,
      },
      // Include sport-specific alert types for basketball
      pointDifferenceAlerts: selectedAlerts.pointDifference ? {
        enabled: true,
        threshold: thresholds.pointDifference || 15,
      } : { enabled: false },
      overtimeAlerts: selectedAlerts.overtime || false,
      technicalFoulAlerts: selectedAlerts.technicalFoul || false,
      // Include sport-specific alert types for football
      touchdownAlerts: selectedAlerts.touchdown || false,
      fieldGoalAlerts: selectedAlerts.fieldGoal || false,
      interceptionsAlerts: selectedAlerts.interceptions || false,
      runDifferenceAlerts: selectedAlerts.runDifference ? {
        enabled: true,
        threshold: thresholds.runDifference || 3,
      } : { enabled: false },
    };
    
    // Check for duplicates with existing sport configurations
    const duplicateSports = [];
    const existingSports = ['soccer', 'basketball', 'football'];
    
    for (const sport of existingSports) {
      if (sport === currentSport) continue;
      
      const existingData = localStorage.getItem(`${sport}_alerts`);
      if (existingData) {
        const existingPrefs = JSON.parse(existingData);
        
        // Compare key alert preferences (excluding sport-specific fields)
        const currentCore = {
          goalAlerts: currentAlertPrefs.goalAlerts,
          redCardAlerts: currentAlertPrefs.redCardAlerts,
          yellowCardAlerts: currentAlertPrefs.yellowCardAlerts,
          goalDifferenceEnabled: currentAlertPrefs.goalDifferenceAlerts.enabled,
          halfTimeFullTimeAlerts: currentAlertPrefs.halfTimeFullTimeAlerts,
          lateGameEnabled: currentAlertPrefs.lateGameAlerts.enabled,
        };
        
        const existingCore = {
          goalAlerts: existingPrefs.goalAlerts,
          redCardAlerts: existingPrefs.redCardAlerts,
          yellowCardAlerts: existingPrefs.yellowCardAlerts,
          goalDifferenceEnabled: existingPrefs.goalDifferenceAlerts?.enabled,
          halfTimeFullTimeAlerts: existingPrefs.halfTimeFullTimeAlerts,
          lateGameEnabled: existingPrefs.lateGameAlerts?.enabled,
        };
        
        if (JSON.stringify(currentCore) === JSON.stringify(existingCore)) {
          duplicateSports.push(getSportDisplayName(sport));
        }
      }
    }
    
    if (duplicateSports.length > 0) {
      toast({
        title: "Removing Repetitive Alerts",
        description: `Identical alerts found for ${duplicateSports.join(' and ')}. Removing duplicates to streamline your notifications.`,
        variant: "default",
      });
    }
    
    // Save ONLY the current sport's alerts without affecting other sports
    const enabledCustomAlerts = customAlerts.filter(alert => alert.enabled).map(alert => ({
      ...alert,
      summary: generateAlertSentence(alert)
    }));
    
    // Create the final alert preferences for THIS SPORT ONLY
    const finalAlertPrefs = {
      ...currentAlertPrefs,
      customAlerts: enabledCustomAlerts
    };
    
    // Save to localStorage for ONLY the current sport
    localStorage.setItem(`${currentSport}_alerts`, JSON.stringify(finalAlertPrefs));
    console.log(`Saved alerts for ${currentSport} ONLY:`, finalAlertPrefs);
    
    // Navigate to league selection for this sport
    setLocation(`/league-selection/${currentSport}`);
  };
  
  const goToPreviousSport = () => {
    // Check if we're using URL parameter
    if (sportParam) {
      // Find the current sport index in the list
      const sports = Object.entries(preferences?.sports || {})
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);
      
      const currentIndex = sports.indexOf(sportParam);
      
      if (currentIndex > 0) {
        // Navigate to the previous sport
        setLocation(`/alert-setup/${sports[currentIndex - 1]}`);
      } else {
        // If this is the first sport, go back to sport selection
        setLocation("/sport-selection");
      }
    } else {
      // Using state-based navigation
      if (currentSportIndex > 0) {
        setCurrentSportIndex(currentSportIndex - 1);
      } else {
        // If this is the first sport, go back to sport selection
        setLocation("/sport-selection");
      }
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-[hsl(var(--sky-blue))] text-white p-4 flex justify-between items-center shadow-md">
        <button onClick={goToPreviousSport} className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold mb-2">{getSportDisplayName(selectedSport)} Alerts</h1>
        <p className="text-muted-foreground text-sm mb-2">Customize alert settings</p>
        
        {/* Sport navigation dots */}
        <SportNavigation currentSport={selectedSport} />
        <div className="w-6"></div> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <main className="p-4 pb-20">
        {/* Sport selection progress indicator */}
        <div className="flex justify-center items-center gap-1 mb-4">
          {selectedSports.map((sport, index) => (
            <div 
              key={sport}
              className={`h-2 rounded-full ${
                index === currentSportIndex 
                  ? 'bg-primary w-6' 
                  : index < currentSportIndex 
                    ? 'bg-primary/50 w-4' 
                    : 'bg-gray-200 w-4'
              }`}
            />
          ))}
        </div>
        
        <p className="text-center mb-4 text-gray-600">
          {currentSportIndex + 1} of {selectedSports.length}: Choose which events you want alerts for
        </p>
        
        {/* Custom Combined Alerts Section */}
        <div className="mb-8">
          <header className="mb-4">
            <h2 className="text-lg font-semibold">Custom Combined Alerts</h2>
            <p className="text-sm text-gray-500">Create fully customizable alerts with team-specific conditions</p>
          </header>
          
          <div className="space-y-6">
            {customAlerts.map((alert, alertIndex) => (
              <Card key={alert.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Switch 
                        checked={alert.enabled}
                        onCheckedChange={() => handleToggleCustomAlert(alert.id)}
                        id={`custom-${alert.id}`}
                      />
                      <input 
                        type="text"
                        value={alert.name}
                        onChange={(e) => {
                          setCustomAlerts(prev => 
                            prev.map(a => 
                              a.id === alert.id
                              ? {...a, name: e.target.value} 
                              : a
                            )
                          );
                        }}
                        className="px-2 py-1 border rounded text-base font-medium"
                      />
                    </div>
                    <p className="text-sm text-gray-500 pl-10">
                      Alert me when the following conditions are met:
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Delete button clicked for alert ID:', alert.id);
                      deleteCustomAlert(alert.id);
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2 flex-shrink-0"
                    type="button"
                  >
                    <span className="mr-1">×</span>
                  </Button>
                </div>
                
                {/* Alert Preview - Only show when there are conditions */}
                {alert.conditions.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                    <div className="flex items-start">
                      <div className="p-1 rounded-full bg-blue-100 mr-2 mt-0.5">
                        <Bell className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-700">Alert Summary:</p>
                        <p className="text-sm text-blue-600">
                          {generateAlertSentence(alert)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {alert.enabled && (
                  <div className="space-y-4 mt-3">
                    {alert.conditions.map((condition, condIndex) => (
                      <div key={`${alert.id}-condition-${condIndex}`} className="p-3 bg-gray-50 rounded-md border mb-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-sm">Condition {condIndex + 1}</span>
                          {alert.conditions.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCondition(alert.id, condIndex)}
                              className="text-red-500 h-7"
                            >
                              <span className="mr-1">×</span> Remove
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-sm">Team</Label>
                            <select 
                              className="w-full p-2 mt-1 border rounded-md"
                              value={condition.team}
                              onChange={(e) => handleUpdateCondition(alert.id, condIndex, 'team', e.target.value)}
                            >
                              <option value="any">Either Team</option>
                              <option value="teamA">Home Team</option>
                              <option value="teamB">Away Team</option>
                              {condIndex > 0 && (
                                <option value="otherTeam">Other Team*</option>
                              )}
                            </select>
                          </div>
                          
                          <div>
                            <Label className="text-sm">Event Type</Label>
                            <select 
                              className="w-full p-2 mt-1 border rounded-md"
                              value={condition.eventType}
                              onChange={(e) => handleUpdateCondition(alert.id, condIndex, 'eventType', e.target.value)}
                            >
                              {getEventTypesForSport(selectedSport).map(eventType => (
                                <option key={eventType.id} value={eventType.id}>
                                  {eventType.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <Label className="text-sm">Comparison</Label>
                            <select 
                              className="w-full p-2 mt-1 border rounded-md"
                              value={condition.comparison}
                              onChange={(e) => handleUpdateCondition(alert.id, condIndex, 'comparison', e.target.value)}
                            >
                              <option value="equals">Equals exactly</option>
                              <option value="greaterThan">Greater than or equal to</option>
                              <option value="lessThan">Less than or equal to</option>
                            </select>
                          </div>
                          
                          <div>
                            <Label className="text-sm">Value</Label>
                            <Input
                              type="number"
                              min="0"
                              max="99"
                              className="mt-1"
                              value={condition.threshold}
                              onChange={(e) => handleUpdateCondition(alert.id, condIndex, 'threshold', parseInt(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                        
                        {/* Human-readable condition sentence */}
                        <div className="mt-3 text-sm text-gray-500 italic border-t pt-2">
                          This means: "{generateConditionSentence(condition)}"
                        </div>
                      </div>
                    ))}
                    
                    {alert.conditions.length > 1 && (
                      <div className="p-3 bg-gray-50 rounded-md border mb-3">
                        <Label className="text-sm mb-1 block">How to combine conditions:</Label>
                        <div className="flex items-center gap-3">
                          <select 
                            className="p-2 border rounded-md w-full"
                            value={alert.operator}
                            onChange={(e) => {
                              setCustomAlerts(prev => 
                                prev.map(a => 
                                  a.id === alert.id 
                                    ? {...a, operator: e.target.value as 'AND' | 'OR'} 
                                    : a
                                )
                              );
                            }}
                          >
                            <option value="AND">ALL conditions must be met (AND)</option>
                            <option value="OR">ANY condition can be met (OR)</option>
                          </select>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => addCondition(alert.id)}
                        className="w-full"
                      >
                        <span className="mr-1">+</span> Add Another Condition
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
            
            <Button 
              onClick={addNewCustomAlert}
              className="w-full"
              variant="outline"
            >
              <span className="mr-1">+</span> Create New Custom Alert
            </Button>
          </div>
        </div>
        
        {/* Explanation for the "Other Team" option */}
        {customAlerts.some(alert => alert.conditions.some(c => c.team === 'otherTeam')) && (
          <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-1 text-sm">About the "Other Team" option:</h3>
            <p className="text-sm text-blue-700">
              When you select "Other Team" in a condition, it refers to the opposite team from the one that triggered the first condition. 
              This is useful for creating alerts like "Home team scores 2+ goals AND Other Team gets a red card" - meaning if Team A scores 2+ goals, 
              you'll be alerted if Team B gets a red card.
            </p>
          </div>
        )}
        
        {/* Individual Alerts Section */}
        <div className="mt-8">
          <header className="mb-4">
            <h2 className="text-lg font-semibold">Individual Alerts</h2>
            <p className="text-sm text-gray-500">Configure basic single-event alerts for {getSportDisplayName(selectedSport)}</p>
          </header>
          
          <div className="space-y-4">
            {sportAlerts.map((alert) => (
              <Card key={alert.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Switch 
                        checked={selectedAlerts[alert.id]}
                        onCheckedChange={() => handleToggleAlert(alert.id)}
                        id={`switch-${alert.id}`}
                      />
                      <Label htmlFor={`switch-${alert.id}`} className="font-medium">{alert.label}</Label>
                    </div>
                    <p className="text-sm text-gray-500 pl-10">{alert.description}</p>
                  </div>
                </div>
                
                {/* Show threshold input if needed */}
                {selectedAlerts[alert.id] && alert.thresholdLabel && (
                  <div className="mt-3 pl-10">
                    <Label className="text-sm text-gray-600 mb-1 block">{alert.thresholdLabel}</Label>
                    <div className="flex items-center">
                      <Input 
                        type="number" 
                        className="w-20 text-center" 
                        min={1}
                        value={thresholds[alert.id] || 1}
                        onChange={(e) => handleThresholdChange(alert.id, e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
        
        {/* Individual Team Selection Section */}
        <div className="mb-8">
          <header className="mb-4">
            <h2 className="text-lg font-semibold">Individual Team Selection</h2>
            <p className="text-sm text-gray-500">Select specific teams to get alerts for (optional)</p>
          </header>
          
          <div className="bg-gray-50 p-4 rounded-lg border">
            <p className="text-sm text-gray-600 mb-3">
              By default, alerts apply to all teams in your selected leagues. 
              Choose specific teams here if you only want alerts for certain teams.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div>
                  <span className="font-medium text-sm">All Teams</span>
                  <p className="text-xs text-gray-500">Get alerts for all teams in selected leagues</p>
                </div>
                <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Currently Active
                </div>
              </div>
              
              <div className="border-t pt-3">
                <p className="text-xs text-gray-500 italic">
                  Individual team selection will be available after league selection. 
                  Teams will be loaded based on your chosen leagues.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50 flex gap-3">
          {currentSportIndex > 0 ? (
            <Button 
              onClick={goToPreviousSport} 
              variant="outline" 
              className="w-1/2 border-[hsl(var(--sky-blue))] text-[hsl(var(--sky-blue))] hover:bg-[hsl(var(--claret))] hover:text-white"
            >
              Previous Sport
            </Button>
          ) : (
            <Button 
              onClick={() => setLocation('/sport-selection')} 
              variant="outline"
              className="w-1/2 border-[hsl(var(--sky-blue))] text-[hsl(var(--sky-blue))] hover:bg-[hsl(var(--claret))] hover:text-white"
            >
              Back
            </Button>
          )}
          
          <Button 
            onClick={goToNextSport} 
            className="w-1/2 bg-[hsl(var(--sky-blue))] hover:bg-[hsl(var(--claret))]"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 
             currentSportIndex < selectedSports.length - 1 ? 'Next Sport' : 'Save All'}
          </Button>
        </div>
        <div className="pb-20">
          {/* Spacer to prevent content from being hidden behind the fixed button */}
        </div>
      </main>
    </>
  );
}