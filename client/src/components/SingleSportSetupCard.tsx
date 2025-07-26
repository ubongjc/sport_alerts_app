import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, ListChecks } from 'lucide-react';
import { getSportDisplayName } from '@/data/sportLeagues';
import SportAnimation from '@/components/SportAnimation';

interface SingleSportSetupCardProps {
  sportId: string;
  isConfigured: boolean;
  onConfigureAlerts: () => void;
  onConfigureLeagues: () => void;
}

const SingleSportSetupCard: React.FC<SingleSportSetupCardProps> = ({ 
  sportId, 
  isConfigured,
  onConfigureAlerts,
  onConfigureLeagues
}) => {
  return (
    <Card className="p-4 mb-3 border-l-4 border-l-[hsl(var(--sky-blue))]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center">
            <SportAnimation sport={sportId} isSelected={true} />
          </div>
          <div>
            <h3 className="font-medium text-lg">{getSportDisplayName(sportId)}</h3>
            <p className="text-sm text-muted-foreground">
              {isConfigured ? "Ready to go" : "Configuration needed"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onConfigureAlerts}
            className="flex items-center gap-1"
          >
            <Settings className="h-4 w-4" />
            <span>Alerts</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onConfigureLeagues}
            className="flex items-center gap-1"
          >
            <ListChecks className="h-4 w-4" />
            <span>Leagues</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SingleSportSetupCard;