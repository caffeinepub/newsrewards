import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, Coins, Timer } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Article } from "../backend.d";
import { Category } from "../backend.d";
import { useRecordArticleRead } from "../hooks/useQueries";

const categoryColors: Record<string, string> = {
  [Category.tech]: "bg-primary/10 text-primary",
  [Category.business]: "bg-accent/10 text-accent",
  [Category.sports]: "bg-success/10 text-success",
  [Category.politics]: "bg-warning/10 text-warning-foreground",
  [Category.entertainment]: "bg-destructive/10 text-destructive",
};

const fallbackImages: Record<string, string> = {
  [Category.tech]: "/assets/generated/article-tech.dim_600x400.jpg",
  [Category.business]: "/assets/generated/article-business.dim_600x400.jpg",
  [Category.sports]: "/assets/generated/article-sports.dim_600x400.jpg",
  [Category.politics]: "/assets/generated/article-politics.dim_600x400.jpg",
  [Category.entertainment]:
    "/assets/generated/article-entertainment.dim_600x400.jpg",
};

interface ArticleCardProps {
  article: Article;
  isRead: boolean;
  isAuthenticated: boolean;
  onRequireLogin: () => void;
  index: number;
}

export default function ArticleCard({
  article,
  isRead,
  isAuthenticated,
  onRequireLogin,
  index,
}: ArticleCardProps) {
  const [isReading, setIsReading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { mutateAsync: recordRead, isPending } = useRecordArticleRead();

  const duration = Number(article.duration) || 10;
  const imgSrc =
    article.imageUrl ||
    fallbackImages[article.category] ||
    fallbackImages[Category.tech];

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startReading = () => {
    if (!isAuthenticated) {
      onRequireLogin();
      return;
    }
    if (isRead || isReading) return;
    setIsReading(true);
    setProgress(0);
    setTimeLeft(duration);
    const tick = 100;
    const totalTicks = (duration * 1000) / tick;
    let elapsed = 0;
    intervalRef.current = setInterval(async () => {
      elapsed++;
      const pct = (elapsed / totalTicks) * 100;
      setProgress(Math.min(pct, 100));
      setTimeLeft(Math.max(0, duration - Math.floor((elapsed * tick) / 1000)));
      if (elapsed >= totalTicks) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        try {
          await recordRead(article.id);
          toast.success("+50 coins earned! 🪙", {
            description: `"${article.title}" read successfully.`,
          });
        } catch {
          toast.error("Failed to record read. Try again.");
        }
        setIsReading(false);
      }
    }, tick);
  };

  const categoryKey = article.category as unknown as string;
  const colorClass =
    categoryColors[categoryKey] ?? "bg-muted text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl border border-border shadow-card overflow-hidden flex flex-col"
      data-ocid={`feed.item.${index + 1}`}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={imgSrc}
          alt={article.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 flex gap-1">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-white/90 ${colorClass}`}
          >
            {categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}
          </span>
        </div>
        {isRead ? (
          <div className="absolute top-2 right-2 bg-success text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Earned
          </div>
        ) : (
          <div className="absolute top-2 right-2 coin-badge text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Coins className="w-3 h-3" /> +50 Coins
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-sm text-foreground line-clamp-2 mb-1 leading-snug">
          {article.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
          {article.summary}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <Clock className="w-3 h-3" />
          <span>{duration}s read time</span>
        </div>

        <AnimatePresence>
          {isReading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-3"
            >
              <div className="flex justify-between text-xs mb-1">
                <span className="text-primary font-semibold flex items-center gap-1">
                  <Timer className="w-3 h-3" /> Reading...
                </span>
                <span className="text-muted-foreground">{timeLeft}s left</span>
              </div>
              <Progress value={progress} className="h-2" />
            </motion.div>
          )}
        </AnimatePresence>

        {isRead ? (
          <div className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-success/10 text-success text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Coins Earned!
          </div>
        ) : (
          <Button
            type="button"
            size="sm"
            onClick={startReading}
            disabled={isReading || isPending}
            className={
              isReading
                ? "opacity-70"
                : "hero-gradient text-white border-0 hover:opacity-90"
            }
            data-ocid={`feed.read.button.${index + 1}`}
          >
            {isReading
              ? "Keep reading..."
              : isAuthenticated
                ? "Read & Earn"
                : "Login to Earn"}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
