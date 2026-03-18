import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Coins, IndianRupee, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useGetEarningsHistory, useGetWallet } from "../hooks/useQueries";

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function WalletSection() {
  const { data: wallet, isLoading: walletLoading } = useGetWallet();
  const { data: earnings, isLoading: earningsLoading } =
    useGetEarningsHistory();

  const balance = Number(wallet?.balance ?? 0);
  const totalEarned = Number(wallet?.totalEarned ?? 0);
  const inrValue = wallet?.inrValue ?? (balance / 100) * 3;

  const today = new Date().toDateString();
  const todayEarnings = (earnings ?? [])
    .filter(
      (e) => new Date(Number(e.timestamp) / 1_000_000).toDateString() === today,
    )
    .reduce((sum, e) => sum + Number(e.coins), 0);

  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground mb-6">Your Wallet</h2>

        {walletLoading ? (
          <Skeleton
            className="h-40 w-full rounded-xl mb-6"
            data-ocid="wallet.loading_state"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="wallet-gradient rounded-xl p-6 text-white mb-6 shadow-hero"
          >
            <div className="flex items-center gap-3 mb-4">
              <Coins className="w-8 h-8" />
              <div>
                <div className="text-4xl font-extrabold">
                  {balance.toLocaleString("en-IN")}
                </div>
                <div className="text-white/70 text-sm">Available Coins</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/15 rounded-lg p-3 text-center">
                <TrendingUp className="w-4 h-4 mx-auto mb-1" />
                <div className="font-bold">
                  {totalEarned.toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-white/70">Total Earned</div>
              </div>
              <div className="bg-white/15 rounded-lg p-3 text-center">
                <Calendar className="w-4 h-4 mx-auto mb-1" />
                <div className="font-bold">{todayEarnings}</div>
                <div className="text-xs text-white/70">Today's Coins</div>
              </div>
              <div className="bg-white/15 rounded-lg p-3 text-center">
                <IndianRupee className="w-4 h-4 mx-auto mb-1" />
                <div className="font-bold">₹{Number(inrValue).toFixed(2)}</div>
                <div className="text-xs text-white/70">INR Value</div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="bg-white rounded-xl border border-border shadow-card p-6">
          <h3 className="font-bold text-foreground mb-4">Earnings History</h3>
          {earningsLoading ? (
            <div
              className="space-y-2"
              data-ocid="wallet.earnings.loading_state"
            >
              {["w1", "w2", "w3"].map((k) => (
                <Skeleton key={k} className="h-10 w-full" />
              ))}
            </div>
          ) : !earnings?.length ? (
            <div
              className="text-center py-10 text-muted-foreground"
              data-ocid="wallet.earnings.empty_state"
            >
              No earnings yet. Start reading articles to earn coins!
            </div>
          ) : (
            <Table data-ocid="wallet.earnings.table">
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead className="text-right">Coins</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earnings.map((e, i) => (
                  <TableRow
                    key={`${String(e.articleId)}-${String(e.timestamp)}`}
                    data-ocid={`wallet.earnings.row.${i + 1}`}
                  >
                    <TableCell className="font-medium text-sm max-w-xs truncate">
                      {e.title}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-success font-bold">
                        +{Number(e.coins)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-xs">
                      {formatDate(e.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </section>
  );
}
