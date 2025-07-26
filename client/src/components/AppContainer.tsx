import { ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import AppHeader from "./AppHeader";

interface AppContainerProps {
  children: ReactNode;
}

const AppContainer = ({ children }: AppContainerProps) => {
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow relative overflow-hidden pb-20">
      <AppHeader />
      <main className="pt-2">
        {children}
      </main>
    </div>
  );
};

export default AppContainer;
