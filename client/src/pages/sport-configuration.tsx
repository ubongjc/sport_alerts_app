import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Bell, ArrowLeft, ArrowRight, ArrowDown } from "lucide-react";
import { getSportDisplayName, getSportAlertOptions, getSportLeagues, League } from "@/data/sportLeagues";
import { useToast } from "@/hooks/use-toast";

interface AlertState {
  [key: string]: boolean;
}

interface ThresholdState {
  [key: string]: number;
}

interface CustomAlert {
  id: string;
  name: string;
  enabled: boolean;
  conditions: Array<{
    eventType: string;
    team: string;
    threshold: number;
    comparison: string;
  }>;
  operator: string;
  summary: string;
}

export default function SportConfiguration() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const params = useParams();
  
  // Get current sport from URL or default to soccer
  const currentSport = params.sport || 'soccer';
  
  // Load selected sports from localStorage
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [currentSportIndex, setCurrentSportIndex] = useState(0);
  
  // Alert states
  const [selectedAlerts, setSelectedAlerts] = useState<AlertState>({});
  const [thresholds, setThresholds] = useState<ThresholdState>({});
  const [customAlerts, setCustomAlerts] = useState<CustomAlert[]>([]);
  
  // League states
  const [selectedLeagues, setSelectedLeagues] = useState<{[key: string]: boolean}>({});
  const [allLeaguesSelected, setAllLeaguesSelected] = useState(false);
  
  // Team states (placeholder for now)
  const [selectedTeams, setSelectedTeams] = useState<{[key: string]: boolean}>({});
  
  // Load selected sports and find current sport index
  useEffect(() => {
    const multiSportFlow = localStorage.getItem('multiSportFlow');
    if (multiSportFlow) {
      const flowData = JSON.parse(multiSportFlow);
      const sports = flowData.sports || [];
      setSelectedSports(sports);
      
      const index = sports.indexOf(currentSport);
      if (index !== -1) {
        setCurrentSportIndex(index);
      }
    }
  }, [currentSport]);

  // Load existing alerts for current sport
  useEffect(() => {
    const alertData = localStorage.getItem(`${currentSport}_alerts`);
    let alerts: AlertState = {};
    
    if (alertData) {
      const sportConfig = JSON.parse(alertData);
      
      // Load alert selections
      const alertOptions = getSportAlertOptions(currentSport);
      alertOptions.forEach(option => {
        alerts[option.id] = sportConfig[`${option.id}Alerts`] || false;
      });
      setSelectedAlerts(alerts);
      
      // Load thresholds
      const thresholdData: ThresholdState = {};
      if (sportConfig.goalDifferenceAlerts) {
        thresholdData.goalDifference = sportConfig.goalDifferenceAlerts.threshold || 2;
      }
      if (sportConfig.lateGameAlerts) {
        thresholdData.lateGame = sportConfig.lateGameAlerts.startMinute || 85;
      }
      setThresholds(thresholdData);
      
      // Load custom alerts
      setCustomAlerts(sportConfig.customAlerts || []);
    } else {
      // Reset to defaults
      setSelectedAlerts({});
      setThresholds({});
      setCustomAlerts([]);
    }
    
    // Load existing leagues for current sport only if alerts are selected
    const leagueData = localStorage.getItem(`${currentSport}_leagues`);
    const hasAnyAlertsSelected = Object.values(alerts).some(Boolean) || (alertData && JSON.parse(alertData).customAlerts?.length > 0);
    
    if (leagueData && hasAnyAlertsSelected) {
      const leagues = JSON.parse(leagueData);
      setSelectedLeagues(leagues);
      setAllLeaguesSelected(leagues.all === true);
    } else {
      setSelectedLeagues({});
      setAllLeaguesSelected(false);
    }
  }, [currentSport]);

  const toggleAlert = (alertId: string) => {
    setSelectedAlerts(prev => ({
      ...prev,
      [alertId]: !prev[alertId]
    }));
  };

  const toggleAllLeagues = () => {
    const newAllSelected = !allLeaguesSelected;
    setAllLeaguesSelected(newAllSelected);
    
    if (newAllSelected) {
      setSelectedLeagues({ all: true });
    } else {
      setSelectedLeagues({});
    }
  };

  const toggleLeague = (leagueId: string) => {
    if (allLeaguesSelected) {
      // If "All" was selected, unselect it and start fresh
      setAllLeaguesSelected(false);
      setSelectedLeagues({ [leagueId]: true });
    } else {
      setSelectedLeagues(prev => ({
        ...prev,
        [leagueId]: !prev[leagueId]
      }));
    }
  };

  const addCustomAlert = () => {
    const alertOptions = getSportAlertOptions(currentSport);
    const newAlert: CustomAlert = {
      id: `alert${Date.now()}`,
      name: `Custom Alert ${customAlerts.length + 1}`,
      enabled: true,
      conditions: [{
        eventType: alertOptions[0]?.id || 'goals',
        team: 'any',
        threshold: 1,
        comparison: 'greaterThan'
      }],
      operator: 'AND',
      summary: `Either Team ${alertOptions[0]?.label || 'Events'} is greater than or equal to 1`
    };
    setCustomAlerts([...customAlerts, newAlert]);
  };

  const addConditionToAlert = (alertId: string) => {
    const alertOptions = getSportAlertOptions(currentSport);
    const newCondition = {
      eventType: alertOptions[0]?.id || 'goals',
      team: 'any',
      threshold: 1,
      comparison: 'greaterThan'
    };
    
    setCustomAlerts(customAlerts.map(alert => {
      if (alert.id === alertId) {
        const updatedConditions = [...alert.conditions, newCondition];
        return {
          ...alert,
          conditions: updatedConditions,
          summary: generateAlertSummary(updatedConditions, alert.operator)
        };
      }
      return alert;
    }));
  };

  const removeConditionFromAlert = (alertId: string, conditionIndex: number) => {
    setCustomAlerts(customAlerts.map(alert => {
      if (alert.id === alertId && alert.conditions.length > 1) {
        const updatedConditions = alert.conditions.filter((_, index) => index !== conditionIndex);
        return {
          ...alert,
          conditions: updatedConditions,
          summary: generateAlertSummary(updatedConditions, alert.operator)
        };
      }
      return alert;
    }));
  };

  const updateCondition = (alertId: string, conditionIndex: number, updates: any) => {
    setCustomAlerts(customAlerts.map(alert => {
      if (alert.id === alertId) {
        const updatedConditions = alert.conditions.map((condition, index) => 
          index === conditionIndex ? { ...condition, ...updates } : condition
        );
        return {
          ...alert,
          conditions: updatedConditions,
          summary: generateAlertSummary(updatedConditions, alert.operator)
        };
      }
      return alert;
    }));
  };

  const generateAlertSummary = (conditions: any[], operator: string) => {
    const conditionTexts = conditions.map(condition => {
      const alertOptions = getSportAlertOptions(currentSport);
      const eventLabel = alertOptions.find(opt => opt.id === condition.eventType)?.label || condition.eventType;
      const teamText = condition.team === 'any' ? 'Either Team' : condition.team === 'home' ? 'Home Team' : 'Away Team';
      const comparisonText = condition.comparison === 'greaterThan' ? 'is greater than or equal to' : 'is equal to';
      return `${teamText} ${eventLabel} ${comparisonText} ${condition.threshold}`;
    });
    
    return conditionTexts.join(` ${operator} `);
  };

  const removeCustomAlert = (id: string) => {
    setCustomAlerts(customAlerts.filter(alert => alert.id !== id));
  };

  const updateCustomAlert = (id: string, updates: Partial<CustomAlert>) => {
    setCustomAlerts(customAlerts.map(alert => {
      if (alert.id === id) {
        const updatedAlert = { ...alert, ...updates };
        // Regenerate summary if operator changed
        if (updates.operator) {
          updatedAlert.summary = generateAlertSummary(updatedAlert.conditions, updatedAlert.operator);
        }
        return updatedAlert;
      }
      return alert;
    }));
  };

  const saveCurrentSportConfig = () => {
    // Skip if no alerts are selected
    if (!Object.values(selectedAlerts).some(Boolean) && !customAlerts.some(alert => alert.enabled)) {
      return;
    }

    // Get existing preferences
    const existingPreferences = JSON.parse(localStorage.getItem('alertPreferences') || '{}');
    
    // Deduplicate custom alerts before saving
    const uniqueCustomAlerts = customAlerts.filter((alert, index, self) => 
      index === self.findIndex((a) => a.summary === alert.summary || (a.id === alert.id && alert.id))
    );

    // Create alert config with sport-specific mappings
    const alertConfig: any = {
      enabled: true,
      customAlerts: uniqueCustomAlerts
    };

    // Map generic alerts
    alertConfig.goalAlerts = selectedAlerts.goals || false;
    alertConfig.redCardAlerts = selectedAlerts.redCards || false;
    alertConfig.yellowCardAlerts = selectedAlerts.yellowCards || false;
    alertConfig.freekickAlerts = selectedAlerts.freekicks || false;
    
    // Goal/Point difference alerts
    alertConfig.goalDifferenceAlerts = {
      enabled: selectedAlerts.goalDifference || false,
      threshold: thresholds.goalDifference || 2,
      targetTeam: 'any',
    };
    
    alertConfig.halfTimeFullTimeAlerts = selectedAlerts.halftime || false;
    alertConfig.lateGameAlerts = {
      enabled: selectedAlerts.lateGame || false,
      startMinute: thresholds.lateGame || 85,
    };

    // Sport-specific alert mappings
    if (currentSport === 'basketball') {
      alertConfig.pointAlerts = selectedAlerts.points || false;
      alertConfig.threePointerAlerts = selectedAlerts.threePointers || false;
      alertConfig.freeThrowAlerts = selectedAlerts.freeThrows || false;
      alertConfig.reboundAlerts = selectedAlerts.rebounds || false;
      alertConfig.assistAlerts = selectedAlerts.assists || false;
      alertConfig.stealAlerts = selectedAlerts.steals || false;
      alertConfig.blockAlerts = selectedAlerts.blocks || false;
      alertConfig.turnoverAlerts = selectedAlerts.turnovers || false;
      alertConfig.timeoutAlerts = selectedAlerts.timeouts || false;
      alertConfig.foulAlerts = selectedAlerts.fouls || false;
      alertConfig.pointDifferenceAlerts = selectedAlerts.pointDifference ? {
        enabled: true,
        threshold: thresholds.pointDifference || 15,
      } : { enabled: false };
      alertConfig.overtimeAlerts = selectedAlerts.overtime || false;
      alertConfig.technicalFoulAlerts = selectedAlerts.technicalFoul || false;
    } else if (currentSport === 'football') {
      alertConfig.touchdownAlerts = selectedAlerts.touchdowns || false;
      alertConfig.fieldGoalAlerts = selectedAlerts.fieldGoals || false;
      alertConfig.interceptionAlerts = selectedAlerts.interceptions || false;
      alertConfig.fumbleAlerts = selectedAlerts.fumbles || false;
      alertConfig.sackAlerts = selectedAlerts.sacks || false;
      alertConfig.penaltyAlerts = selectedAlerts.penalties || false;
      alertConfig.safetyAlerts = selectedAlerts.safeties || false;
      alertConfig.firstDownAlerts = selectedAlerts.firstDowns || false;
    } else if (currentSport === 'baseball') {
      alertConfig.homeRunAlerts = selectedAlerts.homeRuns || false;
      alertConfig.hitAlerts = selectedAlerts.hits || false;
      alertConfig.strikeoutAlerts = selectedAlerts.strikeouts || false;
      alertConfig.walkAlerts = selectedAlerts.walks || false;
      alertConfig.doubleAlerts = selectedAlerts.doubles || false;
      alertConfig.tripleAlerts = selectedAlerts.triples || false;
      alertConfig.rbiAlerts = selectedAlerts.rbis || false;
      alertConfig.stolenBaseAlerts = selectedAlerts.stolenBases || false;
      alertConfig.errorAlerts = selectedAlerts.errors || false;
      alertConfig.runAlerts = selectedAlerts.runs || false;
    } else if (currentSport === 'hockey') {
      alertConfig.assistAlerts = selectedAlerts.assists || false;
      alertConfig.penaltyAlerts = selectedAlerts.penalties || false;
      alertConfig.saveAlerts = selectedAlerts.saves || false;
      alertConfig.shotAlerts = selectedAlerts.shots || false;
      alertConfig.powerPlayAlerts = selectedAlerts.powerPlays || false;
      alertConfig.shortHandedAlerts = selectedAlerts.shortHanded || false;
      alertConfig.faceoffAlerts = selectedAlerts.faceoffs || false;
      alertConfig.hitAlerts = selectedAlerts.hits || false;
      alertConfig.blockAlerts = selectedAlerts.blocks || false;
    } else if (currentSport === 'tennis') {
      alertConfig.aceAlerts = selectedAlerts.aces || false;
      alertConfig.doubleFaultAlerts = selectedAlerts.doubleFaults || false;
      alertConfig.winnerAlerts = selectedAlerts.winners || false;
      alertConfig.unforceErrorAlerts = selectedAlerts.unforced || false; // Fix field name
      alertConfig.breakPointAlerts = selectedAlerts.breakPoints || false;
      alertConfig.setAlerts = selectedAlerts.setWins || false; // Fix field name
      alertConfig.netPointAlerts = selectedAlerts.netPoints || false;
      alertConfig.longRallyAlerts = selectedAlerts.longRallies || false;
      alertConfig.challengeAlerts = selectedAlerts.challenges || false;
      alertConfig.tiebreakAlerts = selectedAlerts.tiebreaks || false;
    } else if (currentSport === 'golf') {
      alertConfig.birdieAlerts = selectedAlerts.birdies || false;
      alertConfig.eagleAlerts = selectedAlerts.eagles || false;
      alertConfig.albatrossAlerts = selectedAlerts.albatross || false;
      alertConfig.holeInOneAlerts = selectedAlerts.holeinone || false; // Fix field name
      alertConfig.bogeyAlerts = selectedAlerts.bogeys || false;
      alertConfig.doubleBogeyAlerts = selectedAlerts.doubleBogeys || false;
      alertConfig.chipInAlerts = selectedAlerts.chipins || false; // Add missing alerts
      alertConfig.longPuttAlerts = selectedAlerts.longputts || false;
      alertConfig.sandSaveAlerts = selectedAlerts.sandsaves || false;
      alertConfig.penaltyAlerts = selectedAlerts.penalties || false;
    } else if (currentSport === 'boxing') {
      alertConfig.knockdownAlerts = selectedAlerts.knockdowns || false;
      alertConfig.knockoutAlerts = selectedAlerts.knockouts || false;
      alertConfig.jdAlerts = selectedAlerts.judgeDecisions || false;
      alertConfig.technicalKoAlerts = selectedAlerts.technicalKOs || false;
      alertConfig.punchStatsAlerts = selectedAlerts.punchStats || false;
    } else if (currentSport === 'cricket') {
      alertConfig.boundaryAlerts = selectedAlerts.boundaries || false;
      alertConfig.sixAlerts = selectedAlerts.sixes || false; 
      alertConfig.wicketAlerts = selectedAlerts.wickets || false;
      alertConfig.centuryAlerts = selectedAlerts.centuries || false;
      alertConfig.fiftyAlerts = selectedAlerts.fifties || false;
      alertConfig.catchAlerts = selectedAlerts.catches || false; // Add missing
      alertConfig.runoutAlerts = selectedAlerts.runouts || false;
      alertConfig.lbwAlerts = selectedAlerts.lbws || false;
      alertConfig.maidenAlerts = selectedAlerts.maidens || false;
      alertConfig.partnershipAlerts = selectedAlerts.partnerships || false;
      alertConfig.appealAlerts = selectedAlerts.appeals || false;
    } else if (currentSport === 'rugby') {
      alertConfig.tryAlerts = selectedAlerts.tries || false;
      alertConfig.conversionAlerts = selectedAlerts.conversions || false;
      alertConfig.penaltyGoalAlerts = selectedAlerts.penaltyGoals || false;
      alertConfig.dropGoalAlerts = selectedAlerts.dropGoals || false;
      alertConfig.scumAlerts = selectedAlerts.scrums || false;
    } else if (currentSport === 'formula1') {
      alertConfig.overtakeAlerts = selectedAlerts.overtakes || false;
      alertConfig.pitStopAlerts = selectedAlerts.pitStops || false;
      alertConfig.crashAlerts = selectedAlerts.crashes || false;
      alertConfig.fastestLapAlerts = selectedAlerts.lapRecords || false; // Fix field name
      alertConfig.drsAlerts = selectedAlerts.drs || false;
      alertConfig.safetyCarAlerts = selectedAlerts.safetyCar || false; // Add missing
      alertConfig.penaltyAlerts = selectedAlerts.penalties || false;
      alertConfig.retirementAlerts = selectedAlerts.retirements || false;
      alertConfig.podiumChangeAlerts = selectedAlerts.podiumChanges || false;
      alertConfig.weatherChangeAlerts = selectedAlerts.weatherChanges || false;
    } else if (currentSport === 'mma') {
      alertConfig.takedownAlerts = selectedAlerts.takedowns || false;
      alertConfig.submissionAlerts = selectedAlerts.submissions || false;
      alertConfig.knockoutAlerts = selectedAlerts.knockouts || false;
      alertConfig.significantStrikesAlerts = selectedAlerts.significantStrikes || false;
    } else if (currentSport === 'nascar') {
      alertConfig.overtakeAlerts = selectedAlerts.overtakes || false;
      alertConfig.cautionAlerts = selectedAlerts.cautions || false;
      alertConfig.pitStopAlerts = selectedAlerts.pitStops || false;
      alertConfig.leadChangeAlerts = selectedAlerts.leadChanges || false;
    } else if (currentSport === 'esports') {
      alertConfig.killAlerts = selectedAlerts.kills || false;
      alertConfig.deathAlerts = selectedAlerts.deaths || false;
      alertConfig.assistAlerts = selectedAlerts.assists || false;
      alertConfig.multikillAlerts = selectedAlerts.multikills || false;
    } else if (currentSport === 'darts') {
      alertConfig.bullseyeAlerts = selectedAlerts.bullseyes || false;
      alertConfig.oneEightyAlerts = selectedAlerts.maximums || false; // Fix field name based on alert options
      alertConfig.finishAlerts = selectedAlerts.finishes || false;
      alertConfig.checkoutAlerts = selectedAlerts.checkouts || false;
      alertConfig.ninedarterAlerts = selectedAlerts.ninedarter || false; // Add missing alerts  
      alertConfig.ton80Alerts = selectedAlerts.ton80 || false;
      alertConfig.highFinishAlerts = selectedAlerts.highfinish || false;
    } else if (currentSport === 'tabletennis') {
      alertConfig.aceAlerts = selectedAlerts.aces || false;
      alertConfig.letAlerts = selectedAlerts.lets || false;
      alertConfig.smasheAlerts = selectedAlerts.smashes || false;
    } else if (currentSport === 'volleyball') {
      alertConfig.spikeAlerts = selectedAlerts.spikes || false;
      alertConfig.blockAlerts = selectedAlerts.blocks || false;
      alertConfig.serviceAlerts = selectedAlerts.services || false;
      alertConfig.digAlerts = selectedAlerts.digs || false;
    } else if (currentSport === 'handball') {
      alertConfig.assistAlerts = selectedAlerts.assists || false;
      alertConfig.saveAlerts = selectedAlerts.saves || false;
      alertConfig.penaltyAlerts = selectedAlerts.penalties || false;
    } else if (currentSport === 'lacrosse') {
      alertConfig.assistAlerts = selectedAlerts.assists || false;
      alertConfig.saveAlerts = selectedAlerts.saves || false;
      alertConfig.groundBallAlerts = selectedAlerts.groundBalls || false;
    }
    
    // Generic fallbacks for other properties
    alertConfig.runDifferenceAlerts = selectedAlerts.runDifference ? {
      enabled: true,
      threshold: thresholds.runDifference || 3,
    } : { enabled: false };

    // Handle league selection - default to "All Leagues" if none selected
    let finalLeagues: string[] = [];
    const hasSpecificLeagues = Object.keys(selectedLeagues).some(key => selectedLeagues[key]);
    
    if (allLeaguesSelected || !hasSpecificLeagues) {
      finalLeagues = ["All Leagues"];
    } else {
      finalLeagues = Object.keys(selectedLeagues).filter(key => selectedLeagues[key]);
    }

    // Create unique alert signature for merging logic
    const alertSignature = JSON.stringify({
      sport: currentSport,
      alerts: Object.keys(selectedAlerts).filter(key => selectedAlerts[key]),
      thresholds: thresholds,
      customAlerts: uniqueCustomAlerts.map(a => a.summary)
    });

    // Find existing alert with same configuration
    const existingAlertKey = Object.keys(existingPreferences).find(key => {
      const existing = existingPreferences[key];
      if (!existing || key.split('-')[0] !== currentSport) return false;
      
      const existingSignature = JSON.stringify({
        sport: currentSport,
        alerts: Object.keys(existing).filter(key => 
          existing[key] === true || 
          (typeof existing[key] === 'object' && existing[key]?.enabled === true)
        ).filter(key => key !== 'leagues' && key !== 'enabled'),
        thresholds: Object.fromEntries(
          Object.entries(existing).filter(([key, value]) => 
            typeof value === 'object' && value !== null && 'threshold' in value
          ).map(([key, value]) => [key, (value as any).threshold])
        ),
        customAlerts: (existing.customAlerts || []).map((a: any) => a.summary)
      });
      
      return existingSignature === alertSignature;
    });

    if (existingAlertKey) {
      // Same alert configuration exists, merge leagues
      const existing = existingPreferences[existingAlertKey];
      const existingLeagues = existing.leagues || [];
      const mergedLeagues = Array.from(new Set([...existingLeagues, ...finalLeagues]));
      
      existingPreferences[existingAlertKey].leagues = mergedLeagues;
      
      toast({
        title: "Leagues added",
        description: `Added new leagues to existing ${getSportDisplayName(currentSport)} alert.`,
        variant: "default",
      });
    } else {
      // New unique alert configuration
      const newAlertId = `${currentSport}-${Date.now()}`;
      alertConfig.leagues = finalLeagues;
      existingPreferences[newAlertId] = alertConfig;
      
      toast({
        title: "New alert created",
        description: `Created new ${getSportDisplayName(currentSport)} alert configuration.`,
        variant: "default",
      });
    }

    // Save to localStorage
    localStorage.setItem('alertPreferences', JSON.stringify(existingPreferences));
    
    console.log(`Saved configuration for ${currentSport}`);
  };

  const goToNextSport = () => {
    saveCurrentSportConfig();
    
    if (currentSportIndex < selectedSports.length - 1) {
      // Go to next sport
      const nextSport = selectedSports[currentSportIndex + 1];
      setLocation(`/sport-configuration/${nextSport}`);
    } else {
      // All sports configured, go to live matches
      toast({
        title: "Configuration Complete!",
        description: "All your sports alerts have been set up successfully.",
      });
      setLocation('/live-matches');
    }
  };

  const goToPreviousSport = () => {
    saveCurrentSportConfig();
    
    if (currentSportIndex > 0) {
      // Go to previous sport
      const prevSport = selectedSports[currentSportIndex - 1];
      setLocation(`/sport-configuration/${prevSport}`);
    } else {
      // Go back to sport selection
      setLocation('/sport-selection');
    }
  };

  const sportData = getSportLeagues(currentSport);
  const alertOptions = getSportAlertOptions(currentSport);

  return (
    <>
      {/* Header */}
      <header className="bg-[hsl(var(--sky-blue))] text-white p-4 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousSport}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold">{getSportDisplayName(currentSport)} Setup</h1>
            <p className="text-sm opacity-90">
              Step {currentSportIndex + 1} of {selectedSports.length}
            </p>
          </div>
          <div className="w-16"></div> {/* Spacer */}
        </div>
        
        {/* Progress indicator */}
        <div className="flex justify-center items-center gap-1">
          {selectedSports.map((sport, index) => (
            <div 
              key={sport}
              className={`h-2 rounded-full ${
                index === currentSportIndex 
                  ? 'bg-white w-6' 
                  : index < currentSportIndex 
                    ? 'bg-white/70 w-4' 
                    : 'bg-white/30 w-4'
              }`}
            />
          ))}
        </div>
      </header>

      {/* Compact Guidance Message */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mx-4 mt-4">
        <div className="flex items-center">
          <ArrowDown className="h-4 w-4 text-blue-600 mr-2" />
          <p className="text-sm text-blue-800">
            <span className="font-medium">Select alerts below to continue.</span> 
            {" "}League and team selection will appear once you enable at least one alert.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4 pb-24 space-y-6">
        
        {/* Custom Combined Alerts Section - Move to top */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Custom Combined Alerts
            </CardTitle>
            <p className="text-sm text-gray-600">
              Create complex alerts by combining multiple conditions
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {customAlerts.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-3">No custom alerts created yet</p>
                <Button onClick={addCustomAlert} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Alert
                </Button>
              </div>
            ) : (
              <>
                {customAlerts.map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={alert.enabled}
                          onCheckedChange={(enabled) => updateCustomAlert(alert.id, { enabled })}
                        />
                        <div className="flex-1">
                          <Input
                            value={alert.name}
                            onChange={(e) => updateCustomAlert(alert.id, { name: e.target.value })}
                            className="text-base font-medium border-none p-0 h-auto bg-transparent"
                            placeholder="Alert Name"
                          />
                          <p className="text-sm text-gray-500 mt-1">{alert.summary}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => removeCustomAlert(alert.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Conditions Builder */}
                    <div className="space-y-3 mt-4">
                      <Label className="text-sm font-medium">Conditions</Label>
                      {alert.conditions.map((condition, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <Select 
                            value={condition.eventType} 
                            onValueChange={(value) => updateCondition(alert.id, index, { eventType: value })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getSportAlertOptions(currentSport).map(option => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select 
                            value={condition.team} 
                            onValueChange={(value) => updateCondition(alert.id, index, { team: value })}
                          >
                            <SelectTrigger className="w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Either Team</SelectItem>
                              <SelectItem value="home">Home Team</SelectItem>
                              <SelectItem value="away">Away Team</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select 
                            value={condition.comparison} 
                            onValueChange={(value) => updateCondition(alert.id, index, { comparison: value })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="greaterThan">≥</SelectItem>
                              <SelectItem value="equalTo">=</SelectItem>
                            </SelectContent>
                          </Select>

                          <Input
                            type="number"
                            min="1"
                            value={condition.threshold}
                            onChange={(e) => updateCondition(alert.id, index, { threshold: parseInt(e.target.value) || 1 })}
                            className="w-16"
                          />

                          {alert.conditions.length > 1 && (
                            <Button
                              onClick={() => removeConditionFromAlert(alert.id, index)}
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))}

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => addConditionToAlert(alert.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Condition
                        </Button>
                        
                        <Select 
                          value={alert.operator} 
                          onValueChange={(value) => updateCustomAlert(alert.id, { operator: value })}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AND">AND</SelectItem>
                            <SelectItem value="OR">OR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
                <Button onClick={addCustomAlert} variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Custom Alert
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Alert Preferences Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Alert Preferences
            </CardTitle>
            <p className="text-sm text-gray-600">
              Choose which events you want to be notified about
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {alertOptions.map((alert) => (
              <div key={alert.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 flex-1">
                    <Label className="text-base font-medium">{alert.label}</Label>
                    <p className="text-sm text-gray-500">{alert.description}</p>
                  </div>
                  <Switch
                    checked={selectedAlerts[alert.id] || false}
                    onCheckedChange={() => toggleAlert(alert.id)}
                  />
                </div>
                
                {/* Threshold input for applicable alerts */}
                {(alert as any).thresholdLabel && selectedAlerts[alert.id] && (
                  <div className="ml-4 mt-2">
                    <Label className="text-sm text-gray-600">{(alert as any).thresholdLabel}</Label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={thresholds[alert.id] || (alert.id.includes('Difference') ? 2 : 85)}
                      onChange={(e) => setThresholds(prev => ({
                        ...prev,
                        [alert.id]: parseInt(e.target.value) || 1
                      }))}
                      className="w-20 h-8 mt-1"
                    />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Helpful message when no alerts are selected */}
        {!Object.values(selectedAlerts).some(Boolean) && customAlerts.length === 0 && (
          <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
            <CardContent className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Select alerts to continue</h3>
              <p className="text-sm text-gray-500">
                Choose which {getSportDisplayName(currentSport).toLowerCase()} events you want to be notified about above, then select your preferred leagues below.
              </p>
            </CardContent>
          </Card>
        )}



        {/* Information message when no alerts are selected */}
        {!Object.values(selectedAlerts).some(Boolean) && !customAlerts.some(alert => alert.enabled) && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <ArrowDown className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-blue-800 font-medium">Select alerts above to continue</p>
                <p className="text-blue-600 text-sm">
                  League and team selection will appear below once you enable at least one alert
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* League & Team Selection - Only show if any alerts are selected */}
        {(Object.values(selectedAlerts).some(Boolean) || customAlerts.some(alert => alert.enabled)) && (
          <div className="space-y-6">
            <Separator />
            
            {/* Leagues Section */}
            <Card>
              <CardHeader>
                <CardTitle>League Selection</CardTitle>
                <p className="text-sm text-gray-600">
                  Choose which leagues to follow for your alerts
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* All Leagues Option */}
                <div className="flex items-center space-x-3 p-4 border rounded-lg bg-blue-50">
                  <Checkbox
                    id="all-leagues"
                    checked={allLeaguesSelected}
                    onCheckedChange={toggleAllLeagues}
                  />
                  <Label htmlFor="all-leagues" className="text-base font-medium">
                    All Leagues
                  </Label>
                </div>

                {!allLeaguesSelected && (
                  <>
                    {/* Popular Leagues */}
                    <div>
                      <h4 className="text-base font-medium mb-3">Popular Leagues</h4>
                      <div className="space-y-3">
                        {sportData.popular.map((league) => (
                          <div key={league.id} className="flex items-center space-x-3">
                            <Checkbox
                              id={league.id}
                              checked={selectedLeagues[league.id] || false}
                              onCheckedChange={() => toggleLeague(league.id)}
                            />
                            <Label htmlFor={league.id} className="text-sm">
                              {league.name} ({league.country})
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* All Leagues by Country */}
                    <div>
                      <h4 className="text-base font-medium mb-3">All Leagues</h4>
                      <div className="space-y-4 max-h-60 overflow-y-auto">
                        {Object.entries(sportData.all).map(([country, leagues]) => (
                          <div key={country}>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">{country}</h5>
                            <div className="space-y-2 ml-4">
                              {leagues.map((league: League) => (
                                <div key={league.id} className="flex items-center space-x-3">
                                  <Checkbox
                                    id={league.id}
                                    checked={selectedLeagues[league.id] || false}
                                    onCheckedChange={() => toggleLeague(league.id)}
                                  />
                                  <Label htmlFor={league.id} className="text-sm">
                                    {league.name}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Teams Section */}
            <Card>
              <CardHeader>
                <CardTitle>Individual Teams (Optional)</CardTitle>
                <p className="text-sm text-gray-600">
                  Select specific teams within your chosen leagues
                </p>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-gray-50 rounded-lg border text-center">
                  <p className="text-base text-gray-600">
                    Team selection will be available after choosing leagues
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    By default, alerts apply to all teams in selected leagues
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex gap-4 max-w-md mx-auto">
          <Button 
            onClick={goToPreviousSport}
            variant="outline"
            className="flex-1 border-[hsl(var(--sky-blue))] text-[hsl(var(--sky-blue))] hover:bg-[hsl(var(--claret))] hover:text-white"
            disabled={currentSportIndex === 0}
          >
            Previous
          </Button>
          
          <Button 
            onClick={goToNextSport}
            className="flex-1 bg-[hsl(var(--sky-blue))] hover:bg-[hsl(var(--claret))]"
          >
            {currentSportIndex < selectedSports.length - 1 ? (
              <>
                Next Sport
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            ) : (
              'Complete Setup'
            )}
          </Button>
        </div>
      </div>
    </>
  );
}