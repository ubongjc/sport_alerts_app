import { useLocation } from "wouter";
import { 
  Home,
  Activity, 
  Bell, 
  BellRing,
  User
} from "lucide-react";

const BottomNavigation = () => {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/live", icon: Activity, label: "Live" },
    { path: "/my-alerts", icon: BellRing, label: "Configured Alerts" },
    { path: "/alerts", icon: Bell, label: "Settings" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-gray-100 py-2 px-4 flex justify-around z-10">
      {/* Decorative stripe on top of navigation */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[hsl(var(--claret))] to-[hsl(var(--sky-blue))]"></div>
      
      {navItems.map(item => (
        <button
          key={item.path}
          onClick={() => setLocation(item.path)}
          className={`flex flex-col items-center p-2 ${
            isActive(item.path) 
              ? "text-[hsl(var(--claret))]" 
              : "text-gray-500 hover:text-[hsl(var(--sky-blue))]"
          } transition-colors duration-200`}
        >
          <item.icon 
            className={`h-5 w-5 ${
              isActive(item.path) 
                ? "text-[hsl(var(--claret))]" 
                : "text-gray-500 group-hover:text-[hsl(var(--sky-blue))]"
            }`} 
          />
          <span className={`text-xs mt-1 font-medium ${isActive(item.path) ? "font-semibold" : ""}`}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default BottomNavigation;