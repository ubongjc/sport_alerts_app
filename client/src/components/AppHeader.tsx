import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export const AppHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full shadow-lg">
      {/* Enhanced decorative stripe with Aston Villa colors */}
      <div className="w-full h-2 bg-gradient-to-r from-[hsl(var(--claret))] via-[hsl(var(--claret))] to-[hsl(var(--sky-blue))]"></div>
      
      <div className="bg-gradient-to-r from-[hsl(var(--sky-blue))] to-[hsl(var(--sky-blue-hover))] py-3">
        <div className="container flex items-center">
          <div className="flex flex-1 items-center justify-between">
            <div className="w-10">
              {/* Empty space for centering */}
            </div>
            
            <Link href="/">
              <a className="flex items-center">
                <div className="relative">
                  <h1 className="text-2xl font-bold text-white mr-2 drop-shadow-sm">My Alerts</h1>
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-white"></div>
                </div>
                <span className="sr-only">Home</span>
              </a>
            </Link>
            
            <div className="flex items-center gap-2">
              <Link href="/notifications">
                <a>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                  </Button>
                </a>
              </Link>
              <Link href="/alerts">
                <a>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;