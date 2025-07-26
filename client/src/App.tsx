import { Switch, Route, useLocation, useRoute } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import LiveMatches from "./pages/live-matches";
import Alerts from "./pages/alerts";
import Profile from "./pages/profile";
import SportSelection from "./pages/sport-selection";
import SportConfig from "./pages/sport-config";
import MultiSportSetup from "./pages/multi-sport-setup";
import SimpleMultiSport from "./pages/simple-multi-sport";
import AlertSetup from "./pages/alert-setup";
import LeagueSelection from "./pages/league-selection";
import SportConfiguration from "./pages/sport-configuration";
import Notifications from "./pages/notifications";
import MyAlerts from "./pages/my-alerts";
import BottomNavigation from "@/components/BottomNavigation";
import AppContainer from "@/components/AppContainer";

function Router() {
  const [isHome] = useRoute("/");
  const [isLive] = useRoute("/live");
  const [isLiveMatches] = useRoute("/live-matches");
  const [isAlerts] = useRoute("/alerts");
  const [isMyAlerts] = useRoute("/my-alerts");
  const [isNotifications] = useRoute("/notifications");
  const [isProfile] = useRoute("/profile");
  
  // Determine if we should show the bottom navigation
  const showBottomNav = isHome || isLive || isLiveMatches || isAlerts || isMyAlerts || isNotifications || isProfile;
  
  return (
    <AppContainer>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/live" component={LiveMatches} />
        <Route path="/live-matches" component={LiveMatches} />
        <Route path="/my-alerts" component={MyAlerts} />
        <Route path="/alerts" component={Alerts} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/profile" component={Profile} />
        <Route path="/sport-selection" component={SportSelection} />
        <Route path="/sport-config/:sportId" component={SportConfig} />
        <Route path="/multi-sport-setup" component={MultiSportSetup} />
        <Route path="/simple-multi-sport" component={SimpleMultiSport} />
        <Route path="/alert-setup" component={AlertSetup} />
        <Route path="/alert-setup/:sport" component={AlertSetup} />
        <Route path="/league-selection/:sport" component={LeagueSelection} />
        <Route path="/sport-configuration/:sport" component={SportConfiguration} />
        <Route component={NotFound} />
      </Switch>
      {showBottomNav && <BottomNavigation />}
    </AppContainer>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
