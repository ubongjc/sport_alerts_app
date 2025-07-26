import React from 'react';
import { Trash2, Bell, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLocation } from 'wouter';
import { useAlertPreferences } from '@/hooks/useAlerts';
import { getSportDisplayName, ALL_SPORTS_IN_ORDER, getSportLeagues } from '@/data/sportLeagues';
import { useToast } from '@/hooks/use-toast';

export default function MyAlerts() {
  const [_, setLocation] = useLocation();
  const { preferences, updatePreferences } = useAlertPreferences();
  const { toast } = useToast();

  // Function to delete a league from an alert
  const deleteLeagueFromAlert = (alertId: string, leagueToDelete: string) => {
    // Extract sport from alertId (format: "sportId-alertType")
    const [sportId] = alertId.split('-');
    
    // Get sport-specific league data
    const leagueData = localStorage.getItem(`${sportId}_leagues`);
    if (!leagueData) return;
    
    const leagues = JSON.parse(leagueData);
    
    // If "all" is true, we're in "All Leagues" mode - can't delete individual leagues
    if (leagues.all === true) {
      toast({
        title: "Cannot delete league",
        description: "This alert is set to All Leagues. Edit the alert to select specific leagues first.",
        variant: "destructive",
      });
      return;
    }
    
    // Get all currently selected leagues
    const selectedLeagues = Object.entries(leagues)
      .filter(([key, value]) => key !== 'all' && value === true)
      .map(([key]) => key);
    
    // Find the league key that matches the display name
    const leagueKey = Object.keys(leagues).find(key => {
      if (key === 'all') return false;
      // Try exact match first
      if (key === leagueToDelete) return true;
      // Try case-insensitive match
      if (key.toLowerCase() === leagueToDelete.toLowerCase()) return true;
      // Try partial match for common league variations
      const commonMappings: { [key: string]: string[] } = {
        'premierleague': ['Premier League', 'EPL', 'English Premier League'],
        'laliga': ['La Liga', 'Spanish La Liga', 'Primera División'],
        'seriea': ['Serie A', 'Italian Serie A'],
        'bundesliga': ['Bundesliga', 'German Bundesliga'],
        'ligue1': ['Ligue 1', 'French Ligue 1'],
        'championsleague': ['Champions League', 'UEFA Champions League', 'UCL'],
        'facup': ['FA Cup', 'English FA Cup'],
        'wbc': ['WBC', 'World Boxing Council'],
        'wba': ['WBA', 'World Boxing Association'],
        'wbo': ['WBO', 'World Boxing Organization'],
        'ibf': ['IBF', 'International Boxing Federation']
      };
      
      return commonMappings[key.toLowerCase()]?.includes(leagueToDelete) || false;
    });
    
    if (!leagueKey) {
      toast({
        title: "League not found",
        description: "Could not find the specified league to delete.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if this is the last league - prevent deletion if so
    if (selectedLeagues.length === 1) {
      toast({
        title: "Cannot delete last league",
        description: "You must have at least one league selected. Delete the entire alert if you want to remove all leagues.",
        variant: "destructive",
      });
      return;
    }
    
    // Remove the league
    const updatedLeagues = { ...leagues, [leagueKey]: false };
    
    // Save updated leagues
    localStorage.setItem(`${sportId}_leagues`, JSON.stringify(updatedLeagues));
    
    toast({
      title: "League removed",
      description: `Removed ${leagueToDelete} from alert.`,
      variant: "default",
    });
    
    // Force re-render
    window.location.reload();
  };

  // Clean up duplicates in localStorage when component mounts
  React.useEffect(() => {
    const cleanupDuplicates = () => {
      const allSports = ALL_SPORTS_IN_ORDER;
      let hasChanges = false;
      
      allSports.forEach(sportId => {
        const alertData = localStorage.getItem(`${sportId}_alerts`);
        if (alertData) {
          try {
            const sportConfig = JSON.parse(alertData);
            if (sportConfig.customAlerts && sportConfig.customAlerts.length > 0) {
              // Remove duplicates based on summary, id, AND name
              const uniqueCustomAlerts = sportConfig.customAlerts.filter((alert: any, index: number, self: any[]) => {
                // Keep first occurrence of each unique alert (by summary OR id OR name if they match)
                const isFirstOccurrence = index === self.findIndex((a: any) => 
                  a.summary === alert.summary || 
                  (a.id === alert.id && alert.id) ||
                  (a.name === alert.name && alert.name && alert.name !== 'Custom Alert 1' && alert.name !== 'Custom Combined Alert')
                );
                return isFirstOccurrence;
              });
              
              // Only update if duplicates were found
              if (uniqueCustomAlerts.length !== sportConfig.customAlerts.length) {
                console.log(`🧹 Cleaning up ${sportConfig.customAlerts.length - uniqueCustomAlerts.length} duplicate custom alerts for ${sportId}`);
                const updatedConfig = {
                  ...sportConfig,
                  customAlerts: uniqueCustomAlerts
                };
                localStorage.setItem(`${sportId}_alerts`, JSON.stringify(updatedConfig));
                hasChanges = true;
              }
            }
          } catch (e) {
            console.error(`Error cleaning up ${sportId} alerts:`, e);
          }
        }
      });
      
      if (hasChanges) {
        // Force a re-render by updating a state
        setTimeout(() => window.location.reload(), 100);
      }
    };
    
    cleanupDuplicates();
  }, []);

  // Get all configured sports and their alerts
  const getConfiguredAlerts = () => {
    const alerts: any[] = [];
    
    // Check localStorage for saved sports and their configurations
    const multiSportFlow = localStorage.getItem('multiSportFlow');
    let configuredSports: string[] = [];
    
    if (multiSportFlow) {
      const flowData = JSON.parse(multiSportFlow);
      configuredSports = flowData.sports || [];
    }
    
    // Also check for individual sport configurations in localStorage
    const allSports = ALL_SPORTS_IN_ORDER;
    allSports.forEach(sportId => {
      const alertData = localStorage.getItem(`${sportId}_alerts`);
      if (alertData && !configuredSports.includes(sportId)) {
        configuredSports.push(sportId);
      }
    });
    
    // Debug: Log what we find in localStorage
    console.log('🔍 Debug localStorage contents:');
    configuredSports.forEach(sportId => {
      const alertData = localStorage.getItem(`${sportId}_alerts`);
      const leagueData = localStorage.getItem(`${sportId}_leagues`);
      console.log(`${sportId}_alerts:`, alertData);
      console.log(`${sportId}_leagues:`, leagueData);
    });
    
    configuredSports.forEach(sportId => {
      const alertData = localStorage.getItem(`${sportId}_alerts`);
      const leagueData = localStorage.getItem(`${sportId}_leagues`);
      
      if (alertData) {
        const sportConfig = JSON.parse(alertData);
        const sportName = getSportDisplayName(sportId);
        
        // Debug logging
        console.log(`Processing ${sportId}:`, sportConfig);
        
        // Check if this sport has ANY enabled alerts (including sport-specific ones)
        const hasIndividualAlerts = Object.keys(sportConfig).some(key => {
          const value = sportConfig[key];
          if (key === 'customAlerts' || key === 'enabled') return false; // Skip these special keys
          
          // Check for boolean alerts (goalAlerts, redCardAlerts, etc.)
          if (typeof value === 'boolean') return value;
          
          // Check for object alerts with enabled property (goalDifferenceAlerts, etc.)
          if (typeof value === 'object' && value?.enabled) return true;
          
          return false;
        });

        // Comprehensive sport-specific alert detection
        const hasSoccerAlerts = sportId === 'soccer' && (
          sportConfig.goalAlerts ||
          sportConfig.redCardAlerts ||
          sportConfig.yellowCardAlerts ||
          sportConfig.freekickAlerts ||
          sportConfig.goalDifferenceAlerts?.enabled ||
          sportConfig.halfTimeFullTimeAlerts ||
          sportConfig.lateGameAlerts?.enabled ||
          sportConfig.cornerAlerts ||
          sportConfig.offsidesAlerts ||
          sportConfig.penaltyAlerts ||
          sportConfig.assistAlerts ||
          sportConfig.saveAlerts ||
          sportConfig.substitutionAlerts
        );

        const hasBasketballAlerts = sportId === 'basketball' && (
          sportConfig.pointAlerts || 
          sportConfig.threePointerAlerts || 
          sportConfig.freeThrowAlerts ||
          sportConfig.reboundAlerts ||
          sportConfig.assistAlerts ||
          sportConfig.stealAlerts ||
          sportConfig.blockAlerts ||
          sportConfig.turnoverAlerts ||
          sportConfig.timeoutAlerts ||
          sportConfig.foulAlerts ||
          sportConfig.technicalFoulAlerts ||
          sportConfig.overtimeAlerts ||
          sportConfig.pointDifferenceAlerts?.enabled
        );

        const hasFootballAlerts = sportId === 'football' && (
          sportConfig.touchdownAlerts ||
          sportConfig.fieldGoalAlerts ||
          sportConfig.interceptionAlerts ||
          sportConfig.fumbleAlerts ||
          sportConfig.sackAlerts ||
          sportConfig.penaltyAlerts ||
          sportConfig.safetyAlerts ||
          sportConfig.firstDownAlerts
        );

        const hasBaseballAlerts = sportId === 'baseball' && (
          sportConfig.homeRunAlerts ||
          sportConfig.hitAlerts ||
          sportConfig.strikeoutAlerts ||
          sportConfig.walkAlerts ||
          sportConfig.doubleAlerts ||
          sportConfig.tripleAlerts ||
          sportConfig.rbiAlerts ||
          sportConfig.stolenBaseAlerts ||
          sportConfig.errorAlerts ||
          sportConfig.runAlerts
        );

        const hasHockeyAlerts = sportId === 'hockey' && (
          sportConfig.assistAlerts ||
          sportConfig.penaltyAlerts ||
          sportConfig.saveAlerts ||
          sportConfig.shotAlerts ||
          sportConfig.powerPlayAlerts ||
          sportConfig.shortHandedAlerts ||
          sportConfig.faceoffAlerts ||
          sportConfig.hitAlerts ||
          sportConfig.blockAlerts
        );

        const hasTennisAlerts = sportId === 'tennis' && (
          sportConfig.aceAlerts ||
          sportConfig.doubleFaultAlerts ||
          sportConfig.winnerAlerts ||
          sportConfig.unforceErrorAlerts ||
          sportConfig.breakPointAlerts ||
          sportConfig.setAlerts ||
          sportConfig.netPointAlerts ||
          sportConfig.longRallyAlerts ||
          sportConfig.challengeAlerts ||
          sportConfig.tiebreakAlerts
        );

        const hasGolfAlerts = sportId === 'golf' && (
          sportConfig.birdieAlerts ||
          sportConfig.eagleAlerts ||
          sportConfig.albatrossAlerts ||
          sportConfig.holeInOneAlerts ||
          sportConfig.bogeyAlerts ||
          sportConfig.doubleBogeyAlerts ||
          sportConfig.chipInAlerts ||
          sportConfig.longPuttAlerts ||
          sportConfig.sandSaveAlerts ||
          sportConfig.penaltyAlerts
        );

        const hasBoxingAlerts = sportId === 'boxing' && (
          sportConfig.knockdownAlerts ||
          sportConfig.knockoutAlerts ||
          sportConfig.jdAlerts ||
          sportConfig.technicalKoAlerts ||
          sportConfig.punchStatsAlerts
        );

        const hasCricketAlerts = sportId === 'cricket' && (
          sportConfig.boundaryAlerts ||
          sportConfig.sixAlerts ||
          sportConfig.wicketAlerts ||
          sportConfig.centuryAlerts ||
          sportConfig.fiftyAlerts ||
          sportConfig.catchAlerts ||
          sportConfig.runoutAlerts ||
          sportConfig.lbwAlerts ||
          sportConfig.maidenAlerts ||
          sportConfig.partnershipAlerts ||
          sportConfig.appealAlerts
        );

        const hasRugbyAlerts = sportId === 'rugby' && (
          sportConfig.tryAlerts ||
          sportConfig.conversionAlerts ||
          sportConfig.penaltyGoalAlerts ||
          sportConfig.dropGoalAlerts ||
          sportConfig.scumAlerts
        );

        const hasFormula1Alerts = sportId === 'formula1' && (
          sportConfig.overtakeAlerts ||
          sportConfig.pitStopAlerts ||
          sportConfig.crashAlerts ||
          sportConfig.fastestLapAlerts ||
          sportConfig.drsAlerts ||
          sportConfig.safetyCarAlerts ||
          sportConfig.penaltyAlerts ||
          sportConfig.retirementAlerts ||
          sportConfig.podiumChangeAlerts ||
          sportConfig.weatherChangeAlerts
        );

        const hasMmaAlerts = sportId === 'mma' && (
          sportConfig.takedownAlerts ||
          sportConfig.submissionAlerts ||
          sportConfig.knockoutAlerts ||
          sportConfig.significantStrikesAlerts
        );

        const hasNascarAlerts = sportId === 'nascar' && (
          sportConfig.overtakeAlerts ||
          sportConfig.cautionAlerts ||
          sportConfig.pitStopAlerts ||
          sportConfig.leadChangeAlerts
        );

        const hasEsportsAlerts = sportId === 'esports' && (
          sportConfig.killAlerts ||
          sportConfig.deathAlerts ||
          sportConfig.assistAlerts ||
          sportConfig.multikillAlerts
        );

        const hasDartsAlerts = sportId === 'darts' && (
          sportConfig.bullseyeAlerts ||
          sportConfig.oneEightyAlerts ||
          sportConfig.finishAlerts ||
          sportConfig.checkoutAlerts ||
          sportConfig.ninedarterAlerts ||
          sportConfig.ton80Alerts ||
          sportConfig.highFinishAlerts
        );

        const hasTableTennisAlerts = sportId === 'tabletennis' && (
          sportConfig.aceAlerts ||
          sportConfig.letAlerts ||
          sportConfig.smasheAlerts
        );

        const hasVolleyballAlerts = sportId === 'volleyball' && (
          sportConfig.spikeAlerts ||
          sportConfig.blockAlerts ||
          sportConfig.serviceAlerts ||
          sportConfig.digAlerts
        );

        const hasHandballAlerts = sportId === 'handball' && (
          sportConfig.assistAlerts ||
          sportConfig.saveAlerts ||
          sportConfig.penaltyAlerts
        );

        const hasLacrosseAlerts = sportId === 'lacrosse' && (
          sportConfig.assistAlerts ||
          sportConfig.saveAlerts ||
          sportConfig.groundBallAlerts
        );

        // Check for generic and sport-specific patterns
        const hasSportSpecificAlerts = hasSoccerAlerts ||
                                     hasBasketballAlerts ||
                                     hasFootballAlerts ||
                                     hasBaseballAlerts ||
                                     hasHockeyAlerts ||
                                     hasTennisAlerts ||
                                     hasGolfAlerts ||
                                     hasBoxingAlerts ||
                                     hasCricketAlerts ||
                                     hasRugbyAlerts ||
                                     hasFormula1Alerts ||
                                     hasMmaAlerts ||
                                     hasNascarAlerts ||
                                     hasEsportsAlerts ||
                                     hasDartsAlerts ||
                                     hasTableTennisAlerts ||
                                     hasVolleyballAlerts ||
                                     hasHandballAlerts ||
                                     hasLacrosseAlerts;

        const hasCustomAlerts = sportConfig.customAlerts && sportConfig.customAlerts.length > 0 && 
                              sportConfig.customAlerts.some((alert: any) => alert.enabled);
        
        console.log(`${sportId} - Individual alerts:`, hasIndividualAlerts, 'Sport-specific alerts:', hasSportSpecificAlerts, 'Custom alerts:', hasCustomAlerts);
        
        // Check if sport is enabled but has no specific alerts selected
        // In this case, we should show a default "Sport Enabled" alert
        const sportEnabled = sportConfig.enabled;
        
        // Only proceed if this sport has any alerts configured OR is enabled
        if (!hasIndividualAlerts && !hasCustomAlerts && !hasSportSpecificAlerts && !sportEnabled) {
          console.log(`Skipping ${sportId} - no alerts configured and not enabled`);
          return; // Skip this sport entirely if no alerts are configured and not enabled
        }
        
        // If sport is enabled but no specific alerts are set, show a general "enabled" alert
        if (sportEnabled && !hasIndividualAlerts && !hasCustomAlerts && !hasSportSpecificAlerts) {
          alerts.push({
            id: `${sportId}-enabled`,
            sport: sportId,
            sportName,
            type: `${sportName} Enabled`,
            description: `You have ${sportName} configured. Go to settings to choose specific alerts.`,
            icon: '✅',
            enabled: true,
            isGeneral: true,
          });
        }
        
        // Get sport-specific alert mappings
        const getSportSpecificAlerts = (sportId: string, config: any) => {
          const alerts: any[] = [];
          
          // Universal alerts that apply to most sports
          if (config.goalAlerts) {
            const alertName = sportId === 'basketball' ? 'Points' : 
                            sportId === 'baseball' ? 'Runs' :
                            sportId === 'football' ? 'Touchdowns' :
                            sportId === 'hockey' ? 'Goals' :
                            sportId === 'golf' ? 'Birdies' :
                            sportId === 'tennis' ? 'Aces' :
                            sportId === 'cricket' ? 'Runs' :
                            sportId === 'rugby' ? 'Tries' :
                            sportId === 'boxing' ? 'Knockdowns' :
                            sportId === 'mma' ? 'Takedowns' :
                            sportId === 'nascar' ? 'Overtakes' :
                            sportId === 'formula1' ? 'Overtakes' :
                            sportId === 'tabletennis' ? 'Points' :
                            sportId === 'volleyball' ? 'Spikes' :
                            sportId === 'handball' ? 'Goals' :
                            sportId === 'darts' ? 'Bullseyes' :
                            sportId === 'lacrosse' ? 'Goals' :
                            sportId === 'esports' ? 'Kills' : 'Goals';
            
            alerts.push({
              id: `${sportId}-goals`,
              sport: sportId,
              sportName,
              type: alertName,
              description: `Get notified when ${alertName.toLowerCase()} are scored`,
              icon: '⚽',
              enabled: true,
            });
          }
          
          // Red cards / penalties
          if (config.redCardAlerts) {
            const alertName = sportId === 'basketball' ? 'Ejections' :
                            sportId === 'football' ? 'Ejections' :
                            sportId === 'hockey' ? 'Major Penalties' :
                            sportId === 'rugby' ? 'Red Cards' :
                            sportId === 'golf' ? 'Penalties' :
                            sportId === 'tennis' ? 'Code Violations' :
                            sportId === 'nascar' ? 'Black Flags' :
                            sportId === 'formula1' ? 'Penalties' :
                            'Red Cards';
            
            alerts.push({
              id: `${sportId}-red`,
              sport: sportId,
              sportName,
              type: alertName,
              description: `Get notified when ${alertName.toLowerCase()} occur`,
              icon: '🟥',
              enabled: true,
            });
          }
          
          // Yellow cards / warnings
          if (config.yellowCardAlerts) {
            const alertName = sportId === 'basketball' ? 'Technical Fouls' :
                            sportId === 'football' ? 'Penalties' :
                            sportId === 'hockey' ? 'Minor Penalties' :
                            sportId === 'tennis' ? 'Warnings' :
                            sportId === 'nascar' ? 'Cautions' :
                            sportId === 'formula1' ? 'Warnings' :
                            'Yellow Cards';
            
            alerts.push({
              id: `${sportId}-yellow`,
              sport: sportId,
              sportName,
              type: alertName,
              description: `Get notified when ${alertName.toLowerCase()} occur`,
              icon: '🟨',
              enabled: true,
            });
          }
          
          return alerts;
        };
        
        // Add sport-specific alerts
        const sportSpecificAlerts = getSportSpecificAlerts(sportId, sportConfig);
        alerts.push(...sportSpecificAlerts);
        
        // Add basketball-specific alerts
        if (sportId === 'basketball') {
          if (sportConfig.threepointAlerts) {
            alerts.push({
              id: `${sportId}-threepoint`,
              sport: sportId,
              sportName,
              type: 'Three-Pointers',
              description: 'Get notified when three-point shots are made',
              icon: '🏀',
              enabled: true,
            });
          }
          if (sportConfig.dunkAlerts) {
            alerts.push({
              id: `${sportId}-dunk`,
              sport: sportId,
              sportName,
              type: 'Dunks',
              description: 'Get notified when dunks are made',
              icon: '🔥',
              enabled: true,
            });
          }
          if (sportConfig.blockAlerts) {
            alerts.push({
              id: `${sportId}-block`,
              sport: sportId,
              sportName,
              type: 'Blocks',
              description: 'Get notified when blocks occur',
              icon: '🚫',
              enabled: true,
            });
          }
          if (sportConfig.stealAlerts) {
            alerts.push({
              id: `${sportId}-steal`,
              sport: sportId,
              sportName,
              type: 'Steals',
              description: 'Get notified when steals occur',
              icon: '🏃',
              enabled: true,
            });
          }
          if (sportConfig.reboundAlerts) {
            alerts.push({
              id: `${sportId}-rebound`,
              sport: sportId,
              sportName,
              type: 'Rebounds',
              description: 'Get notified when rebounds occur',
              icon: '🔄',
              enabled: true,
            });
          }
          if (sportConfig.assistAlerts) {
            alerts.push({
              id: `${sportId}-assist`,
              sport: sportId,
              sportName,
              type: 'Assists',
              description: 'Get notified when assists occur',
              icon: '🤝',
              enabled: true,
            });
          }
          if (sportConfig.doubleDoubleAlerts) {
            alerts.push({
              id: `${sportId}-doubledouble`,
              sport: sportId,
              sportName,
              type: 'Double-Doubles',
              description: 'Get notified when double-doubles are achieved',
              icon: '💪',
              enabled: true,
            });
          }
          if (sportConfig.tripleDoubleAlerts) {
            alerts.push({
              id: `${sportId}-tripledouble`,
              sport: sportId,
              sportName,
              type: 'Triple-Doubles',
              description: 'Get notified when triple-doubles are achieved',
              icon: '🌟',
              enabled: true,
            });
          }
        }
        
        // Add tennis-specific alerts
        if (sportId === 'tennis') {
          if (sportConfig.aceAlerts) {
            alerts.push({
              id: `${sportId}-ace`,
              sport: sportId,
              sportName,
              type: 'Aces',
              description: 'Get notified when aces are served',
              icon: '🎾',
              enabled: true,
            });
          }
          if (sportConfig.doubleFaultAlerts) {
            alerts.push({
              id: `${sportId}-doublefault`,
              sport: sportId,
              sportName,
              type: 'Double Faults',
              description: 'Get notified when double faults occur',
              icon: '❌',
              enabled: true,
            });
          }
          if (sportConfig.winnerAlerts) {
            alerts.push({
              id: `${sportId}-winner`,
              sport: sportId,
              sportName,
              type: 'Winners',
              description: 'Get notified when winners are hit',
              icon: '🏆',
              enabled: true,
            });
          }
          if (sportConfig.setAlerts) {
            alerts.push({
              id: `${sportId}-set`,
              sport: sportId,
              sportName,
              type: 'Sets Won',
              description: 'Get notified when sets are won',
              icon: '🎯',
              enabled: true,
            });
          }
          if (sportConfig.breakPointAlerts) {
            alerts.push({
              id: `${sportId}-breakpoint`,
              sport: sportId,
              sportName,
              type: 'Break Points',
              description: 'Get notified when break points occur',
              icon: '⚡',
              enabled: true,
            });
          }
          if (sportConfig.tiebreakAlerts) {
            alerts.push({
              id: `${sportId}-tiebreak`,
              sport: sportId,
              sportName,
              type: 'Tiebreaks',
              description: 'Get notified when tiebreaks start',
              icon: '🔥',
              enabled: true,
            });
          }
        }
        
        // Add golf-specific alerts
        if (sportId === 'golf') {
          if (sportConfig.birdieAlerts) {
            alerts.push({
              id: `${sportId}-birdie`,
              sport: sportId,
              sportName,
              type: 'Birdies',
              description: 'Get notified when birdies are scored',
              icon: '🐦',
              enabled: true,
            });
          }
          if (sportConfig.eagleAlerts) {
            alerts.push({
              id: `${sportId}-eagle`,
              sport: sportId,
              sportName,
              type: 'Eagles',
              description: 'Get notified when eagles are scored',
              icon: '🦅',
              enabled: true,
            });
          }
          if (sportConfig.holeInOneAlerts) {
            alerts.push({
              id: `${sportId}-holeinone`,
              sport: sportId,
              sportName,
              type: 'Hole-in-Ones',
              description: 'Get notified when hole-in-ones are scored',
              icon: '🎯',
              enabled: true,
            });
          }
          if (sportConfig.albatrossAlerts) {
            alerts.push({
              id: `${sportId}-albatross`,
              sport: sportId,
              sportName,
              type: 'Albatross',
              description: 'Get notified when albatross are scored',
              icon: '🪶',
              enabled: true,
            });
          }
        }
        
        // Add boxing-specific alerts
        if (sportId === 'boxing') {
          if (sportConfig.knockdownAlerts) {
            alerts.push({
              id: `${sportId}-knockdown`,
              sport: sportId,
              sportName,
              type: 'Knockdowns',
              description: 'Get notified when knockdowns occur',
              icon: '👊',
              enabled: true,
            });
          }
          if (sportConfig.knockoutAlerts) {
            alerts.push({
              id: `${sportId}-knockout`,
              sport: sportId,
              sportName,
              type: 'Knockouts',
              description: 'Get notified when knockouts occur',
              icon: '💥',
              enabled: true,
            });
          }
        }
        
        // Add cricket-specific alerts
        if (sportId === 'cricket') {
          if (sportConfig.sixAlerts) {
            alerts.push({
              id: `${sportId}-six`,
              sport: sportId,
              sportName,
              type: 'Sixes',
              description: 'Get notified when sixes are hit',
              icon: '🏏',
              enabled: true,
            });
          }
          if (sportConfig.wicketAlerts) {
            alerts.push({
              id: `${sportId}-wicket`,
              sport: sportId,
              sportName,
              type: 'Wickets',
              description: 'Get notified when wickets fall',
              icon: '🎯',
              enabled: true,
            });
          }
          if (sportConfig.centuryAlerts) {
            alerts.push({
              id: `${sportId}-century`,
              sport: sportId,
              sportName,
              type: 'Centuries',
              description: 'Get notified when centuries are scored',
              icon: '💯',
              enabled: true,
            });
          }
        }
        
        // Add formula1-specific alerts
        if (sportId === 'formula1') {
          if (sportConfig.overtakeAlerts) {
            alerts.push({
              id: `${sportId}-overtake`,
              sport: sportId,
              sportName,
              type: 'Overtakes',
              description: 'Get notified when overtakes occur',
              icon: '🏎️',
              enabled: true,
            });
          }
          if (sportConfig.pitStopAlerts) {
            alerts.push({
              id: `${sportId}-pitstop`,
              sport: sportId,
              sportName,
              type: 'Pit Stops',
              description: 'Get notified when pit stops happen',
              icon: '🔧',
              enabled: true,
            });
          }
          if (sportConfig.fastestLapAlerts) {
            alerts.push({
              id: `${sportId}-fastestlap`,
              sport: sportId,
              sportName,
              type: 'Fastest Laps',
              description: 'Get notified when fastest laps are set',
              icon: '⚡',
              enabled: true,
            });
          }
        }
        
        // Add darts-specific alerts
        if (sportId === 'darts') {
          if (sportConfig.bullseyeAlerts) {
            alerts.push({
              id: `${sportId}-bullseye`,
              sport: sportId,
              sportName,
              type: 'Bullseyes',
              description: 'Get notified when bullseyes are hit',
              icon: '🎯',
              enabled: true,
            });
          }
          if (sportConfig.oneEightyAlerts) {
            alerts.push({
              id: `${sportId}-180`,
              sport: sportId,
              sportName,
              type: '180s',
              description: 'Get notified when 180s are scored',
              icon: '🎯',
              enabled: true,
            });
          }
          if (sportConfig.ninedarterAlerts) {
            alerts.push({
              id: `${sportId}-ninedarter`,
              sport: sportId,
              sportName,
              type: '9-Darters',
              description: 'Get notified when 9-dart finishes occur',
              icon: '🏆',
              enabled: true,
            });
          }
        }
        
        // Additional sport-specific individual alerts not covered above
        if (sportConfig.freekickAlerts) {
          alerts.push({
            id: `${sportId}-freekick`,
            sport: sportId,
            sportName,
            type: 'Free Kicks',
            description: 'Get notified when free kicks are awarded',
            icon: '🦶',
            enabled: true,
          });
        }
        
        // Goal difference alerts
        if (sportConfig.goalDifferenceAlerts?.enabled) {
          alerts.push({
            id: `${sportId}-goal-difference`,
            sport: sportId,
            sportName,
            type: 'Goal Difference',
            description: `Get notified when score difference reaches ${sportConfig.goalDifferenceAlerts.threshold}+`,
            icon: '📊',
            enabled: true,
          });
        }
        
        // Late game alerts
        if (sportConfig.lateGameAlerts?.enabled) {
          alerts.push({
            id: `${sportId}-late-game`,
            sport: sportId,
            sportName,
            type: 'Late Game Events',
            description: `Get notified for events after minute ${sportConfig.lateGameAlerts.startMinute}`,
            icon: '⏱️',
            enabled: true,
          });
        }
        
        // Custom combined alerts - only enabled ones
        if (sportConfig.customAlerts && sportConfig.customAlerts.length > 0) {
          // Filter for enabled alerts only and remove duplicates based on summary
          const enabledCustomAlerts = sportConfig.customAlerts.filter((alert: any) => alert.enabled);
          const uniqueCustomAlerts = enabledCustomAlerts.filter((alert: any, index: number, self: any[]) => 
            index === self.findIndex((a: any) => 
              a.summary === alert.summary || 
              (a.name === alert.name && alert.name && alert.name !== 'Custom Alert 1' && alert.name !== 'Custom Combined Alert')
            )
          );
          
          uniqueCustomAlerts.forEach((customAlert: any, index: number) => {
            // Create unique ID using both sport, index, and first few characters of summary
            const summaryHash = customAlert.summary ? customAlert.summary.substring(0, 20).replace(/\s+/g, '') : '';
            const uniqueId = `${sportId}-custom-${customAlert.id || `${index}-${summaryHash}`}`;
            
            alerts.push({
              id: uniqueId,
              sport: sportId,
              sportName,
              type: customAlert.name || 'Custom Combined Alert',
              description: customAlert.summary || customAlert.description || 'Custom alert condition',
              icon: '🎯',
              enabled: true,
            });
          });
        }
        
        // Add basketball-specific alerts (only if enabled)
        if (sportId === 'basketball') {
          if (sportConfig.pointAlerts) {
            alerts.push({
              id: `${sportId}-points`,
              sport: sportId,
              sportName,
              type: 'Points Scored',
              description: 'Get notified when points are scored',
              icon: '🏀',
              enabled: true,
            });
          }
          
          if (sportConfig.threePointerAlerts) {
            alerts.push({
              id: `${sportId}-three-pointers`,
              sport: sportId,
              sportName,
              type: '3-Point Shots',
              description: 'Get notified when 3-point shots are made',
              icon: '🎯',
              enabled: true,
            });
          }
          
          if (sportConfig.freeThrowAlerts) {
            alerts.push({
              id: `${sportId}-free-throws`,
              sport: sportId,
              sportName,
              type: 'Free Throws',
              description: 'Get notified about free throw attempts',
              icon: '🆓',
              enabled: true,
            });
          }
          
          if (sportConfig.reboundAlerts) {
            alerts.push({
              id: `${sportId}-rebounds`,
              sport: sportId,
              sportName,
              type: 'Rebounds',
              description: 'Get notified when rebounds are grabbed',
              icon: '📈',
              enabled: true,
            });
          }
          
          if (sportConfig.assistAlerts) {
            alerts.push({
              id: `${sportId}-assists`,
              sport: sportId,
              sportName,
              type: 'Assists',
              description: 'Get notified when assists are made',
              icon: '🤝',
              enabled: true,
            });
          }
          
          if (sportConfig.stealAlerts) {
            alerts.push({
              id: `${sportId}-steals`,
              sport: sportId,
              sportName,
              type: 'Steals',
              description: 'Get notified when steals are made',
              icon: '👐',
              enabled: true,
            });
          }
          
          if (sportConfig.blockAlerts) {
            alerts.push({
              id: `${sportId}-blocks`,
              sport: sportId,
              sportName,
              type: 'Blocks',
              description: 'Get notified when shots are blocked',
              icon: '🚫',
              enabled: true,
            });
          }
          
          if (sportConfig.turnoverAlerts) {
            alerts.push({
              id: `${sportId}-turnovers`,
              sport: sportId,
              sportName,
              type: 'Turnovers',
              description: 'Get notified when turnovers occur',
              icon: '🔄',
              enabled: true,
            });
          }
          
          if (sportConfig.timeoutAlerts) {
            alerts.push({
              id: `${sportId}-timeouts`,
              sport: sportId,
              sportName,
              type: 'Timeouts',
              description: 'Get notified when timeouts are called',
              icon: '⏸️',
              enabled: true,
            });
          }
          
          if (sportConfig.foulAlerts) {
            alerts.push({
              id: `${sportId}-fouls`,
              sport: sportId,
              sportName,
              type: 'Personal Fouls',
              description: 'Get notified when personal fouls are committed',
              icon: '⚠️',
              enabled: true,
            });
          }
          
          if (sportConfig.pointDifferenceAlerts?.enabled) {
            alerts.push({
              id: `${sportId}-point-difference`,
              sport: sportId,
              sportName,
              type: 'Point Difference',
              description: `Get notified when point difference reaches ${sportConfig.pointDifferenceAlerts.threshold}+`,
              icon: '📊',
              enabled: true,
            });
          }
          
          if (sportConfig.overtimeAlerts) {
            alerts.push({
              id: `${sportId}-overtime`,
              sport: sportId,
              sportName,
              type: 'Overtime',
              description: 'Get notified when games go into overtime',
              icon: '⏰',
              enabled: true,
            });
          }
          
          if (sportConfig.technicalFoulAlerts) {
            alerts.push({
              id: `${sportId}-technical-foul`,
              sport: sportId,
              sportName,
              type: 'Technical Fouls',
              description: 'Get notified when technical fouls are called',
              icon: '🚨',
              enabled: true,
            });
          }
        }
        
        // Add football-specific alerts (only if enabled)
        if (sportId === 'football') {
          if (sportConfig.touchdownAlerts) {
            alerts.push({
              id: `${sportId}-touchdown`,
              sport: sportId,
              sportName,
              type: 'Touchdowns',
              description: 'Get notified when touchdowns are scored',
              icon: '🏈',
              enabled: true,
            });
          }
          
          if (sportConfig.fieldGoalAlerts) {
            alerts.push({
              id: `${sportId}-field-goal`,
              sport: sportId,
              sportName,
              type: 'Field Goals',
              description: 'Get notified when field goals are scored',
              icon: '🥅',
              enabled: true,
            });
          }
          
          if (sportConfig.interceptionsAlerts) {
            alerts.push({
              id: `${sportId}-interceptions`,
              sport: sportId,
              sportName,
              type: 'Interceptions',
              description: 'Get notified when interceptions occur',
              icon: '🛡️',
              enabled: true,
            });
          }
          
          if (sportConfig.runDifferenceAlerts?.enabled) {
            alerts.push({
              id: `${sportId}-run-difference`,
              sport: sportId,
              sportName,
              type: 'Run Difference',
              description: `Get notified when run difference reaches ${sportConfig.runDifferenceAlerts.threshold}+`,
              icon: '📊',
              enabled: true,
            });
          }
        }
        
        // Add Tennis-specific alerts
        if (sportId === 'tennis') {
          if (sportConfig.aceAlerts) {
            alerts.push({
              id: `${sportId}-aces`,
              sport: sportId,
              sportName,
              type: 'Aces',
              description: 'Get notified when aces are served',
              icon: '🎾',
              enabled: true,
            });
          }
          
          if (sportConfig.doubleFaultAlerts) {
            alerts.push({
              id: `${sportId}-double-faults`,
              sport: sportId,
              sportName,
              type: 'Double Faults',
              description: 'Get notified when double faults occur',
              icon: '⚠️',
              enabled: true,
            });
          }
          
          if (sportConfig.winnerAlerts) {
            alerts.push({
              id: `${sportId}-winners`,
              sport: sportId,
              sportName,
              type: 'Winners',
              description: 'Get notified when winners are hit',
              icon: '🏆',
              enabled: true,
            });
          }
          
          if (sportConfig.unforceErrorAlerts) {
            alerts.push({
              id: `${sportId}-unforced-errors`,
              sport: sportId,
              sportName,
              type: 'Unforced Errors',
              description: 'Get notified when unforced errors occur',
              icon: '❌',
              enabled: true,
            });
          }
          
          if (sportConfig.breakPointAlerts) {
            alerts.push({
              id: `${sportId}-break-points`,
              sport: sportId,
              sportName,
              type: 'Break Points',
              description: 'Get notified about break point opportunities',
              icon: '💥',
              enabled: true,
            });
          }
          
          if (sportConfig.setAlerts) {
            alerts.push({
              id: `${sportId}-sets`,
              sport: sportId,
              sportName,
              type: 'Sets Won',
              description: 'Get notified when sets are won',
              icon: '📊',
              enabled: true,
            });
          }
          
          if (sportConfig.netPointAlerts) {
            alerts.push({
              id: `${sportId}-net-points`,
              sport: sportId,
              sportName,
              type: 'Net Points',
              description: 'Get notified about net point plays',
              icon: '🕸️',
              enabled: true,
            });
          }
          
          if (sportConfig.longRallyAlerts) {
            alerts.push({
              id: `${sportId}-long-rallies`,
              sport: sportId,
              sportName,
              type: 'Long Rallies',
              description: 'Get notified about extended rallies',
              icon: '🔄',
              enabled: true,
            });
          }
          
          if (sportConfig.challengeAlerts) {
            alerts.push({
              id: `${sportId}-challenges`,
              sport: sportId,
              sportName,
              type: 'Challenges',
              description: 'Get notified when challenges are made',
              icon: '🔍',
              enabled: true,
            });
          }
          
          if (sportConfig.tiebreakAlerts) {
            alerts.push({
              id: `${sportId}-tiebreaks`,
              sport: sportId,
              sportName,
              type: 'Tiebreaks',
              description: 'Get notified when tiebreaks occur',
              icon: '🔗',
              enabled: true,
            });
          }
        }
        
        // Add Golf-specific alerts
        if (sportId === 'golf') {
          if (sportConfig.birdieAlerts) {
            alerts.push({
              id: `${sportId}-birdies`,
              sport: sportId,
              sportName,
              type: 'Birdies',
              description: 'Get notified when birdies are scored',
              icon: '🐦',
              enabled: true,
            });
          }
          
          if (sportConfig.eagleAlerts) {
            alerts.push({
              id: `${sportId}-eagles`,
              sport: sportId,
              sportName,
              type: 'Eagles',
              description: 'Get notified when eagles are scored',
              icon: '🦅',
              enabled: true,
            });
          }
          
          if (sportConfig.albatrossAlerts) {
            alerts.push({
              id: `${sportId}-albatrosses`,
              sport: sportId,
              sportName,
              type: 'Albatrosses',
              description: 'Get notified when albatrosses are scored',
              icon: '🏌️‍♂️',
              enabled: true,
            });
          }
          
          if (sportConfig.holeInOneAlerts) {
            alerts.push({
              id: `${sportId}-hole-in-one`,
              sport: sportId,
              sportName,
              type: 'Hole in One',
              description: 'Get notified when holes-in-one are scored',
              icon: '🕳️',
              enabled: true,
            });
          }
          
          if (sportConfig.bogeyAlerts) {
            alerts.push({
              id: `${sportId}-bogeys`,
              sport: sportId,
              sportName,
              type: 'Bogeys',
              description: 'Get notified when bogeys are scored',
              icon: '😕',
              enabled: true,
            });
          }
          
          if (sportConfig.doubleBogeyAlerts) {
            alerts.push({
              id: `${sportId}-double-bogeys`,
              sport: sportId,
              sportName,
              type: 'Double Bogeys',
              description: 'Get notified when double bogeys are scored',
              icon: '😰',
              enabled: true,
            });
          }
          
          if (sportConfig.chipInAlerts) {
            alerts.push({
              id: `${sportId}-chip-ins`,
              sport: sportId,
              sportName,
              type: 'Chip-ins',
              description: 'Get notified when chip-ins are made',
              icon: '🎯',
              enabled: true,
            });
          }
          
          if (sportConfig.longPuttAlerts) {
            alerts.push({
              id: `${sportId}-long-putts`,
              sport: sportId,
              sportName,
              type: 'Long Putts',
              description: 'Get notified when long putts are made',
              icon: '🏌️',
              enabled: true,
            });
          }
          
          if (sportConfig.sandSaveAlerts) {
            alerts.push({
              id: `${sportId}-sand-saves`,
              sport: sportId,
              sportName,
              type: 'Sand Saves',
              description: 'Get notified when sand saves are made',
              icon: '🏖️',
              enabled: true,
            });
          }
          
          if (sportConfig.penaltyAlerts) {
            alerts.push({
              id: `${sportId}-penalties`,
              sport: sportId,
              sportName,
              type: 'Penalties',
              description: 'Get notified when penalties occur',
              icon: '⚠️',
              enabled: true,
            });
          }
        }
        
        // Add Cricket-specific alerts
        if (sportId === 'cricket') {
          if (sportConfig.boundaryAlerts) {
            alerts.push({
              id: `${sportId}-boundaries`,
              sport: sportId,
              sportName,
              type: 'Boundaries',
              description: 'Get notified when boundaries are hit',
              icon: '🏏',
              enabled: true,
            });
          }
          
          if (sportConfig.sixAlerts) {
            alerts.push({
              id: `${sportId}-sixes`,
              sport: sportId,
              sportName,
              type: 'Sixes',
              description: 'Get notified when sixes are hit',
              icon: '6️⃣',
              enabled: true,
            });
          }
          
          if (sportConfig.wicketAlerts) {
            alerts.push({
              id: `${sportId}-wickets`,
              sport: sportId,
              sportName,
              type: 'Wickets',
              description: 'Get notified when wickets fall',
              icon: '🎯',
              enabled: true,
            });
          }
          
          if (sportConfig.centuryAlerts) {
            alerts.push({
              id: `${sportId}-centuries`,
              sport: sportId,
              sportName,
              type: 'Centuries',
              description: 'Get notified when centuries are scored',
              icon: '💯',
              enabled: true,
            });
          }
          
          if (sportConfig.fiftyAlerts) {
            alerts.push({
              id: `${sportId}-fifties`,
              sport: sportId,
              sportName,
              type: 'Fifties',
              description: 'Get notified when fifties are scored',
              icon: '5️⃣',
              enabled: true,
            });
          }
          
          if (sportConfig.catchAlerts) {
            alerts.push({
              id: `${sportId}-catches`,
              sport: sportId,
              sportName,
              type: 'Catches',
              description: 'Get notified when catches are taken',
              icon: '🧤',
              enabled: true,
            });
          }
          
          if (sportConfig.runoutAlerts) {
            alerts.push({
              id: `${sportId}-runouts`,
              sport: sportId,
              sportName,
              type: 'Run Outs',
              description: 'Get notified when run outs occur',
              icon: '🏃‍♂️',
              enabled: true,
            });
          }
          
          if (sportConfig.lbwAlerts) {
            alerts.push({
              id: `${sportId}-lbws`,
              sport: sportId,
              sportName,
              type: 'LBW',
              description: 'Get notified when LBW dismissals occur',
              icon: '🦵',
              enabled: true,
            });
          }
          
          if (sportConfig.maidenAlerts) {
            alerts.push({
              id: `${sportId}-maidens`,
              sport: sportId,
              sportName,
              type: 'Maiden Overs',
              description: 'Get notified when maiden overs are bowled',
              icon: '0️⃣',
              enabled: true,
            });
          }
          
          if (sportConfig.partnershipAlerts) {
            alerts.push({
              id: `${sportId}-partnerships`,
              sport: sportId,
              sportName,
              type: 'Partnerships',
              description: 'Get notified about significant partnerships',
              icon: '🤝',
              enabled: true,
            });
          }
          
          if (sportConfig.appealAlerts) {
            alerts.push({
              id: `${sportId}-appeals`,
              sport: sportId,
              sportName,
              type: 'Appeals',
              description: 'Get notified when appeals are made',
              icon: '🙋‍♂️',
              enabled: true,
            });
          }
        }
        
        // Add Baseball-specific alerts
        if (sportId === 'baseball') {
          console.log('🏈 Generating baseball alerts...', sportConfig);
          if (sportConfig.homeRunAlerts) {
            console.log('🏈 Adding home run alert');
            alerts.push({
              id: `${sportId}-home-runs`,
              sport: sportId,
              sportName,
              type: 'Home Runs',
              description: 'Get notified when home runs are hit',
              icon: '⚾',
              enabled: true,
            });
          }
          
          if (sportConfig.hitAlerts) {
            alerts.push({
              id: `${sportId}-hits`,
              sport: sportId,
              sportName,
              type: 'Hits',
              description: 'Get notified when hits are made',
              icon: '🏏',
              enabled: true,
            });
          }
          
          if (sportConfig.strikeoutAlerts) {
            alerts.push({
              id: `${sportId}-strikeouts`,
              sport: sportId,
              sportName,
              type: 'Strikeouts',
              description: 'Get notified when strikeouts occur',
              icon: '❌',
              enabled: true,
            });
          }
          
          if (sportConfig.walkAlerts) {
            alerts.push({
              id: `${sportId}-walks`,
              sport: sportId,
              sportName,
              type: 'Walks',
              description: 'Get notified when walks are issued',
              icon: '🚶‍♂️',
              enabled: true,
            });
          }
          
          if (sportConfig.doubleAlerts) {
            alerts.push({
              id: `${sportId}-doubles`,
              sport: sportId,
              sportName,
              type: 'Doubles',
              description: 'Get notified when doubles are hit',
              icon: '2️⃣',
              enabled: true,
            });
          }
          
          if (sportConfig.tripleAlerts) {
            alerts.push({
              id: `${sportId}-triples`,
              sport: sportId,
              sportName,
              type: 'Triples',
              description: 'Get notified when triples are hit',
              icon: '3️⃣',
              enabled: true,
            });
          }
          
          if (sportConfig.rbiAlerts) {
            alerts.push({
              id: `${sportId}-rbis`,
              sport: sportId,
              sportName,
              type: 'RBIs',
              description: 'Get notified about runs batted in',
              icon: '🏃‍♂️',
              enabled: true,
            });
          }
          
          if (sportConfig.stolenBaseAlerts) {
            alerts.push({
              id: `${sportId}-stolen-bases`,
              sport: sportId,
              sportName,
              type: 'Stolen Bases',
              description: 'Get notified when bases are stolen',
              icon: '💨',
              enabled: true,
            });
          }
          
          if (sportConfig.errorAlerts) {
            alerts.push({
              id: `${sportId}-errors`,
              sport: sportId,
              sportName,
              type: 'Errors',
              description: 'Get notified when fielding errors occur',
              icon: '🤦‍♂️',
              enabled: true,
            });
          }
          
          if (sportConfig.runAlerts) {
            alerts.push({
              id: `${sportId}-runs`,
              sport: sportId,
              sportName,
              type: 'Runs',
              description: 'Get notified when runs are scored',
              icon: '🏠',
              enabled: true,
            });
          }
        }
        
        // Add Hockey-specific alerts
        if (sportId === 'hockey') {
          console.log('🏒 Generating hockey alerts...', sportConfig);
          if (sportConfig.assistAlerts) {
            console.log('🏒 Adding assist alert');
            alerts.push({
              id: `${sportId}-assists`,
              sport: sportId,
              sportName,
              type: 'Assists',
              description: 'Get notified when assists are made',
              icon: '🤝',
              enabled: true,
            });
          }
          
          if (sportConfig.penaltyAlerts) {
            alerts.push({
              id: `${sportId}-penalties`,
              sport: sportId,
              sportName,
              type: 'Penalties',
              description: 'Get notified when penalties occur',
              icon: '🚨',
              enabled: true,
            });
          }
          
          if (sportConfig.saveAlerts) {
            alerts.push({
              id: `${sportId}-saves`,
              sport: sportId,
              sportName,
              type: 'Saves',
              description: 'Get notified when saves are made',
              icon: '🥅',
              enabled: true,
            });
          }
          
          if (sportConfig.shotAlerts) {
            alerts.push({
              id: `${sportId}-shots`,
              sport: sportId,
              sportName,
              type: 'Shots',
              description: 'Get notified about shots on goal',
              icon: '🏒',
              enabled: true,
            });
          }
          
          if (sportConfig.powerPlayAlerts) {
            alerts.push({
              id: `${sportId}-power-plays`,
              sport: sportId,
              sportName,
              type: 'Power Plays',
              description: 'Get notified about power play opportunities',
              icon: '⚡',
              enabled: true,
            });
          }
          
          if (sportConfig.shortHandedAlerts) {
            alerts.push({
              id: `${sportId}-short-handed`,
              sport: sportId,
              sportName,
              type: 'Short Handed',
              description: 'Get notified about short-handed situations',
              icon: '🔽',
              enabled: true,
            });
          }
          
          if (sportConfig.faceoffAlerts) {
            alerts.push({
              id: `${sportId}-faceoffs`,
              sport: sportId,
              sportName,
              type: 'Faceoffs',
              description: 'Get notified about important faceoffs',
              icon: '⚫',
              enabled: true,
            });
          }
          
          if (sportConfig.hitAlerts) {
            alerts.push({
              id: `${sportId}-hits`,
              sport: sportId,
              sportName,
              type: 'Hits',
              description: 'Get notified when hits are made',
              icon: '💥',
              enabled: true,
            });
          }
          
          if (sportConfig.blockAlerts) {
            alerts.push({
              id: `${sportId}-blocks`,
              sport: sportId,
              sportName,
              type: 'Blocks',
              description: 'Get notified when shots are blocked',
              icon: '🛡️',
              enabled: true,
            });
          }
        }
        
        // Add custom alerts
        if (sportConfig.customAlerts && sportConfig.customAlerts.length > 0) {
          sportConfig.customAlerts.forEach((customAlert: any, index: number) => {
            if (customAlert.enabled) {
              alerts.push({
                id: `${sportId}-custom-${customAlert.id}`,
                sport: sportId,
                sportName,
                type: customAlert.name || `Custom Alert ${index + 1}`,
                description: customAlert.summary || 'Custom combined alert',
                icon: '🎯',
                enabled: true,
                isCustom: true,
              });
            }
          });
        }
        
        // No longer showing separate league cards - leagues are shown within alert buttons
      }
    });
    
    // Final deduplication of the entire alerts array to catch any remaining duplicates
    const finalUniqueAlerts = alerts.filter((alert, index, self) => 
      index === self.findIndex((a) => 
        a.description === alert.description && a.sport === alert.sport
      )
    );
    
    console.log('🎯 Final alerts array:', finalUniqueAlerts);
    console.log('🎯 Total alerts count:', finalUniqueAlerts.length);
    
    return finalUniqueAlerts;
  };

  const configuredAlerts = getConfiguredAlerts();
  
  console.log('🚨 Component level - configuredAlerts:', configuredAlerts);
  console.log('🚨 Component level - configuredAlerts.length:', configuredAlerts.length);

  const deleteAlert = async (alertId: string) => {
    const alertParts = alertId.split('-');
    const sportId = alertParts[0];
    const alertType = alertParts[1];
    
    try {
      if (alertType === 'leagues') {
        // Delete league preferences
        localStorage.removeItem(`${sportId}_leagues`);
      } else if (alertType === 'enabled') {
        // Delete entire sport configuration when deleting the general "enabled" alert
        localStorage.removeItem(`${sportId}_alerts`);
        localStorage.removeItem(`${sportId}_leagues`);
      } else if (alertType === 'custom') {
        // Handle custom alert deletion
        const customAlertId = alertParts[2]; // Get the custom alert ID
        const alertData = localStorage.getItem(`${sportId}_alerts`);
        if (alertData) {
          const sportConfig = JSON.parse(alertData);
          if (sportConfig.customAlerts) {
            // Remove the specific custom alert
            sportConfig.customAlerts = sportConfig.customAlerts.filter((alert: any) => alert.id !== customAlertId);
            localStorage.setItem(`${sportId}_alerts`, JSON.stringify(sportConfig));
          }
        }
      } else {
        // Update alert preferences in localStorage
        const alertData = localStorage.getItem(`${sportId}_alerts`);
        if (alertData) {
          const sportConfig = JSON.parse(alertData);
          
          // Comprehensive alert type mapping for ALL 19 sports
          const alertFieldMapping: { [key: string]: string } = {
            // Universal alerts
            'goals': 'goalAlerts',
            'red': 'redCardAlerts', 
            'yellow': 'yellowCardAlerts',
            'freekick': 'freekickAlerts',
            
            // Soccer-specific
            'corners': 'cornerAlerts',
            'offsides': 'offsidesAlerts',
            'penalties': 'penaltyAlerts',
            'assists': 'assistAlerts',
            'saves': 'saveAlerts',
            'substitutions': 'substitutionAlerts',
            
            // Basketball-specific
            'points': 'pointAlerts',
            'three-pointers': 'threePointerAlerts',
            'free-throws': 'freeThrowAlerts',
            'rebounds': 'reboundAlerts',
            'steals': 'stealAlerts',
            'blocks': 'blockAlerts',
            'turnovers': 'turnoverAlerts',
            'timeouts': 'timeoutAlerts',
            'fouls': 'foulAlerts',
            'technical': 'technicalFoulAlerts',
            'overtime': 'overtimeAlerts',
            
            // Football-specific
            'touchdowns': 'touchdownAlerts',
            'field': 'fieldGoalAlerts',
            'interceptions': 'interceptionAlerts',
            'fumbles': 'fumbleAlerts',
            'sacks': 'sackAlerts',
            'safeties': 'safetyAlerts',
            'first': 'firstDownAlerts',
            
            // Baseball-specific
            'home': 'homeRunAlerts',
            'hits': 'hitAlerts',
            'strikeouts': 'strikeoutAlerts',
            'walks': 'walkAlerts',
            'doubles': 'doubleAlerts',
            'triples': 'tripleAlerts',
            'rbis': 'rbiAlerts',
            'stolen': 'stolenBaseAlerts',
            'errors': 'errorAlerts',
            'runs': 'runAlerts',
            
            // Hockey-specific
            'shots': 'shotAlerts',
            'power': 'powerPlayAlerts',
            'short': 'shortHandedAlerts',
            'faceoffs': 'faceoffAlerts',
            
            // Tennis-specific
            'aces': 'aceAlerts',
            'double': 'doubleFaultAlerts',
            'winners': 'winnerAlerts',
            'unforced': 'unforceErrorAlerts',
            'break': 'breakPointAlerts',
            'sets': 'setAlerts',
            'net': 'netPointAlerts',
            'long': 'longRallyAlerts',
            'challenges': 'challengeAlerts',
            'tiebreaks': 'tiebreakAlerts',
            
            // Golf-specific
            'birdies': 'birdieAlerts',
            'eagles': 'eagleAlerts',
            'albatrosses': 'albatrossAlerts',
            'hole': 'holeInOneAlerts',
            'bogeys': 'bogeyAlerts',
            'chip': 'chipInAlerts',
            'putts': 'longPuttAlerts',
            'sand': 'sandSaveAlerts',
            
            // Boxing-specific
            'knockdowns': 'knockdownAlerts',
            'knockouts': 'knockoutAlerts',
            'judges': 'jdAlerts',
            'ko': 'technicalKoAlerts',
            'punch': 'punchStatsAlerts',
            
            // Cricket-specific
            'boundaries': 'boundaryAlerts',
            'sixes': 'sixAlerts',
            'wickets': 'wicketAlerts',
            'centuries': 'centuryAlerts',
            'fifties': 'fiftyAlerts',
            'catches': 'catchAlerts',
            'runouts': 'runoutAlerts',
            'lbws': 'lbwAlerts',
            'maidens': 'maidenAlerts',
            'partnerships': 'partnershipAlerts',
            'appeals': 'appealAlerts',
            
            // Rugby-specific
            'tries': 'tryAlerts',
            'conversions': 'conversionAlerts',
            'penalty': 'penaltyGoalAlerts',
            'drop': 'dropGoalAlerts',
            'scrums': 'scumAlerts',
            
            // Formula1-specific
            'overtakes': 'overtakeAlerts',
            'pit': 'pitStopAlerts',
            'crashes': 'crashAlerts',
            'fastest': 'fastestLapAlerts',
            'drs': 'drsAlerts',
            'safety': 'safetyCarAlerts',
            'retirements': 'retirementAlerts',
            'podium': 'podiumChangeAlerts',
            'weather': 'weatherChangeAlerts',
            
            // MMA-specific
            'takedowns': 'takedownAlerts',
            'submissions': 'submissionAlerts',
            'strikes': 'significantStrikesAlerts',
            
            // NASCAR-specific
            'cautions': 'cautionAlerts',
            'lead': 'leadChangeAlerts',
            
            // Esports-specific
            'kills': 'killAlerts',
            'deaths': 'deathAlerts',
            'multikills': 'multikillAlerts',
            
            // Darts-specific
            'bullseyes': 'bullseyeAlerts',
            'oneighty': 'oneEightyAlerts',
            'finishes': 'finishAlerts',
            'checkouts': 'checkoutAlerts',
            'ninedarter': 'ninedarterAlerts',
            'ton80': 'ton80Alerts',
            'high': 'highFinishAlerts',
            
            // Table Tennis-specific
            'lets': 'letAlerts',
            'smashes': 'smasheAlerts',
            
            // Volleyball-specific
            'spikes': 'spikeAlerts',
            'services': 'serviceAlerts',
            'digs': 'digAlerts',
            
            // Handball-specific
            'ground': 'groundBallAlerts',
            
            // Lacrosse-specific
            // (uses common fields like assists, saves, etc.)
          };
          
          // Special handling for complex alerts
          const complexAlerts: { [key: string]: (config: any) => void } = {
            'goal': (config) => {
              if (config.goalDifferenceAlerts) {
                config.goalDifferenceAlerts.enabled = false;
              }
            },
            'late': (config) => {
              if (config.lateGameAlerts) {
                config.lateGameAlerts.enabled = false;
              }
            },
            'point': (config) => {
              if (config.pointDifferenceAlerts) {
                config.pointDifferenceAlerts.enabled = false;
              }
            },
            'run': (config) => {
              if (config.runDifferenceAlerts) {
                config.runDifferenceAlerts.enabled = false;
              }
            }
          };
          
          // Try to handle complex alerts first
          if (complexAlerts[alertType]) {
            complexAlerts[alertType](sportConfig);
          } else if (alertFieldMapping[alertType]) {
            // Handle simple boolean alerts
            sportConfig[alertFieldMapping[alertType]] = false;
          } else {
            // Fallback: try to find the field by pattern matching
            const possibleFields = Object.keys(sportConfig).filter(key => 
              key.toLowerCase().includes(alertType.toLowerCase()) && 
              key !== 'enabled' && key !== 'customAlerts'
            );
            
            if (possibleFields.length > 0) {
              const field = possibleFields[0];
              if (typeof sportConfig[field] === 'boolean') {
                sportConfig[field] = false;
              } else if (typeof sportConfig[field] === 'object' && sportConfig[field]?.enabled !== undefined) {
                sportConfig[field].enabled = false;
              }
            }
          }
          
          localStorage.setItem(`${sportId}_alerts`, JSON.stringify(sportConfig));
        }
      }
      
      toast({
        title: "Alert deleted",
        description: "Your alert has been removed successfully",
      });
      
      // Trigger a re-render by updating a dummy state or force refresh
      window.location.reload();
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete alert. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-6 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Configured Alerts</h1>
          <p className="text-sm text-muted-foreground">
            Manage your configured notifications
          </p>
        </div>
        <Button
          onClick={() => setLocation('/sport-selection')}
          size="sm"
          className="bg-[hsl(var(--sky-blue))] hover:bg-[hsl(var(--claret))]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Sport
        </Button>
      </div>

      {configuredAlerts.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts configured</h3>
          <p className="text-gray-500 mb-6">
            Set up your first sport alerts to get started
          </p>
          <Button 
            onClick={() => setLocation('/sport-selection')}
            className="bg-[hsl(var(--sky-blue))] hover:bg-[hsl(var(--claret))]"
          >
            Configure Sports
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Group alerts by sport */}
          {Object.entries(
            configuredAlerts.reduce((groups: Record<string, any[]>, alert: any) => {
              if (!groups[alert.sport]) {
                groups[alert.sport] = [];
              }
              groups[alert.sport].push(alert);
              return groups;
            }, {} as Record<string, any[]>)
          ).map(([sportId, sportAlerts]: [string, any[]]) => (
            <Card key={sportId} className="border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{getSportDisplayName(sportId)}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation(`/alert-setup/${sportId}`)}
                    className="border-[hsl(var(--sky-blue))] text-[hsl(var(--sky-blue))] hover:bg-[hsl(var(--sky-blue))] hover:text-white"
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {sportAlerts.map((alert: any) => {
                  // Get league data for this sport to show in buttons
                  const leagueData = localStorage.getItem(`${alert.sport}_leagues`);
                  const leagues = leagueData ? JSON.parse(leagueData) : {};
                  const hasAllLeagues = leagues.all === true;
                  
                  // Get selected leagues (excluding 'all' key) and their display names
                  const selectedLeagueKeys = Object.entries(leagues)
                    .filter(([key, value]) => key !== 'all' && value === true)
                    .map(([key]) => key);
                  
                  // Convert league keys to display names using sportLeagues data
                  const sportData = getSportLeagues(alert.sport);
                  const getLeagueDisplayName = (leagueKey: string) => {
                    // Check popular leagues first
                    const popularLeague = sportData.popular.find((league: any) => 
                      league.id.toLowerCase() === leagueKey.toLowerCase()
                    );
                    if (popularLeague) return popularLeague.name;
                    
                    // Check all leagues by country
                    for (const countryLeagues of Object.values(sportData.all)) {
                      const league = (countryLeagues as any[]).find((league: any) => 
                        league.id.toLowerCase() === leagueKey.toLowerCase()
                      );
                      if (league) return league.name;
                    }
                    
                    // Fallback to formatted key
                    return leagueKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  };
                  
                  const selectedLeagues = selectedLeagueKeys.map(getLeagueDisplayName);
                  
                  return (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${
                        alert.isLeague ? 'bg-blue-50 border-blue-200' :
                        alert.enabled ? 'bg-green-50 border-green-200' : 
                        'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      {/* Main alert info */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{alert.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm">{alert.type}</h4>
                              {!alert.isLeague && (
                                <Badge variant={alert.enabled ? "default" : "secondary"} className="text-xs">
                                  {alert.enabled ? "ON" : "OFF"}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">{alert.description}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAlert(alert.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* LEAGUES and INDIVIDUAL TEAMS buttons - only show for non-league alerts */}
                      {!alert.isLeague && (
                        <div className="flex gap-2 mt-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-6 px-2"
                              >
                                LEAGUES ({hasAllLeagues ? 'ALL' : selectedLeagues.length})
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Leagues for {alert.type}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-2">
                                {hasAllLeagues ? (
                                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="font-medium text-blue-900">ALL LEAGUES</p>
                                    <p className="text-sm text-blue-700">This alert applies to all leagues in {alert.sportName}</p>
                                  </div>
                                ) : selectedLeagues.length > 0 ? (
                                  selectedLeagues.map((league, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                                      <p className="text-sm font-medium">{league}</p>
                                      {/* Only show delete button if there's more than one league */}
                                      {selectedLeagues.length > 1 && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => deleteLeagueFromAlert(alert.id, league)}
                                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <p className="text-yellow-800">No leagues selected</p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-6 px-2"
                              >
                                INDIVIDUAL TEAMS (0)
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Individual Teams for {alert.type}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-2">
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                  <p className="text-gray-600">No individual teams selected</p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    Individual team selection will be available in alert configuration
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}