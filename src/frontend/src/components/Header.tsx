import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Coins, Menu, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userName?: string;
}

const navLinks = [
  { id: "home", label: "Home" },
  { id: "feed", label: "News Feed" },
  { id: "how", label: "How it Works" },
  { id: "wallet", label: "Wallet" },
  { id: "withdraw", label: "Withdraw" },
];

export default function Header({
  activeTab,
  onTabChange,
  userName,
}: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (err: any) {
        if (err?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            type="button"
            onClick={() => onTabChange("home")}
            className="flex items-center gap-2 font-bold text-xl text-foreground"
            data-ocid="header.link"
          >
            <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
              <Coins className="w-4 h-4 text-white" />
            </div>
            <span className="text-primary">News</span>
            <span className="text-accent">Rewards</span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => onTabChange(link.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === link.id
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                data-ocid={`header.${link.id}.link`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated && userName && (
              <span className="text-sm text-muted-foreground font-medium">
                Hi, {userName}
              </span>
            )}
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAuth}
                data-ocid="header.logout.button"
              >
                Log Out
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAuth}
                  disabled={isLoggingIn}
                  data-ocid="header.login.button"
                >
                  {isLoggingIn ? "Signing in..." : "Log In"}
                </Button>
                <Button
                  size="sm"
                  onClick={handleAuth}
                  disabled={isLoggingIn}
                  className="hero-gradient text-white border-0"
                  data-ocid="header.signup.button"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-md"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="header.mobile_menu.button"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.id}
              onClick={() => {
                onTabChange(link.id);
                setMobileOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === link.id
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`header.mobile.${link.id}.link`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAuth}
                data-ocid="header.mobile.logout.button"
              >
                Log Out
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleAuth}
                disabled={isLoggingIn}
                className="hero-gradient text-white border-0"
                data-ocid="header.mobile.login.button"
              >
                {isLoggingIn ? "Signing in..." : "Log In to Earn"}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
