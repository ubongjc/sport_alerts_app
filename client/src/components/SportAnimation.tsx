import { useState, useEffect } from 'react';

interface SportAnimationProps {
  sport: string;
  isSelected: boolean;
}

// Component for animated sport icons with enhanced animations
export default function SportAnimation({ sport, isSelected }: SportAnimationProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Play animation when selected or on initial render if selected
  useEffect(() => {
    if (isSelected) {
      setIsPlaying(true);
      // Stop animation after 2 seconds
      const timer = setTimeout(() => {
        setIsPlaying(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSelected]);

  // Handle mouse hover effects
  const handleMouseEnter = () => {
    setIsHovering(true);
    setIsPlaying(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Only stop playing if not selected
    if (!isSelected) {
      setIsPlaying(false);
    }
  };

  // Get the appropriate animation CSS class based on sport
  const getAnimationClass = () => {
    if (!isPlaying) return '';
    
    // Use the same simple animation for all sports
    return 'animate-pulse';
  };

  // Get sport-specific icon with animation
  const renderSportIcon = () => {
    const animationClass = getAnimationClass();
    
    switch (sport) {
      case 'soccer':
        return (
          <div className={`relative ${animationClass}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" viewBox="0 0 100 100" fill="none">
              {/* Classic soccer ball - much clearer design */}
              <circle cx="50" cy="50" r="38" fill="#FFFFFF" stroke="#000000" strokeWidth="3"/>
              
              {/* Central black pentagon - larger and more prominent */}
              <polygon points="50,20 65,30 60,50 40,50 35,30" fill="#000000" stroke="#000000" strokeWidth="1"/>
              
              {/* White hexagons with thick black borders around pentagon */}
              <polygon points="50,20 35,30 25,15 40,5 60,5 75,15 65,30" fill="#FFFFFF" stroke="#000000" strokeWidth="2"/>
              <polygon points="35,30 40,50 25,65 10,50 15,30" fill="#FFFFFF" stroke="#000000" strokeWidth="2"/>
              <polygon points="65,30 85,30 90,50 75,65 60,50" fill="#FFFFFF" stroke="#000000" strokeWidth="2"/>
              <polygon points="40,50 60,50 75,65 60,80 40,80 25,65" fill="#FFFFFF" stroke="#000000" strokeWidth="2"/>
              
              {/* Additional smaller pentagons for classic soccer ball look */}
              <polygon points="25,15 15,30 25,35 35,25 30,15" fill="#000000"/>
              <polygon points="75,15 85,30 75,35 65,25 70,15" fill="#000000"/>
              <polygon points="25,65 15,70 25,85 35,75 30,65" fill="#000000"/>
              <polygon points="75,65 85,70 75,85 65,75 70,65" fill="#000000"/>
            </svg>
          </div>
        );
      case 'basketball':
        return (
          <div className={`relative ${animationClass}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" viewBox="0 0 100 100" fill="none">
              {/* Basketball with bright orange color and clear lines */}
              <circle cx="50" cy="50" r="38" fill="#FF8C00" stroke="#000000" strokeWidth="3"/>
              
              {/* Main vertical curved lines - classic basketball pattern */}
              <path d="M50,12 Q25,25 20,50 Q25,75 50,88" stroke="#000000" strokeWidth="3" fill="none"/>
              <path d="M50,12 Q75,25 80,50 Q75,75 50,88" stroke="#000000" strokeWidth="3" fill="none"/>
              
              {/* Horizontal line across the middle */}
              <path d="M12,50 Q25,45 50,50 Q75,55 88,50" stroke="#000000" strokeWidth="3" fill="none"/>
              
              {/* Additional curved lines for complete basketball look */}
              <path d="M35,15 Q45,30 50,50" stroke="#000000" strokeWidth="2" fill="none"/>
              <path d="M65,15 Q55,30 50,50" stroke="#000000" strokeWidth="2" fill="none"/>
              <path d="M35,85 Q45,70 50,50" stroke="#000000" strokeWidth="2" fill="none"/>
              <path d="M65,85 Q55,70 50,50" stroke="#000000" strokeWidth="2" fill="none"/>
              
              {/* Small dots for texture */}
              <circle cx="30" cy="35" r="1" fill="#000000"/>
              <circle cx="70" cy="35" r="1" fill="#000000"/>
              <circle cx="30" cy="65" r="1" fill="#000000"/>
              <circle cx="70" cy="65" r="1" fill="#000000"/>
            </svg>
          </div>
        );
      case 'baseball':
        return (
          <div className={`relative ${animationClass}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" viewBox="0 0 100 100" fill="none">
              {/* Baseball */}
              <circle cx="50" cy="50" r="40" fill="#FFFFFF" stroke="#000000" strokeWidth="2"/>
              
              {/* Baseball seams - classic figure-8 pattern */}
              <path d="M30,25 Q50,35 70,25 Q70,45 50,50 Q30,45 30,25" stroke="#FF0000" strokeWidth="2" fill="none"/>
              <path d="M70,75 Q50,65 30,75 Q30,55 50,50 Q70,55 70,75" stroke="#FF0000" strokeWidth="2" fill="none"/>
              
              {/* Stitching details */}
              <path d="M35,30 L40,32" stroke="#FF0000" strokeWidth="1"/>
              <path d="M45,35 L50,37" stroke="#FF0000" strokeWidth="1"/>
              <path d="M55,35 L60,32" stroke="#FF0000" strokeWidth="1"/>
              <path d="M65,30 L60,28" stroke="#FF0000" strokeWidth="1"/>
              
              <path d="M65,70 L60,68" stroke="#FF0000" strokeWidth="1"/>
              <path d="M55,65 L50,63" stroke="#FF0000" strokeWidth="1"/>
              <path d="M45,65 L40,68" stroke="#FF0000" strokeWidth="1"/>
              <path d="M35,70 L40,72" stroke="#FF0000" strokeWidth="1"/>
            </svg>
          </div>
        );
      case 'football':
        return (
          <div className={`relative ${animationClass}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" viewBox="0 0 100 100" fill="none">
              {/* American Football - more distinctive shape and color */}
              <ellipse cx="50" cy="50" rx="35" ry="18" fill="#8B4513" stroke="#000000" strokeWidth="3"/>
              
              {/* White stripes on football */}
              <ellipse cx="50" cy="50" rx="35" ry="18" fill="none" stroke="#FFFFFF" strokeWidth="1"/>
              <ellipse cx="50" cy="50" rx="30" ry="15" fill="none" stroke="#FFFFFF" strokeWidth="0.5"/>
              
              {/* Prominent white laces */}
              <line x1="50" y1="34" x2="50" y2="66" stroke="#FFFFFF" strokeWidth="3"/>
              <line x1="44" y1="38" x2="56" y2="38" stroke="#FFFFFF" strokeWidth="2"/>
              <line x1="44" y1="43" x2="56" y2="43" stroke="#FFFFFF" strokeWidth="2"/>
              <line x1="44" y1="48" x2="56" y2="48" stroke="#FFFFFF" strokeWidth="2"/>
              <line x1="44" y1="53" x2="56" y2="53" stroke="#FFFFFF" strokeWidth="2"/>
              <line x1="44" y1="58" x2="56" y2="58" stroke="#FFFFFF" strokeWidth="2"/>
              <line x1="44" y1="62" x2="56" y2="62" stroke="#FFFFFF" strokeWidth="2"/>
              
              {/* Pointed ends to make it clearly a football */}
              <path d="M15,50 Q10,45 15,40 Q20,45 15,50 Q20,55 15,60 Q10,55 15,50" fill="#8B4513" stroke="#000000" strokeWidth="2"/>
              <path d="M85,50 Q90,45 85,40 Q80,45 85,50 Q80,55 85,60 Q90,55 85,50" fill="#8B4513" stroke="#000000" strokeWidth="2"/>
            </svg>
          </div>
        );
      case 'hockey':
        return (
          <div className={`relative ${animationClass}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" viewBox="0 0 100 100" fill="none">
              {/* Hockey Stick - more recognizable than just a puck */}
              <g transform="rotate(-30 50 50)">
                {/* Stick shaft */}
                <rect x="45" y="10" width="4" height="60" fill="#8B4513" stroke="#000000" strokeWidth="1"/>
                
                {/* Stick blade */}
                <rect x="35" y="65" width="20" height="4" fill="#8B4513" stroke="#000000" strokeWidth="1"/>
                
                {/* Stick grip tape */}
                <rect x="44" y="10" width="6" height="15" fill="#000000"/>
                
                {/* Wood grain lines */}
                <line x1="46" y1="15" x2="46" y2="65" stroke="#654321" strokeWidth="0.5"/>
                <line x1="48" y1="15" x2="48" y2="65" stroke="#654321" strokeWidth="0.5"/>
              </g>
              
              {/* Hockey puck near the blade */}
              <circle cx="65" cy="75" r="8" fill="#000000" stroke="#333333" strokeWidth="2"/>
              <circle cx="65" cy="75" r="6" fill="none" stroke="#555555" strokeWidth="1"/>
              
              {/* Motion lines */}
              <path d="M75,70 L85,72" stroke="#CCCCCC" strokeWidth="1" opacity="0.6"/>
              <path d="M75,75 L85,75" stroke="#CCCCCC" strokeWidth="1" opacity="0.6"/>
              <path d="M75,80 L85,78" stroke="#CCCCCC" strokeWidth="1" opacity="0.6"/>
            </svg>
          </div>
        );
      case 'rugby':
        return (
          <div className={`relative ${animationClass}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" viewBox="0 0 100 100" fill="none">
              {/* Rugby Ball */}
              <ellipse cx="50" cy="50" rx="25" ry="35" fill="#8B4513" stroke="#000000" strokeWidth="2"/>
              
              {/* Rugby ball panels - typical 4-panel design */}
              <path d="M50,15 Q65,35 50,50 Q35,35 50,15" stroke="#000000" strokeWidth="1.5" fill="none"/>
              <path d="M50,85 Q35,65 50,50 Q65,65 50,85" stroke="#000000" strokeWidth="1.5" fill="none"/>
              <path d="M25,50 Q35,35 50,50 Q35,65 25,50" stroke="#000000" strokeWidth="1.5" fill="none"/>
              <path d="M75,50 Q65,35 50,50 Q65,65 75,50" stroke="#000000" strokeWidth="1.5" fill="none"/>
              
              {/* Center seam lines */}
              <line x1="50" y1="25" x2="50" y2="40" stroke="#FFFFFF" strokeWidth="1"/>
              <line x1="50" y1="60" x2="50" y2="75" stroke="#FFFFFF" strokeWidth="1"/>
              <line x1="35" y1="50" x2="40" y2="50" stroke="#FFFFFF" strokeWidth="1"/>
              <line x1="60" y1="50" x2="65" y2="50" stroke="#FFFFFF" strokeWidth="1"/>
            </svg>
          </div>
        );
      case 'cricket':
        return (
          <div className={`relative ${animationClass}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2">
              {/* Player stick figure batting */}
              <g className="bat">
                <circle cx="15" cy="10" r="5" /> {/* Head */}
                <line x1="15" y1="15" x2="15" y2="30" /> {/* Body */}
                <line x1="15" y1="20" x2="5" y2="25" /> {/* Left arm */}
                <line x1="15" y1="20" x2="25" y2="15" /> {/* Right arm */}
                <line x1="25" y1="15" x2="35" y2="10" /> {/* Cricket bat */}
                <line x1="15" y1="30" x2="10" y2="40" /> {/* Left leg */}
                <line x1="15" y1="30" x2="20" y2="40" /> {/* Right leg */}
              </g>
              {/* Cricket ball */}
              <circle className="ball" cx="30" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
        );
      case 'tennis':
      case 'tabletennis':
        return (
          <div className={`relative ${animationClass}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" viewBox="0 0 100 100" fill="none">
              {/* Tennis Ball - bright yellow/green and very recognizable */}
              <circle cx="50" cy="50" r="38" fill="#CCFF00" stroke="#000000" strokeWidth="3"/>
              
              {/* Classic tennis ball curved line pattern */}
              <path d="M12,50 Q25,20 50,35 Q75,20 88,50" stroke="#FFFFFF" strokeWidth="4" fill="none"/>
              <path d="M12,50 Q25,80 50,65 Q75,80 88,50" stroke="#FFFFFF" strokeWidth="4" fill="none"/>
              
              {/* Additional curved details */}
              <path d="M20,35 Q40,25 50,35" stroke="#FFFFFF" strokeWidth="2" fill="none"/>
              <path d="M50,35 Q60,25 80,35" stroke="#FFFFFF" strokeWidth="2" fill="none"/>
              <path d="M20,65 Q40,75 50,65" stroke="#FFFFFF" strokeWidth="2" fill="none"/>
              <path d="M50,65 Q60,75 80,65" stroke="#FFFFFF" strokeWidth="2" fill="none"/>
              
              {/* Fuzzy texture dots */}
              <circle cx="35" cy="40" r="1" fill="#E6FF66" opacity="0.7"/>
              <circle cx="65" cy="40" r="1" fill="#E6FF66" opacity="0.7"/>
              <circle cx="35" cy="60" r="1" fill="#E6FF66" opacity="0.7"/>
              <circle cx="65" cy="60" r="1" fill="#E6FF66" opacity="0.7"/>
              <circle cx="50" cy="30" r="1" fill="#E6FF66" opacity="0.7"/>
              <circle cx="50" cy="70" r="1" fill="#E6FF66" opacity="0.7"/>
            </svg>
          </div>
        );
      case 'boxing':
        return (
          <div className={`relative ${animationClass}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2">
              {/* Boxing stick figure */}
              <circle cx="15" cy="10" r="5" /> {/* Head */}
              <line x1="15" y1="15" x2="15" y2="30" /> {/* Body */}
              <line x1="15" y1="18" x2="5" y2="20" /> {/* Left arm */}
              <line x1="15" y1="18" x2="30" y2="15" /> {/* Right arm punching */}
              <circle cx="32" cy="15" r="3" /> {/* Boxing glove */}
              <line x1="15" y1="30" x2="10" y2="40" /> {/* Left leg */}
              <line x1="15" y1="30" x2="20" y2="40" /> {/* Right leg */}
            </svg>
          </div>
        );
      case 'formula1':
      case 'nascar':
        return (
          <div className={`relative ${animationClass}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" viewBox="0 0 100 100" fill="none">
              {/* F1 Racing Car - side view, more recognizable */}
              
              {/* Main car body - sleek F1 shape */}
              <path d="M15,45 L25,40 L75,40 L85,45 L85,55 L75,60 L25,60 L15,55 Z" fill="#FF0000" stroke="#000000" strokeWidth="2"/>
              
              {/* Cockpit opening */}
              <path d="M35,38 L65,38 L70,42 L70,58 L65,62 L35,62 L30,58 L30,42 Z" fill="#87CEEB" stroke="#000000" strokeWidth="1"/>
              
              {/* Nose cone - distinctive pointed front */}
              <path d="M75,40 L90,47 L90,53 L75,60" fill="#FF0000" stroke="#000000" strokeWidth="2"/>
              
              {/* Rear wing - iconic F1 feature */}
              <rect x="10" y="35" width="12" height="3" fill="#000000"/>
              <rect x="10" y="62" width="12" height="3" fill="#000000"/>
              <line x1="16" y1="35" x2="16" y2="65" stroke="#000000" strokeWidth="2"/>
              
              {/* Front wing */}
              <rect x="85" y="43" width="12" height="2" fill="#000000"/>
              <rect x="85" y="55" width="12" height="2" fill="#000000"/>
              
              {/* Wheels - larger and more prominent */}
              <circle cx="30" cy="40" r="10" fill="#333333" stroke="#000000" strokeWidth="2"/>
              <circle cx="30" cy="60" r="10" fill="#333333" stroke="#000000" strokeWidth="2"/>
              <circle cx="70" cy="40" r="10" fill="#333333" stroke="#000000" strokeWidth="2"/>
              <circle cx="70" cy="60" r="10" fill="#333333" stroke="#000000" strokeWidth="2"/>
              
              {/* Wheel rims */}
              <circle cx="30" cy="40" r="6" fill="#666666"/>
              <circle cx="30" cy="60" r="6" fill="#666666"/>
              <circle cx="70" cy="40" r="6" fill="#666666"/>
              <circle cx="70" cy="60" r="6" fill="#666666"/>
              
              {/* Racing number */}
              <text x="50" y="52" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="Arial, sans-serif" fontWeight="bold">1</text>
              
              {/* Speed lines */}
              <path d="M5,35 L15,37" stroke="#CCCCCC" strokeWidth="2" opacity="0.6"/>
              <path d="M3,45 L13,45" stroke="#CCCCCC" strokeWidth="2" opacity="0.6"/>
              <path d="M5,55 L15,55" stroke="#CCCCCC" strokeWidth="2" opacity="0.6"/>
              <path d="M3,65 L13,63" stroke="#CCCCCC" strokeWidth="2" opacity="0.6"/>
            </svg>
          </div>
        );

      default:
        return (
          <div className={animationClass}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              {sport === 'darts' && (
                <>
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </>
              )}
              {sport === 'esports' && (
                <>
                  <rect x="5" y="8" width="14" height="8" rx="1" />
                  <path d="M7 12h2" />
                  <path d="M15 10h2" />
                  <path d="M15 14h2" />
                </>
              )}
            </svg>
          </div>
        );
    }
  };

  return (
    <div 
      className={`sport-animation ${isSelected ? 'sport-active' : ''} ${isHovering ? 'sport-hover' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {renderSportIcon()}
    </div>
  );
}