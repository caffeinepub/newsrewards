import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Wallet, Zap } from "lucide-react";
import { motion } from "motion/react";

interface HeroSectionProps {
  onStartReading: () => void;
  onHowItWorks: () => void;
  isAuthenticated: boolean;
}

const stats = [
  { icon: BookOpen, label: "Articles Daily", value: "50+" },
  { icon: TrendingUp, label: "Coins Per Read", value: "50" },
  { icon: Wallet, label: "INR Per 100 Coins", value: "₹3" },
  { icon: Zap, label: "Instant Withdrawal", value: "24/7" },
];

export default function HeroSection({
  onStartReading,
  onHowItWorks,
}: HeroSectionProps) {
  return (
    <section className="hero-gradient py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            🪙 Earn Real INR Money While Reading News
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Read the Latest News &amp; Earn Real Rewards!
          </h1>
          <p className="text-white/80 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            Read news articles for just 10–15 seconds and earn 50 coins each.
            Redeem 100 coins for ₹3 — instant bank transfer to your account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onStartReading}
              className="bg-white text-primary hover:bg-white/90 font-bold px-8 shadow-hero"
              data-ocid="hero.start_reading.button"
            >
              Start Reading Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onHowItWorks}
              className="border-white/50 text-white hover:bg-white/10 bg-transparent font-semibold px-8"
              data-ocid="hero.how_it_works.button"
            >
              How It Works
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/15 backdrop-blur rounded-xl p-4 text-center"
            >
              <stat.icon className="w-6 h-6 text-white/80 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/70 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
