import { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useOnboarding } from "@/contexts/OnboardingContext";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { completeOnboarding } = useOnboarding();
  
  // Toggle for dark mode (could be implemented with next-themes)
  const [darkMode, setDarkMode] = useState(false);
  
  // Sample user profile data
  const user = {
    name: "Sports Fan",
    email: "sports@example.com",
    joinDate: new Date(2023, 0, 15),
    favoriteLeagues: ["Premier League", "La Liga", "Serie A"]
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Handler for resetting alert preferences
  const handleResetPreferences = () => {
    toast({
      title: "Preferences Reset",
      description: "Your alert preferences have been reset to default settings.",
    });
    
    setLocation("/sport-selection");
  };

  return (
    <div className="container max-w-lg mx-auto p-4 pb-20">
      <Helmet>
        <title>Profile | Sports Alerts</title>
        <meta name="description" content="Manage your profile and app preferences." />
      </Helmet>
      
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-gray-500 mt-1">
          Manage your account and preferences
        </p>
      </header>
      
      {/* User Profile Card */}
      <Card className="p-6 mb-6">
        <div className="flex items-center">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
            {user.name.charAt(0)}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-xs text-gray-400 mt-1">Member since {formatDate(user.joinDate)}</p>
          </div>
        </div>
      </Card>
      
      {/* Favorite Leagues */}
      <Card className="p-4 mb-6">
        <h3 className="font-medium mb-3">Favorite Leagues</h3>
        <div className="flex flex-wrap gap-2">
          {user.favoriteLeagues.map(league => (
            <span 
              key={league} 
              className="px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              {league}
            </span>
          ))}
        </div>
      </Card>
      
      {/* Settings Section */}
      <div className="space-y-4">
        <h3 className="font-medium">Settings</h3>
        
        {/* Alert Settings */}
        <div 
          className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm cursor-pointer"
          onClick={() => setLocation("/alerts")}
        >
          <div>
            <h4 className="font-medium">Alert Settings</h4>
            <p className="text-sm text-gray-500">Customize your match notifications</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        
        {/* Reset Onboarding */}
        <div 
          className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm cursor-pointer"
          onClick={handleResetPreferences}
        >
          <div>
            <h4 className="font-medium">Reset Alert Preferences</h4>
            <p className="text-sm text-gray-500">Start over with alert setup</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </div>
        
        {/* Dark Mode Toggle */}
        <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
          <div>
            <h4 className="font-medium">Dark Mode</h4>
            <p className="text-sm text-gray-500">Toggle dark theme (coming soon)</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              darkMode ? 'bg-primary' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}