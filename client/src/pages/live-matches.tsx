import { Helmet } from "react-helmet";
import MatchesList from "@/components/MatchesList";
import { useMatches } from "@/hooks/useMatches";

export default function LiveMatches() {
  // Get selected sport from local storage for display
  const selectedSport = localStorage.getItem('selectedSport') || 'soccer';
  const formattedSport = selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1);
  
  // Get live matches data to display match count
  const { liveMatches } = useMatches();
  const matchCount = liveMatches?.length || 0;
  
  return (
    <div className="container max-w-lg mx-auto p-4 pb-20">
      <Helmet>
        <title>Live {formattedSport} Matches | Sports Alerts</title>
        <meta name="description" content={`View all live ${selectedSport} matches with real-time score updates and events.`} />
      </Helmet>
      
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Live {formattedSport} Matches</h1>
        <p className="text-gray-500 mt-1">
          Real-time updates for {matchCount} ongoing games
        </p>
        {matchCount > 0 && liveMatches && liveMatches[0] && liveMatches[0].league && (
          <div className="mt-2 text-sm bg-blue-50 p-2 rounded-md">
            Currently showing matches from {liveMatches[0].league.name}
          </div>
        )}
      </header>
      
      <MatchesList activeTab="live" />
    </div>
  );
}