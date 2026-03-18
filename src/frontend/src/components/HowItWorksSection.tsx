import { Banknote, BookOpen, Coins, Timer } from "lucide-react";
import { motion } from "motion/react";

const steps = [
  {
    icon: BookOpen,
    step: "1",
    title: "Choose an Article",
    desc: "Browse our curated daily news feed. Topics include Tech, Business, Sports, Politics & Entertainment.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Timer,
    step: "2",
    title: "Read for 10–15 Seconds",
    desc: "A visible countdown timer runs while you read. Complete the timer to validate your read and earn coins.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Coins,
    step: "3",
    title: "Earn 50 Coins",
    desc: "Each completed article read rewards you with 50 coins instantly added to your wallet.",
    color: "bg-warning/10 text-warning-foreground",
  },
  {
    icon: Banknote,
    step: "4",
    title: "Withdraw to Bank",
    desc: "100 coins = ₹3. Enter your bank details and withdraw instantly. No minimum wait, 24/7 transfers.",
    color: "bg-success/10 text-success",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 px-4 bg-secondary">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Start earning real INR money in 4 simple steps — no investment
            required.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-card text-center"
            >
              <div
                className={`w-12 h-12 rounded-full ${s.color} flex items-center justify-center mx-auto mb-4`}
              >
                <s.icon className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-muted-foreground mb-2">
                STEP {s.step}
              </div>
              <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
