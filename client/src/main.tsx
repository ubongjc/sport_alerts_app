import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AlertPreferencesProvider } from "./contexts/AlertPreferencesContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { SportConfigProvider } from "./contexts/SportConfigContext";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AlertPreferencesProvider>
      <OnboardingProvider>
        <SportConfigProvider>
          <App />
        </SportConfigProvider>
      </OnboardingProvider>
    </AlertPreferencesProvider>
  </QueryClientProvider>
);
