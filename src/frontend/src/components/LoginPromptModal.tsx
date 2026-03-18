import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { Coins } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface LoginPromptModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginPromptModal({
  open,
  onClose,
}: LoginPromptModalProps) {
  const { login, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isLoggingIn = loginStatus === "logging-in";

  const handleLogin = async () => {
    try {
      await login();
      queryClient.invalidateQueries();
      onClose();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm" data-ocid="login_prompt.dialog">
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 rounded-full hero-gradient flex items-center justify-center">
              <Coins className="w-7 h-7 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center">
            Log in to Earn Coins
          </DialogTitle>
          <DialogDescription className="text-center">
            Create a free account to start earning 50 coins per article read.
            Redeem for real INR!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-2">
          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full hero-gradient text-white border-0"
            data-ocid="login_prompt.login.button"
          >
            {isLoggingIn ? "Signing in..." : "Log In to Start Earning"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            data-ocid="login_prompt.cancel.button"
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
