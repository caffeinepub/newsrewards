import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useGetLeaderboard } from "../hooks/useQueries";

export default function LeaderboardSection() {
  const { data: leaders, isLoading } = useGetLeaderboard();
  const trophyColors = ["text-yellow-500", "text-slate-400", "text-amber-700"];

  return (
    <section className="py-12 px-4 bg-secondary">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">Top Earners</h2>
          <p className="text-muted-foreground text-sm mt-1">
            This week's highest coin earners
          </p>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
          {isLoading ? (
            <div
              className="p-4 space-y-3"
              data-ocid="leaderboard.loading_state"
            >
              {["a", "b", "c", "d", "e"].map((k) => (
                <div key={k} className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : !leaders?.length ? (
            <div
              className="p-8 text-center text-muted-foreground"
              data-ocid="leaderboard.empty_state"
            >
              No earners yet. Be the first!
            </div>
          ) : (
            <ul>
              {leaders.slice(0, 10).map((leader, i) => (
                <motion.li
                  key={leader.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0"
                  data-ocid={`leaderboard.item.${i + 1}`}
                >
                  <span className="w-6 text-sm font-bold text-muted-foreground text-center">
                    {i < 3 ? (
                      <Trophy className={`w-4 h-4 ${trophyColors[i]}`} />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                      {leader.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1 font-medium text-sm text-foreground">
                    {leader.name}
                  </span>
                  <span className="text-sm font-bold text-accent">
                    {Number(leader.totalCoinsEarned).toLocaleString("en-IN")} 🪙
                  </span>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
