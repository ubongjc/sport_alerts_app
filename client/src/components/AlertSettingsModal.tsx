import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAlertPreferences } from "@/hooks/useAlerts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertPreferencesData } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AlertSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlertSettingsModal = ({ isOpen, onClose }: AlertSettingsModalProps) => {
  const { preferences, updatePreferences, isLoading } = useAlertPreferences();
  const { toast } = useToast();
  
  // Create a local state copy of the preferences
  const [localPrefs, setLocalPrefs] = useState<AlertPreferencesData>({
    goalAlerts: preferences?.goalAlerts || false,
    redCardAlerts: preferences?.redCardAlerts || false,
    yellowCardAlerts: preferences?.yellowCardAlerts || false,
    goalDifferenceAlerts: {
      enabled: preferences?.goalDifferenceAlerts?.enabled || false,
      threshold: preferences?.goalDifferenceAlerts?.threshold || 2,
      targetTeam: preferences?.goalDifferenceAlerts?.targetTeam || 'any'
    },
    halfTimeFullTimeAlerts: preferences?.halfTimeFullTimeAlerts || false,
    leagues: preferences?.leagues || {
      premierLeague: true,
      laLiga: true,
      serieA: true,
      bundesliga: true,
      ligue1: true
    },
    sports: preferences?.sports || {
      soccer: true,
      basketball: false,
      football: false,
      baseball: false,
      hockey: false,
      rugby: false,
      formula1: false
    },
    lateGameAlerts: preferences?.lateGameAlerts || {
      enabled: false,
      startMinute: 85
    },
    customAlerts: preferences?.customAlerts || []
  });
  
  // Goal difference threshold options
  const [goalDiffThreshold, setGoalDiffThreshold] = useState<string>(
    localPrefs.goalDifferenceAlerts.threshold?.toString() || "2"
  );
  
  const handleSave = async () => {
    try {
      // Process goal difference based on the threshold
      const updatedPrefs = {
        ...localPrefs,
        goalDifferenceAlerts: {
          enabled: localPrefs.goalDifferenceAlerts.enabled,
          threshold: parseInt(goalDiffThreshold),
          targetTeam: localPrefs.goalDifferenceAlerts.targetTeam
        }
      };
      
      await updatePreferences(updatedPrefs);
      toast({
        title: "Preferences Updated",
        description: "Your alert settings have been saved successfully.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update alert preferences. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleToggle = (key: keyof AlertPreferencesData, value: boolean) => {
    setLocalPrefs(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alert Settings</DialogTitle>
          <DialogDescription>
            Choose which alerts you'd like to receive
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="mt-2">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="sports">Sports</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          {/* Basic Alerts Tab */}
          <TabsContent value="basic" className="py-2 space-y-4">
            {/* Goal Alerts */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="goal-alerts" className="font-medium">Goal Alerts</Label>
                <p className="text-sm text-gray-500">Notify when goals are scored</p>
              </div>
              <Switch 
                id="goal-alerts" 
                checked={localPrefs.goalAlerts}
                onCheckedChange={(checked) => handleToggle('goalAlerts', checked)}
              />
            </div>
            
            {/* Red Card Alerts */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="red-card-alerts" className="font-medium">Red Card Alerts</Label>
                <p className="text-sm text-gray-500">Notify for red cards</p>
              </div>
              <Switch 
                id="red-card-alerts" 
                checked={localPrefs.redCardAlerts}
                onCheckedChange={(checked) => handleToggle('redCardAlerts', checked)}
              />
            </div>
            
            {/* Yellow Card Alerts */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="yellow-card-alerts" className="font-medium">Yellow Card Alerts</Label>
                <p className="text-sm text-gray-500">Notify for yellow cards</p>
              </div>
              <Switch 
                id="yellow-card-alerts" 
                checked={localPrefs.yellowCardAlerts}
                onCheckedChange={(checked) => handleToggle('yellowCardAlerts', checked)}
              />
            </div>
            
            {/* Goal Difference Alerts */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="goal-diff-alerts" className="font-medium">Goal Difference</Label>
                  <p className="text-sm text-gray-500">Notify when a team takes a lead</p>
                </div>
                <Switch 
                  id="goal-diff-alerts" 
                  checked={localPrefs.goalDifferenceAlerts.enabled}
                  onCheckedChange={(checked) => {
                    setLocalPrefs(prev => ({
                      ...prev,
                      goalDifferenceAlerts: {
                        ...prev.goalDifferenceAlerts,
                        enabled: checked
                      }
                    }));
                  }}
                />
              </div>
              
              {/* Goal Difference Threshold */}
              {localPrefs.goalDifferenceAlerts.enabled && (
                <div className="flex items-center mt-2 pl-6">
                  <Label htmlFor="goal-diff-threshold" className="mr-2 text-sm">
                    Minimum difference:
                  </Label>
                  <Select 
                    value={goalDiffThreshold} 
                    onValueChange={setGoalDiffThreshold}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 goal</SelectItem>
                      <SelectItem value="2">2 goals</SelectItem>
                      <SelectItem value="3">3+ goals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            {/* Half-time/Full-time Alerts */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="halftime-alerts" className="font-medium">Match Time Alerts</Label>
                <p className="text-sm text-gray-500">Notify at half-time and full-time</p>
              </div>
              <Switch 
                id="halftime-alerts" 
                checked={localPrefs.halfTimeFullTimeAlerts}
                onCheckedChange={(checked) => handleToggle('halfTimeFullTimeAlerts', checked)}
              />
            </div>
            
            {/* Late Game Alerts */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="late-game-alerts" className="font-medium">Late Game Alerts</Label>
                <p className="text-sm text-gray-500">Notify for events after the 85th minute</p>
              </div>
              <Switch 
                id="late-game-alerts" 
                checked={localPrefs.lateGameAlerts.enabled}
                onCheckedChange={(checked) => {
                  setLocalPrefs(prev => ({
                    ...prev,
                    lateGameAlerts: {
                      ...prev.lateGameAlerts,
                      enabled: checked
                    }
                  }));
                }}
              />
            </div>
          </TabsContent>
          
          {/* Sports Tab */}
          <TabsContent value="sports" className="py-2 space-y-4">
            <div className="mb-2 text-sm text-gray-500">
              Choose which sports you want to follow
            </div>
            
            {/* Soccer */}
            <div className="flex items-center justify-between">
              <Label htmlFor="sport-soccer" className="font-medium">Soccer</Label>
              <Switch 
                id="sport-soccer" 
                checked={localPrefs.sports.soccer}
                onCheckedChange={(checked) => {
                  setLocalPrefs(prev => ({
                    ...prev,
                    sports: {
                      ...prev.sports,
                      soccer: checked
                    }
                  }));
                }}
              />
            </div>
            
            {/* Basketball */}
            <div className="flex items-center justify-between">
              <Label htmlFor="sport-basketball" className="font-medium">Basketball</Label>
              <Switch 
                id="sport-basketball" 
                checked={localPrefs.sports.basketball}
                onCheckedChange={(checked) => {
                  setLocalPrefs(prev => ({
                    ...prev,
                    sports: {
                      ...prev.sports,
                      basketball: checked
                    }
                  }));
                }}
              />
            </div>
            
            {/* Football */}
            <div className="flex items-center justify-between">
              <Label htmlFor="sport-football" className="font-medium">Football</Label>
              <Switch 
                id="sport-football" 
                checked={localPrefs.sports.football}
                onCheckedChange={(checked) => {
                  setLocalPrefs(prev => ({
                    ...prev,
                    sports: {
                      ...prev.sports,
                      football: checked
                    }
                  }));
                }}
              />
            </div>
            
            {/* Hockey */}
            <div className="flex items-center justify-between">
              <Label htmlFor="sport-hockey" className="font-medium">Hockey</Label>
              <Switch 
                id="sport-hockey" 
                checked={localPrefs.sports.hockey}
                onCheckedChange={(checked) => {
                  setLocalPrefs(prev => ({
                    ...prev,
                    sports: {
                      ...prev.sports,
                      hockey: checked
                    }
                  }));
                }}
              />
            </div>
            
            {/* Baseball */}
            <div className="flex items-center justify-between">
              <Label htmlFor="sport-baseball" className="font-medium">Baseball</Label>
              <Switch 
                id="sport-baseball" 
                checked={localPrefs.sports.baseball}
                onCheckedChange={(checked) => {
                  setLocalPrefs(prev => ({
                    ...prev,
                    sports: {
                      ...prev.sports,
                      baseball: checked
                    }
                  }));
                }}
              />
            </div>
            
            {/* Rugby */}
            <div className="flex items-center justify-between">
              <Label htmlFor="sport-rugby" className="font-medium">Rugby</Label>
              <Switch 
                id="sport-rugby" 
                checked={localPrefs.sports.rugby}
                onCheckedChange={(checked) => {
                  setLocalPrefs(prev => ({
                    ...prev,
                    sports: {
                      ...prev.sports,
                      rugby: checked
                    }
                  }));
                }}
              />
            </div>
            
            {/* Formula 1 */}
            <div className="flex items-center justify-between">
              <Label htmlFor="sport-formula1" className="font-medium">Formula 1</Label>
              <Switch 
                id="sport-formula1" 
                checked={localPrefs.sports.formula1}
                onCheckedChange={(checked) => {
                  setLocalPrefs(prev => ({
                    ...prev,
                    sports: {
                      ...prev.sports,
                      formula1: checked
                    }
                  }));
                }}
              />
            </div>
          </TabsContent>
          
          {/* Advanced Tab */}
          <TabsContent value="advanced" className="py-2 space-y-4">
            <div className="mb-2 text-sm text-gray-500">
              League preferences
            </div>
            
            {/* Premier League */}
            <div className="flex items-center justify-between">
              <Label htmlFor="league-premier" className="font-medium">Premier League</Label>
              <Switch 
                id="league-premier" 
                checked={localPrefs.leagues.premierLeague}
                onCheckedChange={(checked) => {
                  setLocalPrefs(prev => ({
                    ...prev,
                    leagues: {
                      ...prev.leagues,
                      premierLeague: checked
                    }
                  }));
                }}
              />
            </div>
            
            {/* La Liga */}
            <div className="flex items-center justify-between">
              <Label htmlFor="league-laliga" className="font-medium">La Liga</Label>
              <Switch 
                id="league-laliga" 
                checked={localPrefs.leagues.laLiga}
                onCheckedChange={(checked) => {
                  setLocalPrefs(prev => ({
                    ...prev,
                    leagues: {
                      ...prev.leagues,
                      laLiga: checked
                    }
                  }));
                }}
              />
            </div>
            
            {/* Serie A */}
            <div className="flex items-center justify-between">
              <Label htmlFor="league-seriea" className="font-medium">Serie A</Label>
              <Switch 
                id="league-seriea" 
                checked={localPrefs.leagues.serieA}
                onCheckedChange={(checked) => {
                  setLocalPrefs(prev => ({
                    ...prev,
                    leagues: {
                      ...prev.leagues,
                      serieA: checked
                    }
                  }));
                }}
              />
            </div>
            
            {/* Bundesliga */}
            <div className="flex items-center justify-between">
              <Label htmlFor="league-bundesliga" className="font-medium">Bundesliga</Label>
              <Switch 
                id="league-bundesliga" 
                checked={localPrefs.leagues.bundesliga}
                onCheckedChange={(checked) => {
                  setLocalPrefs(prev => ({
                    ...prev,
                    leagues: {
                      ...prev.leagues,
                      bundesliga: checked
                    }
                  }));
                }}
              />
            </div>
            
            {/* Ligue 1 */}
            <div className="flex items-center justify-between">
              <Label htmlFor="league-ligue1" className="font-medium">Ligue 1</Label>
              <Switch 
                id="league-ligue1" 
                checked={localPrefs.leagues.ligue1}
                onCheckedChange={(checked) => {
                  setLocalPrefs(prev => ({
                    ...prev,
                    leagues: {
                      ...prev.leagues,
                      ligue1: checked
                    }
                  }));
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="sm:justify-between gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};