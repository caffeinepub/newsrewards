import { Coins, Facebook, Instagram, Mail, Twitter } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-secondary border-t border-border pt-12 pb-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg hero-gradient flex items-center justify-center">
                <Coins className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">
                <span className="text-primary">News</span>
                <span className="text-accent">Rewards</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              India's #1 platform to earn real INR by reading daily news. Free,
              instant, trusted.
            </p>
            <div className="flex gap-3">
              <span
                className="w-8 h-8 rounded-full bg-border flex items-center justify-center"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 text-muted-foreground" />
              </span>
              <span
                className="w-8 h-8 rounded-full bg-border flex items-center justify-center"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-muted-foreground" />
              </span>
              <span
                className="w-8 h-8 rounded-full bg-border flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-muted-foreground" />
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  News Feed
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  How It Works
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Leaderboard
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Refer &amp; Earn
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  FAQs
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Contact Us
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">
              Newsletter
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              Get daily news digest + earning tips.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 text-sm border border-border rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="button"
                className="p-2 hero-gradient rounded-md text-white hover:opacity-90"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {year} NewsRewards. All rights reserved.</span>
          <span>
            Built with ❤️ using{" "}
            <a
              href={utmLink}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
