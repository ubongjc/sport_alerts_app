import { useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAlertPreferences } from "@/hooks/useAlerts";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertPreferencesData } from "@shared/schema";
import { AlertSettingsModal } from "@/components/AlertSettingsModal";

export default function Alerts() {
  const { preferences, isLoading } = useAlertPreferences();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusText = (isEnabled: boolean) => {
    return isEnabled ? "Enabled" : "Disabled";
  };
  
  const getStatusClass = (isEnabled: boolean) => {
    return isEnabled ? "bg-blue-100 text-[hsl(var(--sky-blue))]" : "bg-gray-100 text-gray-600";
  };

  if (isLoading) {
    return (
      <div className="container max-w-lg mx-auto p-4 pb-20">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Alert Settings</h1>
          <p className="text-gray-500 mt-1">
            Customize your match notifications
          </p>
        </header>
        
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-lg mx-auto p-4 pb-20">
      <Helmet>
        <title>Alert Settings | Sports Alerts</title>
        <meta 
          name="description" 
          content="Customize your match alerts to get notified about goals, cards, and other important events." 
        />
      </Helmet>
      
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Alert Settings</h1>
          <p className="text-gray-500 mt-1">
            Customize your match notifications
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-[hsl(var(--sky-blue))] hover:bg-[hsl(var(--sky-blue-hover))]">Edit</Button>
      </header>
      
      <div className="space-y-4">
        {/* Goal Alerts */}
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Goal Alerts</h3>
              <p className="text-sm text-gray-500">Notification when goals are scored</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(preferences?.goalAlerts || false)}`}>
              {getStatusText(preferences?.goalAlerts || false)}
            </span>
          </div>
        </Card>
        
        {/* Red Card Alerts */}
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Red Card Alerts</h3>
              <p className="text-sm text-gray-500">Notification for red cards</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(preferences?.redCardAlerts || false)}`}>
              {getStatusText(preferences?.redCardAlerts || false)}
            </span>
          </div>
        </Card>
        
        {/* Yellow Card Alerts */}
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Yellow Card Alerts</h3>
              <p className="text-sm text-gray-500">Notification for yellow cards</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(preferences?.yellowCardAlerts || false)}`}>
              {getStatusText(preferences?.yellowCardAlerts || false)}
            </span>
          </div>
        </Card>
        
        {/* Goal Difference Alerts */}
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Goal Difference Alerts</h3>
              <p className="text-sm text-gray-500">Notification when a team takes the lead</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(preferences?.goalDifferenceAlerts?.twoGoals || false)}`}>
              {preferences?.goalDifferenceAlerts?.twoGoals ? "2+ Goals" : "Disabled"}
            </span>
          </div>
        </Card>
        
        {/* Half-time/Full-time Alerts */}
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Half-time/Full-time Alerts</h3>
              <p className="text-sm text-gray-500">Notification at key match times</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(preferences?.halfTimeFullTimeAlerts || false)}`}>
              {getStatusText(preferences?.halfTimeFullTimeAlerts || false)}
            </span>
          </div>
        </Card>

        {/* Combined Alerts Section Header */}
        <h2 className="text-lg font-semibold mt-8 mb-3">Combined Alerts</h2>
        
        {/* Red Card + 2 Goals Alert */}
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Red Card + 2 Goals</h3>
              <p className="text-sm text-gray-500">Alert when one team has a red card and the other has 2+ goals</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(preferences?.combinedAlerts?.redCardAndTwoGoals || false)}`}>
              {getStatusText(preferences?.combinedAlerts?.redCardAndTwoGoals || false)}
            </span>
          </div>
        </Card>
        
        {/* Two Red Cards Alert */}
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Multiple Red Cards</h3>
              <p className="text-sm text-gray-500">Alert when there are 2+ red cards in a match</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(preferences?.combinedAlerts?.twoRedCardsInMatch || false)}`}>
              {getStatusText(preferences?.combinedAlerts?.twoRedCardsInMatch || false)}
            </span>
          </div>
        </Card>
        
        {/* Comeback Alert */}
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Comeback Alert</h3>
              <p className="text-sm text-gray-500">Alert when a team comes back from 2+ goals down</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(preferences?.combinedAlerts?.comebackAlert || false)}`}>
              {getStatusText(preferences?.combinedAlerts?.comebackAlert || false)}
            </span>
          </div>
        </Card>
        
        {/* Multiple Yellow Cards Alert */}
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Multiple Yellow Cards</h3>
              <p className="text-sm text-gray-500">Alert when there are 3+ yellow cards in a match</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(preferences?.combinedAlerts?.multipleYellowCards || false)}`}>
              {getStatusText(preferences?.combinedAlerts?.multipleYellowCards || false)}
            </span>
          </div>
        </Card>
        
        {/* Late Game Drama Alert */}
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Late Game Drama</h3>
              <p className="text-sm text-gray-500">Alert for goals or red cards after the 85th minute</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(preferences?.combinedAlerts?.lateGameDrama || false)}`}>
              {getStatusText(preferences?.combinedAlerts?.lateGameDrama || false)}
            </span>
          </div>
        </Card>
      </div>
      
      <AlertSettingsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}