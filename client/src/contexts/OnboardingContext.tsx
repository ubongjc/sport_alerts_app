import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';

interface OnboardingContextType {
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType>({
  hasCompletedOnboarding: false,
  completeOnboarding: () => {},
  skipOnboarding: () => {}
});

export const useOnboarding = () => useContext(OnboardingContext);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useLocation();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    // Check localStorage for onboarding status
    const savedStatus = localStorage.getItem('onboardingCompleted');
    return savedStatus === 'true';
  });

  const completeOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setHasCompletedOnboarding(true);
  };

  const skipOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setHasCompletedOnboarding(true);
    setLocation('/');
  };

  // Redirect to onboarding if not completed
  useEffect(() => {
    const publicPaths = ['/sport-selection', '/alert-setup'];
    if (!hasCompletedOnboarding && !publicPaths.includes(location)) {
      setLocation('/sport-selection');
    }
  }, [hasCompletedOnboarding, location, setLocation]);

  return (
    <OnboardingContext.Provider value={{ hasCompletedOnboarding, completeOnboarding, skipOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
};