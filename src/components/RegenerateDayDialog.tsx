import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2 } from "lucide-react";

interface RegenerateDayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayNumber: number;
  onRegenerate: (changeRequest: string) => Promise<void>;
  isLoading?: boolean;
}

const quickSuggestions = [
  "More outdoor activities",
  "More food experiences",
  "More cultural activities",
  "More relaxation time",
  "Earlier start time",
  "Later start time",
  "Budget-friendly options",
  "Premium experiences",
];

export function RegenerateDayDialog({
  open,
  onOpenChange,
  dayNumber,
  onRegenerate,
  isLoading = false,
}: RegenerateDayDialogProps) {
  const [changeRequest, setChangeRequest] = useState("");

  const handleQuickSuggestion = (suggestion: string) => {
    setChangeRequest(prev => prev ? `${prev}, ${suggestion.toLowerCase()}` : suggestion);
  };

  const handleSubmit = async () => {
    if (!changeRequest.trim()) return;
    await onRegenerate(changeRequest);
    setChangeRequest("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Regenerate Day {dayNumber}
          </DialogTitle>
          <DialogDescription>
            Tell us what you'd like to change about this day's activities
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Quick suggestions</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-colors"
                  onClick={() => handleQuickSuggestion(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-2">Your request</p>
            <Textarea
              value={changeRequest}
              onChange={(e) => setChangeRequest(e.target.value)}
              placeholder="e.g., I want more beach activities in the morning and a nice sunset dinner restaurant"
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!changeRequest.trim() || isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Regenerate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
