import { Helmet } from "react-helmet";
import MatchesList from "@/components/MatchesList";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const { hasCompletedOnboarding } = useOnboarding();
  const [, setLocation] = useLocation();
  
  // Redirect to onboarding if not completed
  useEffect(() => {
    if (!hasCompletedOnboarding) {
      setLocation("/sport-selection");
    }
  }, [hasCompletedOnboarding, setLocation]);

  return (
    <div className="container max-w-lg mx-auto p-4 pb-20">
      <Helmet>
        <title>Sports Alerts | Live Score Updates & Customizable Alerts</title>
        <meta 
          name="description" 
          content="Get real-time match alerts for goals, red cards, and other key events. Customize your alerts for the most important moments in the game." 
        />
      </Helmet>
      
      <header className="mb-6">
        <h1 className="text-2xl font-bold">
          {localStorage.getItem('selectedSport')?.charAt(0).toUpperCase() + 
           localStorage.getItem('selectedSport')?.slice(1) || 'Sports'} Matches
        </h1>
        <p className="text-gray-500 mt-1">
          Today's fixtures and live games
        </p>
      </header>
      
      {/* Show live matches first with higher prominence */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-red-600">Live Now</h2>
        <MatchesList activeTab="live" limit={5} />
      </section>
      
      {/* Upcoming matches in a secondary position */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Upcoming Matches</h2>
        <MatchesList activeTab="upcoming" limit={3} />
      </section>
      
      {/* Quick access to alert settings */}
      <section className="bg-gray-50 p-4 rounded-lg mb-8 flex items-center justify-between">
        <div>
          <h3 className="font-medium">Alert Settings</h3>
          <p className="text-sm text-gray-500">Customize your match alerts</p>
        </div>
        <button 
          onClick={() => setLocation("/alerts")} 
          className="px-4 py-2 bg-primary text-white rounded-md text-sm"
        >
          Settings
        </button>
      </section>
    </div>
  );
}