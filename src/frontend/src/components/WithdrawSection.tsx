import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Banknote, IndianRupee, Loader2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useGetWallet,
  useGetWithdrawals,
  useSubmitWithdrawal,
} from "../hooks/useQueries";

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function WithdrawSection() {
  const { data: wallet } = useGetWallet();
  const { data: withdrawals, isLoading } = useGetWithdrawals();
  const { mutateAsync: submitWithdrawal, isPending } = useSubmitWithdrawal();

  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [coinAmount, setCoinAmount] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const balance = Number(wallet?.balance ?? 0);
  const coinsNum = Number.parseInt(coinAmount, 10) || 0;
  const inrEquivalent = ((coinsNum / 100) * 3).toFixed(2);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!accountNumber.trim()) e.accountNumber = "Account number is required";
    if (!ifscCode.trim()) e.ifscCode = "IFSC code is required";
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.toUpperCase()))
      e.ifscCode = "Invalid IFSC code format";
    if (!coinsNum || coinsNum < 100)
      e.coinAmount = "Minimum 100 coins required";
    if (coinsNum > balance)
      e.coinAmount = `Insufficient balance (${balance} coins available)`;
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    try {
      const success = await submitWithdrawal({
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.toUpperCase().trim(),
        coinAmount: BigInt(coinsNum),
      });
      if (success) {
        toast.success("Money Instantly Credited!", {
          description: `₹${inrEquivalent} has been instantly credited to your bank account.`,
        });
        setAccountNumber("");
        setIfscCode("");
        setCoinAmount("");
      } else {
        toast.error("Withdrawal failed. Please try again.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    }
  };

  const statusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === "credited" || s === "completed")
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s === "pending")
      return "bg-warning/10 text-warning-foreground border-warning/20";
    return "bg-muted text-muted-foreground";
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Withdraw Earnings
        </h2>
        <p className="text-muted-foreground mb-8">
          100 coins = ₹3. Instant transfer to your bank account.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl border border-border shadow-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg hero-gradient flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Bank Transfer</h3>
                  <p className="text-xs text-muted-foreground">
                    Balance: {balance.toLocaleString("en-IN")} coins (₹
                    {((balance / 100) * 3).toFixed(2)})
                  </p>
                </div>
              </div>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                data-ocid="withdraw.instant_credit.badge"
              >
                <Zap className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                Instant Bank Credit
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="account">Account Number</Label>
                <Input
                  id="account"
                  placeholder="Enter bank account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  data-ocid="withdraw.account.input"
                />
                {errors.accountNumber && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="withdraw.account.error_state"
                  >
                    {errors.accountNumber}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="ifsc">IFSC Code</Label>
                <Input
                  id="ifsc"
                  placeholder="e.g. SBIN0001234"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  data-ocid="withdraw.ifsc.input"
                />
                {errors.ifscCode && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="withdraw.ifsc.error_state"
                  >
                    {errors.ifscCode}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="coins">Coins to Redeem</Label>
                <Input
                  id="coins"
                  type="number"
                  placeholder="Min. 100 coins"
                  value={coinAmount}
                  onChange={(e) => setCoinAmount(e.target.value)}
                  min="100"
                  data-ocid="withdraw.coins.input"
                />
                {coinsNum >= 100 && (
                  <p className="text-xs text-success flex items-center gap-1">
                    <IndianRupee className="w-3 h-3" /> ₹{inrEquivalent} will be
                    instantly credited
                  </p>
                )}
                {errors.coinAmount && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="withdraw.coins.error_state"
                  >
                    {errors.coinAmount}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full hero-gradient text-white border-0"
                data-ocid="withdraw.submit_button"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 mr-2 fill-white" />
                )}
                {isPending ? "Processing..." : "Withdraw Instantly"}
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl border border-border shadow-card p-6"
          >
            <h3 className="font-bold text-foreground mb-4">
              Withdrawal History
            </h3>
            {isLoading ? (
              <div
                className="space-y-2"
                data-ocid="withdraw.history.loading_state"
              >
                {["w1", "w2", "w3"].map((k) => (
                  <Skeleton key={k} className="h-10 w-full" />
                ))}
              </div>
            ) : !withdrawals?.length ? (
              <div
                className="text-center py-10 text-muted-foreground"
                data-ocid="withdraw.history.empty_state"
              >
                No withdrawals yet.
              </div>
            ) : (
              <Table data-ocid="withdraw.history.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Coins</TableHead>
                    <TableHead>INR</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawals.map((w, i) => (
                    <TableRow
                      key={String(w.id)}
                      data-ocid={`withdraw.history.row.${i + 1}`}
                    >
                      <TableCell className="text-sm font-mono">
                        {w.accountNumber.slice(0, 4)}****
                        {w.accountNumber.slice(-4)}
                      </TableCell>
                      <TableCell className="font-bold">
                        {Number(w.coins)}
                      </TableCell>
                      <TableCell className="font-semibold text-emerald-700">
                        ₹{((Number(w.coins) / 100) * 3).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColor(w.status)}>
                          {w.status.toLowerCase() === "credited" ? (
                            <span className="flex items-center gap-1">
                              <Zap className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                              {w.status}
                            </span>
                          ) : (
                            w.status
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(w.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
