# Sports Alerts Application

## Overview

This is a full-stack sports alerts application built with React frontend and Express backend. The app allows users to customize real-time notifications for sports events like goals, red cards, and other match events across multiple sports including soccer, basketball, and football.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Context API with Tanstack Query for server state
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom Aston Villa color scheme (claret and blue)
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Real-time**: WebSocket server for live match updates
- **External APIs**: Football Data API integration for real sports data

### Mobile-First Design
- Responsive design optimized for mobile devices
- Bottom navigation for mobile app-like experience
- Maximum width container (max-w-md) for phone-sized viewports

## Key Components

### Authentication & User Management
- User registration and login system
- Session-based authentication
- User profiles and preferences storage

### Sports Data Integration
- Football Data API for real match data
- ESPN API as fallback data source
- Sportradar API for detailed match statistics
- SendGrid for email notifications

### Alert System
- Customizable alert preferences per sport
- Goal alerts, card alerts, and score difference notifications
- League-specific filtering
- Real-time WebSocket notifications

### Multi-Sport Setup Flow
- Onboarding process for new users
- Sport selection and configuration
- League selection per sport
- Alert preference setup

## Data Flow

1. **User Onboarding**: New users select sports → configure alerts → choose leagues
2. **Real-time Data**: External APIs → Backend processing → WebSocket broadcast → Frontend updates
3. **Alert Processing**: Match events → Preference matching → Notification delivery
4. **State Management**: Database storage ↔ Backend API ↔ React Query cache ↔ Context providers

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL with connection pooling
- **UI Components**: Radix UI primitives with custom styling
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React icon library
- **Date Handling**: date-fns for date formatting

### Sports Data APIs
- **Football Data API**: Primary source for soccer/football data
- **ESPN API**: Fallback for multiple sports
- **Sportradar API**: Detailed match statistics and analytics

### Email & Notifications
- **SendGrid**: Email notification delivery
- **WebSocket**: Real-time browser notifications

## Deployment Strategy

### Development
- Vite dev server for frontend hot reloading
- tsx for TypeScript execution in development
- Replit integration with cartographer plugin

### Production Build
- Vite builds frontend to `dist/public`
- esbuild bundles backend to `dist/index.js`
- Static file serving through Express
- Database migrations via Drizzle Kit

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `FOOTBALL_DATA_API_KEY`: Football Data API authentication
- `SENDGRID_API_KEY`: Email service authentication

## Recent Changes
- July 1, 2025. ENHANCED ALERT MANAGEMENT: Implemented intelligent alert merging system - same alerts merge leagues, different alerts create new entries
- July 1, 2025. LEAGUE DELETION FEATURE: Added delete functionality for individual leagues in Configured Alerts page with automatic "All Leagues" fallback
- July 1, 2025. USER GUIDANCE IMPROVEMENT: Added clear messaging explaining league selection appears after selecting alerts
- July 1, 2025. SPORT RECONFIGURATION: Users can now reconfigure any sport multiple times from home page without affecting existing alerts
- July 1, 2025. CRITICAL FIELD NAME FIX: Systematically corrected all field name mismatches between sportLeagues.ts and save/display logic for all 19 sports
- July 1, 2025. COMPREHENSIVE SPORT-SPECIFIC ALERTS: Added detailed individual alert display for basketball, tennis, golf, boxing, cricket, formula1, darts with proper icons and descriptions
- July 1, 2025. TENNIS ALERTS VISIBILITY: Fixed tennis alerts not appearing by correcting field mappings (netPoints, longRallies, challenges, tiebreaks)
- July 1, 2025. GOLF ALERTS COMPLETION: Added missing golf alerts (chipins, longputts, sandsaves, penalties) and fixed holeInOne field name
- July 1, 2025. CRICKET ALERTS ENHANCEMENT: Added complete cricket alert set (catches, runouts, lbws, maidens, partnerships, appeals)
- July 1, 2025. FORMULA1 ALERTS UPGRADE: Fixed lapRecords field name and added missing alerts (safetyCar, penalties, retirements, podiumChanges, weatherChanges)
- July 1, 2025. DARTS ALERTS REFINEMENT: Corrected maximums field name for 180s and added missing alerts (ninedarter, ton80, highfinish)
- July 1, 2025. COMPREHENSIVE SPORTS COVERAGE: Added complete sport-specific alert mappings for all 19 sports including tennis, golf, boxing, cricket, rugby, F1, MMA, NASCAR, esports, darts, table tennis, volleyball, handball, and lacrosse
- July 1, 2025. ROBUST WORKFLOW CONSISTENCY: Enhanced save/load logic to handle sport-specific alerts consistently across all sports with proper field mapping
- July 1, 2025. ENHANCED ALERT DETECTION: Updated my-alerts page to properly detect and display sport-specific alerts for all 19 supported sports
- July 1, 2025. DEFAULT LEAGUE BEHAVIOR: Users now default to "All Leagues" when no specific leagues are selected, but "All Leagues" checkbox remains unchecked initially
- July 1, 2025. CUSTOM ALERTS DUPLICATION FIX: Fixed duplicate custom alerts appearing in Configured Alerts page with comprehensive deduplication logic
- July 1, 2025. MAJOR FEATURE RESTORATION: Added custom combined alerts back to sport configuration with full CRUD functionality
- July 1, 2025. COMPREHENSIVE ALERT DETECTION: Enhanced my-alerts page to properly detect all sport-specific alerts (basketball, football, baseball, hockey)
- July 1, 2025. SPORT-SPECIFIC MAPPINGS: Improved alert saving with proper field mapping for each sport's unique events
- July 1, 2025. ALERT DISPLAY ENHANCEMENT: Added complete basketball alert display with proper icons and descriptions for all 10+ alert types
- July 1, 2025. BOTTOM NAVIGATION FIX: Fixed missing bottom navigation on /live-matches page
- July 1, 2025. MAJOR ARCHITECTURAL CHANGE: Created unified sport-configuration.tsx page combining alerts and league/team selection
- July 1, 2025. MAJOR UX IMPROVEMENT: Vertical layout with alerts on top (larger text) and league/team selection appearing below only when alerts are selected
- July 1, 2025. NAVIGATION UPDATE: Changed from multi-page flow to single-page-per-sport approach for simpler user experience
- July 1, 2025. ROUTING: Updated sport-selection.tsx to navigate to /sport-configuration/:sport instead of separate alert/league pages
- July 1, 2025. PROGRESS TRACKING: Added sport-by-sport progress indicator showing current step and completion status
- July 1, 2025. MAJOR FIX: Removed duplicate "Leagues" card from Configured Alerts page that was appearing under individual alerts
- July 1, 2025. MAJOR FIX: Added proper popup dialogs for LEAGUES button showing actual selected league names or "ALL LEAGUES"
- July 1, 2025. MAJOR FIX: Renamed TEAMS button to "INDIVIDUAL TEAMS" with proper placeholder functionality
- July 1, 2025. Added team selection section to Alert Setup page for future individual team functionality
- July 1, 2025. Fixed alert detection system to properly identify all 19 sports including golf, boxing, tennis, etc.
- June 29, 2025. MAJOR FIX: Fixed Continue button for all 19 sports - boxing, nascar, esports, and all other sports now work correctly
- June 29, 2025. MAJOR FIX: Fixed sport-specific individual alerts - boxing shows knockouts/knockdowns instead of soccer goals/cards
- June 29, 2025. MAJOR FIX: Fixed custom combined alerts to show sport-appropriate event types (knockouts for boxing, kills for esports, etc.)
- June 29, 2025. Enhanced custom alerts UX - Condition 1 appears immediately when enabling custom alert (no need to click "Add Another Condition")
- June 29, 2025. Added automatic localStorage cleanup for deleted sports to prevent cached data from reappearing
- June 29, 2025. Added 9 additional sports with full configurations - table tennis, volleyball, handball, MMA, NASCAR, darts, lacrosse, esports
- June 29, 2025. Total 19 sports now supported with comprehensive alert and league systems
- June 29, 2025. Each sport has 10+ unique, sport-specific alert types (bullseyes for darts, kills for esports, etc.)
- June 29, 2025. Added major tournaments/leagues for all new sports (PDC Championships, UFC, Premier League Darts, etc.)
- June 29, 2025. Added comprehensive sport support - tennis, cricket, golf with full league and alert configurations
- June 29, 2025. Expanded alert options for all sports (10+ unique alerts per sport with sport-specific event types)
- June 29, 2025. Added major leagues/tournaments for new sports (Grand Slams, IPL, PGA Tour, etc.)
- June 29, 2025. Fixed Alert Summary showing before adding conditions - summary now only appears after user adds conditions to custom alerts
- June 29, 2025. Added validation to prevent loading invalid custom alerts from localStorage when switching sports
- June 29, 2025. Fixed custom alerts showing wrong sport event types - custom alerts now reset with sport-appropriate defaults when switching sports
- June 29, 2025. Updated custom alert templates to use correct event types per sport (homeRuns for baseball, touchdowns for football, points for basketball, etc.)
- June 29, 2025. Significantly improved sport icon recognizability - clearer designs with distinctive colors and shapes
- June 29, 2025. Enhanced soccer ball with prominent black pentagons on white background for instant recognition
- June 29, 2025. Created bright orange basketball with clear curved lines and texture details
- June 29, 2025. Improved American football with brown leather, white laces, and pointed ends
- June 29, 2025. Added hockey stick with puck instead of just puck for better sport identification
- June 29, 2025. Created bright yellow tennis ball with classic curved white lines
- June 29, 2025. Enhanced F1 car with side view, wings, cockpit, and racing number for motorsport clarity
- June 29, 2025. Replaced stick figure sport icons with realistic equipment icons - soccer ball, basketball, football, baseball, hockey puck, rugby ball, F1 car
- June 29, 2025. Added automatic duplicate removal for custom combined alerts - duplicates detected and removed based on alert summary
- June 29, 2025. Fixed alert selection to start unchecked when switching sports - users now get clean slate for each sport
- June 29, 2025. Added cleanup function in Configured Alerts page to remove existing duplicates from localStorage automatically
- June 29, 2025. Fixed custom alert persistence - custom alerts now save properly and don't disappear when setting new alerts
- June 29, 2025. Added logic to preserve existing alerts when saving new ones, preventing loss of configured alerts
- June 29, 2025. Fixed custom alert loading from localStorage when returning to Alert Setup page
- June 29, 2025. Updated Configured Alerts tab to show cleaner alert text (e.g., "Red Cards" instead of "Red Card Alerts")
- June 29, 2025. Renamed "My Alerts" tab to "Configured Alerts" in navigation and page title
- June 29, 2025. Fixed basketball alerts saving to localStorage
- June 29, 2025. Added duplicate alert detection with user notification
- June 29, 2025. Implemented "My Alerts Only" filtering using localStorage instead of preferences context
- June 29, 2025. Enhanced My Alerts page to display sport-specific alerts (basketball, football)
- June 29, 2025. Updated delete functionality for all alert types including sport-specific ones
- June 29, 2025. Modified My Alerts page to show only configured alerts (not disabled ones)
- June 29, 2025. Reorganized Alert Setup page - moved Custom Combined Alerts above Individual Alerts section
- June 29, 2025. Renamed individual alerts section to "Individual Alerts" with descriptive subtitle
- June 29, 2025. Added support for freekick alerts and custom combined alerts in localStorage persistence
- June 29, 2025. Fixed league naming inconsistencies - added comprehensive mapping for API variations like "English FA Cup" vs "FA Cup" in config
- June 29, 2025. Enhanced league mapping to include all major league name variations (Premier League, La Liga, Serie A, Bundesliga, etc.)
- June 29, 2025. Fixed Continue button navigation by bypassing null preferences dependency
- June 29, 2025. Removed "Configure Your Sports" section from sport selection page - users now go directly to alert setup workflow after selecting sports
- June 29, 2025. Added FA Cup league and sample matches to enhance testing data
- June 29, 2025. Fixed TypeScript errors in MatchesList component with proper type annotations
- June 29, 2025. Enhanced league mapping to include FA Cup in "My Alerts Only" filtering
- June 29, 2025. Fixed basketball alerts saving to localStorage
- June 29, 2025. Added duplicate alert detection with user notification
- June 29, 2025. Implemented "My Alerts Only" filtering using localStorage instead of preferences context
- June 29, 2025. Enhanced My Alerts page to display sport-specific alerts (basketball, football)
- June 29, 2025. Updated delete functionality for all alert types including sport-specific ones

## Changelog
- June 29, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.