import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import HowItWorksSection from "./components/HowItWorksSection";
import LeaderboardSection from "./components/LeaderboardSection";
import LoginPromptModal from "./components/LoginPromptModal";
import NewsFeedSection from "./components/NewsFeedSection";
import ProfileSetupModal from "./components/ProfileSetupModal";
import TestimonialsSection from "./components/TestimonialsSection";
import WalletSection from "./components/WalletSection";
import WithdrawSection from "./components/WithdrawSection";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";

const queryClient = new QueryClient();

function AppContent() {
  const [activeTab, setActiveTab] = useState("home");
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleRequireLogin = () => setLoginPromptOpen(true);

  const handleTabChange = (tab: string) => {
    if ((tab === "wallet" || tab === "withdraw") && !isAuthenticated) {
      setLoginPromptOpen(true);
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "feed":
        return (
          <main>
            <NewsFeedSection
              isAuthenticated={isAuthenticated}
              onRequireLogin={handleRequireLogin}
            />
          </main>
        );
      case "wallet":
        return (
          <main>
            <WalletSection />
          </main>
        );
      case "withdraw":
        return (
          <main>
            <WithdrawSection />
          </main>
        );
      case "how":
        return (
          <main>
            <HowItWorksSection />
          </main>
        );
      default:
        return (
          <main>
            <HeroSection
              onStartReading={() => handleTabChange("feed")}
              onHowItWorks={() => handleTabChange("how")}
              isAuthenticated={isAuthenticated}
            />
            <NewsFeedSection
              isAuthenticated={isAuthenticated}
              onRequireLogin={handleRequireLogin}
              compact
            />
            <HowItWorksSection />
            <LeaderboardSection />
            <TestimonialsSection />
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userName={userProfile?.name}
      />
      <div className="flex-1">{renderContent()}</div>
      <Footer />

      <ProfileSetupModal open={showProfileSetup} />
      <LoginPromptModal
        open={loginPromptOpen}
        onClose={() => setLoginPromptOpen(false)}
      />
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
