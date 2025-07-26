import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { ArrowLeft, ArrowRight, Check, Flag, Globe, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useAlertPreferences } from '@/hooks/useAlerts';
import { League, getSportLeagues, getSportDisplayName, ALL_SPORTS_IN_ORDER } from '@/data/sportLeagues';
import { SportNavigation } from '@/components/SportNavigation';

// Country leagues indexed by country name
interface CountryLeagues {
  [country: string]: League[];
}

export default function LeagueSelection() {
  const [_, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("popular");
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { preferences, updatePreferences } = useAlertPreferences();
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [expandedCountries, setExpandedCountries] = useState<string[]>([]);
  const [isMatch, params] = useRoute('/league-selection/:sport');
  const currentSport = isMatch ? params.sport : 'soccer';
  const [allLeaguesSelected, setAllLeaguesSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [currentSportIndex, setCurrentSportIndex] = useState(0);
  
  // Initialize state for leagues
  const [popularLeagues, setPopularLeagues] = useState<League[]>([]);
  const [allLeaguesByCountry, setAllLeaguesByCountry] = useState<CountryLeagues>({});
  
  // Load leagues for the current sport
  useEffect(() => {
    console.log(`Loading leagues for sport: ${currentSport}`);
    
    // Get leagues from our utility function
    const sportLeaguesData = getSportLeagues(currentSport);
    
    console.log(`Got leagues for ${currentSport}:`, sportLeaguesData);
    
    // Clone the leagues so we can mark them as selected based on preferences
    const popularLeaguesCopy = [...sportLeaguesData.popular];
    const allLeaguesCopy = { ...sportLeaguesData.all };
    
    // Check if we have league preferences saved for this sport
    const sportPrefs = preferences?.sportAlerts?.[currentSport];
    const savedLeagues = sportPrefs?.leagues || {};
    // Get string array of selected league IDs
    const selectedLeagueIds = Object.entries(savedLeagues)
      .filter(([_, isSelected]) => isSelected === true)
      .map(([id]) => id);
    
    console.log(`Selected leagues for ${currentSport}:`, selectedLeagueIds);
    
    // Update popular leagues selection status
    for (let i = 0; i < popularLeaguesCopy.length; i++) {
      popularLeaguesCopy[i] = {
        ...popularLeaguesCopy[i],
        selected: selectedLeagueIds.includes(popularLeaguesCopy[i].id)
      };
    }
    
    // Update all leagues by country selection status
    Object.keys(allLeaguesCopy).forEach(country => {
      allLeaguesCopy[country] = allLeaguesCopy[country].map(league => ({
        ...league,
        selected: selectedLeagueIds.includes(league.id)
      }));
    });
    
    // Also update our selected leagues list for the UI
    setSelectedLeagues(selectedLeagueIds);
    
    // Check if "All Leagues" was selected
    setAllLeaguesSelected(savedLeagues['all'] === true);
    
    // Update state with the leagues for this sport
    setPopularLeagues(popularLeaguesCopy);
    setAllLeaguesByCountry(allLeaguesCopy);
    
  }, [currentSport, preferences?.sportAlerts]);

  // Load selected sports and navigate to first sport if needed
  useEffect(() => {
    if (preferences?.sports) {
      // Get list of selected sports
      const sports = Object.entries(preferences.sports)
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);
      
      setSelectedSports(sports);
      
      // If we have no current sport from URL, set to the first selected sport
      if (!isMatch && sports.length > 0) {
        setLocation(`/league-selection/${sports[0]}`);
      }
    }
  }, [preferences, isMatch, setLocation]);
  
  // Load existing preferences for the current sport
  useEffect(() => {
    if (preferences?.sportAlerts && currentSport) {
      // Get the leagues for the current sport
      const sportPrefs = preferences.sportAlerts[currentSport];
      const savedLeagues = sportPrefs?.leagues || {};
      
      // Update popularLeagues selection state
      setPopularLeagues(prevLeagues => 
        prevLeagues.map(league => ({
          ...league,
          selected: savedLeagues[league.id] === true
        }))
      );
      
      // Update allLeaguesByCountry selection state
      setAllLeaguesByCountry(prevCountries => {
        const updatedCountries = { ...prevCountries };
        Object.keys(updatedCountries).forEach(country => {
          updatedCountries[country] = updatedCountries[country].map(league => ({
            ...league,
            selected: savedLeagues[league.id] === true
          }));
        });
        return updatedCountries;
      });
      
      // Update selected leagues list
      const selectedLeagueIds = Object.keys(savedLeagues).filter(id => savedLeagues[id] === true);
      setSelectedLeagues(selectedLeagueIds);
      
      // Check if "All Leagues" was selected
      setAllLeaguesSelected(savedLeagues['all'] === true);
    }
  }, [preferences, currentSport]);

  // Toggle selection for a specific league
  const toggleLeague = (leagueId: string, isSelected: boolean) => {
    // If "All Leagues" was previously selected and user selects a specific league,
    // turn off "All Leagues" selection
    if (allLeaguesSelected) {
      setAllLeaguesSelected(false);
    }
    
    // Update popular leagues list
    setPopularLeagues(prevLeagues => 
      prevLeagues.map(league => 
        league.id === leagueId ? { ...league, selected: isSelected } : league
      )
    );
    
    // Update all leagues list
    setAllLeaguesByCountry(prevCountries => {
      const updatedCountries = { ...prevCountries };
      Object.keys(updatedCountries).forEach(country => {
        updatedCountries[country] = updatedCountries[country].map(league => 
          league.id === leagueId ? { ...league, selected: isSelected } : league
        );
      });
      return updatedCountries;
    });
    
    // Update selected leagues list
    setSelectedLeagues(prev => {
      if (isSelected) {
        return [...prev, leagueId];
      } else {
        return prev.filter(id => id !== leagueId);
      }
    });
  };

  // Toggle the "All Leagues" option
  const toggleAllLeagues = (isSelected: boolean) => {
    setAllLeaguesSelected(isSelected);
    
    if (isSelected) {
      // If "All Leagues" is selected, deselect all specific leagues
      setPopularLeagues(prevLeagues => 
        prevLeagues.map(league => ({ ...league, selected: false }))
      );
      
      setAllLeaguesByCountry(prevCountries => {
        const updatedCountries = { ...prevCountries };
        Object.keys(updatedCountries).forEach(country => {
          updatedCountries[country] = updatedCountries[country].map(league => 
            ({ ...league, selected: false })
          );
        });
        return updatedCountries;
      });
      
      setSelectedLeagues(['all']);
    } else {
      // If "All Leagues" is deselected, ensure the selected leagues list doesn't contain 'all'
      setSelectedLeagues(prev => prev.filter(id => id !== 'all'));
    }
  };

  // Toggle expansion for country accordion in "All Leagues" view
  const toggleCountryExpansion = (country: string) => {
    setExpandedCountries(prev => {
      if (prev.includes(country)) {
        return prev.filter(c => c !== country);
      } else {
        return [...prev, country];
      }
    });
  };

  // Filter countries and leagues based on search query
  const getFilteredLeagues = () => {
    if (!searchQuery) return Object.keys(allLeaguesByCountry);
    
    return Object.keys(allLeaguesByCountry).filter(country => {
      // Check if country name matches search query
      if (country.toLowerCase().includes(searchQuery.toLowerCase())) {
        return true;
      }
      
      // Check if any league in this country matches search query
      return allLeaguesByCountry[country].some(league => 
        league.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  // Save preferences and continue to next step
  const saveAndContinue = async () => {
    setIsLoading(true);
    
    try {
      console.log(`Continue button clicked for ${currentSport}`);
      
      // Prepare the leagues object for saving
      const leaguesObj: Record<string, boolean> = {};
      
      if (allLeaguesSelected) {
        // If "All Leagues" is selected, just save that
        leaguesObj['all'] = true;
      } else {
        // Otherwise save individual league selections
        selectedLeagues.forEach(id => {
          leaguesObj[id] = true;
        });
        
        // Make sure we have at least one league selected or use "all"
        if (Object.keys(leaguesObj).length === 0) {
          console.log("No leagues selected, defaulting to 'all'");
          leaguesObj['all'] = true;
        }
      }
      
      console.log(`Saving leagues for ${currentSport}:`, leaguesObj);
      
      // Save to localStorage as backup
      localStorage.setItem(`${currentSport}_leagues`, JSON.stringify(leaguesObj));
      
      // Get all selected sports from localStorage as a fallback
      const multiSportFlow = localStorage.getItem('multiSportFlow');
      let selectedSportsList = ['soccer']; // Default fallback
      
      if (multiSportFlow) {
        const flowData = JSON.parse(multiSportFlow);
        selectedSportsList = flowData.sports || ['soccer'];
      } else if (preferences?.sports) {
        selectedSportsList = ALL_SPORTS_IN_ORDER.filter(sportId => {
          return preferences.sports && preferences.sports[sportId] === true;
        });
      }
      
      console.log("All selected sports:", selectedSportsList);
      console.log("Current sport:", currentSport);
      
      // Find current sport in the list
      const currentSportIndex = selectedSportsList.indexOf(currentSport);
      console.log("Current sport index:", currentSportIndex);
      const nextSportIndex = currentSportIndex + 1;
      console.log("Next sport index:", nextSportIndex);
      
      // Show success message
      toast({
        title: `${getSportDisplayName(currentSport)} leagues saved`,
        description: `Moving to next sport`,
      });
      
      // If there's another sport to configure, go to alert setup for the next sport
      if (nextSportIndex < selectedSportsList.length) {
        const nextSport = selectedSportsList[nextSportIndex];
        console.log(`Navigating to alert setup for next sport: ${nextSport}`);
        
        // Navigate to the next sport's alert setup
        setIsLoading(false);
        setLocation(`/alert-setup/${nextSport}`);
      } else {
        // If all sports are configured, go to the live matches page
        console.log("All sports configured, navigating to live matches page");
        
        // Mark onboarding as complete in localStorage
        localStorage.setItem('onboardingCompleted', 'true');
        
        toast({
          title: "Setup complete!",
          description: "All sports configured successfully!",
        });
        
        // Navigate to live matches page
        setIsLoading(false);
        setLocation('/live');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-2 text-center">
        {getSportDisplayName(currentSport)} Leagues
      </h1>
      <p className="text-center text-sm text-muted-foreground mb-2">
        Select leagues to follow for {getSportDisplayName(currentSport)}
      </p>
      
      {/* Sport navigation dots */}
      <SportNavigation currentSport={currentSport} />
      
      <div className="mb-6">
        <div className="flex items-center p-4 border rounded-lg mb-4">
          <Checkbox 
            id="all-leagues" 
            checked={allLeaguesSelected}
            onCheckedChange={(checked) => toggleAllLeagues(checked === true)}
            className="mr-3"
          />
          <div>
            <Label htmlFor="all-leagues" className="font-medium cursor-pointer">
              All Leagues
            </Label>
            <p className="text-sm text-muted-foreground">
              Get alerts for matches in any league
            </p>
          </div>
        </div>
        
        {!allLeaguesSelected && (
          <>
            <p className="text-sm mb-4 text-center text-muted-foreground">
              Or select specific leagues below
            </p>
            
            <Tabs defaultValue="popular" className="mb-4" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="popular">
                  <Globe className="h-4 w-4 mr-2" />
                  Popular Leagues
                </TabsTrigger>
                <TabsTrigger value="all">
                  <Flag className="h-4 w-4 mr-2" />
                  All Leagues
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="popular" className="mt-4">
                <ScrollArea className="h-[55vh]">
                  <div className="space-y-2">
                    {popularLeagues.map((league) => (
                      <div key={league.id} className="flex items-center space-x-2 py-2 border-b">
                        <Checkbox 
                          id={`popular-${league.id}`} 
                          checked={league.selected}
                          onCheckedChange={(checked) => toggleLeague(league.id, checked === true)}
                        />
                        <div className="flex-1">
                          <Label 
                            htmlFor={`popular-${league.id}`}
                            className="font-medium cursor-pointer"
                          >
                            {league.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">{league.country}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="all" className="mt-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search leagues or countries..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <ScrollArea className="h-[50vh]">
                  <Accordion
                    type="multiple"
                    value={expandedCountries}
                    className="space-y-2"
                  >
                    {getFilteredLeagues().map((country) => {
                      // Filter leagues within this country if there's a search query
                      const filteredLeagues = searchQuery 
                        ? allLeaguesByCountry[country].filter(league => 
                            league.name.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                        : allLeaguesByCountry[country];
                      
                      if (filteredLeagues.length === 0) return null;
                      
                      return (
                        <AccordionItem key={country} value={country}>
                          <AccordionTrigger onClick={() => toggleCountryExpansion(country)}>
                            {country}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 pl-2">
                              {filteredLeagues.map((league) => (
                                <div key={league.id} className="flex items-center space-x-2 py-2 border-b">
                                  <Checkbox 
                                    id={`all-${league.id}`} 
                                    checked={league.selected}
                                    onCheckedChange={(checked) => toggleLeague(league.id, checked === true)}
                                  />
                                  <Label 
                                    htmlFor={`all-${league.id}`}
                                    className="flex-1 font-medium cursor-pointer"
                                  >
                                    {league.name}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
      
      {/* Fixed Position Continue Button */}
      <div className="sticky bottom-0 bg-background pt-4 pb-8">
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setLocation(`/sport-selection`)}
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button
            className="bg-[hsl(var(--sky-blue))] hover:bg-[hsl(var(--claret))] flex items-center"
            onClick={saveAndContinue}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Continue'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}