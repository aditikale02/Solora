import { useLocation } from "wouter";
import { LockKeyhole } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function LoginPromptDialog({
  open,
  onOpenChange,
  title = "Please login to continue",
  description = "This action is available after login so we can keep your saved items and inquiries in sync.",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}) {
  const [, navigate] = useLocation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[#D7C6A5] bg-[#FBF7F1] text-[#1A1714] sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1714] text-[#F7F0E6]">
            <LockKeyhole className="size-4" />
          </div>
          <DialogTitle className="font-serif text-3xl">{title}</DialogTitle>
          <DialogDescription className="text-sm text-[#6A5A47]">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-start">
          <Button
            type="button"
            onClick={() => {
              onOpenChange(false);
              navigate("/login");
            }}
            className="bg-[#1A1714] text-[#F7F0E6] hover:bg-[#2B2520]"
          >
            Login now
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#D7C6A5] bg-white"
          >
            Keep browsing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
