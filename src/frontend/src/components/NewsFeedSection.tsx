import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Category } from "../backend.d";
import { useGetArticles, useGetWallet } from "../hooks/useQueries";
import ArticleCard from "./ArticleCard";

interface NewsFeedSectionProps {
  isAuthenticated: boolean;
  onRequireLogin: () => void;
  compact?: boolean;
}

const CATEGORIES = ["all", ...Object.values(Category)];
const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4"];

export default function NewsFeedSection({
  isAuthenticated,
  onRequireLogin,
  compact = false,
}: NewsFeedSectionProps) {
  const { data: articles, isLoading } = useGetArticles();
  const { data: wallet } = useGetWallet();
  const [activeCategory, setActiveCategory] = useState("all");

  const readSet = new Set((wallet?.readArticles ?? []).map(String));
  const filtered = (articles ?? []).filter(
    (a) =>
      activeCategory === "all" ||
      (a.category as unknown as string) === activeCategory,
  );
  const displayed = compact ? filtered.slice(0, 4) : filtered;

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Daily News Feed
            </h2>
            <p className="text-muted-foreground mt-1">
              Read articles and earn 50 coins each — redeemable for real INR.
            </p>
          </div>
          <div className="flex flex-wrap gap-2" data-ocid="feed.filter.tab">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                type="button"
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className={
                  activeCategory === cat
                    ? "hero-gradient text-white border-0"
                    : ""
                }
                data-ocid={`feed.${cat}.tab`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SKELETON_KEYS.map((k) => (
              <div
                key={k}
                className="rounded-xl border border-border overflow-hidden"
                data-ocid="feed.loading_state"
              >
                <Skeleton className="h-44 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-8 w-full mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="feed.empty_state"
          >
            No articles available. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayed.map((article, i) => (
              <ArticleCard
                key={String(article.id)}
                article={article}
                isRead={readSet.has(String(article.id))}
                isAuthenticated={isAuthenticated}
                onRequireLogin={onRequireLogin}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
