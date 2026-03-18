import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coins, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSaveCallerUserProfile } from "../hooks/useQueries";

interface ProfileSetupModalProps {
  open: boolean;
}

export default function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [name, setName] = useState("");
  const { mutateAsync, isPending } = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await mutateAsync({ name: name.trim() });
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" data-ocid="profile_setup.dialog">
        <DialogHeader>
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 rounded-full hero-gradient flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-bold">
            Welcome to NewsRewards!
          </DialogTitle>
          <DialogDescription className="text-center">
            Set up your profile to start earning coins by reading news.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Your Name</Label>
            <Input
              id="profile-name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-ocid="profile_setup.input"
            />
          </div>
          <Button
            type="submit"
            className="w-full hero-gradient text-white border-0"
            disabled={isPending || !name.trim()}
            data-ocid="profile_setup.submit_button"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            {isPending ? "Setting up..." : "Get Started & Earn Coins"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
