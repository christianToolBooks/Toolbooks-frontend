import { Button } from "@/src/components/ui/button";
import { Check, X, HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { ModuleData, ModuleDecision } from "./types";

interface ModuleDecisionButtonsProps {
  currentModule: ModuleData;
  selectedPayrollOption: "connect" | "complete" | null;
  onDecision: (decision: ModuleDecision) => void;
}

export function ModuleDecisionButtons({
  currentModule,
  selectedPayrollOption,
  onDecision,
}: ModuleDecisionButtonsProps) {
  return (
    <div className="flex gap-4">
      <Button
        type="button"
        size="lg"
        className="flex-1 bg-chart-1 hover:bg-chart-2 active:scale-95 transition-transform"
        onClick={() =>
          currentModule.id === "payroll" && !selectedPayrollOption
            ? null
            : onDecision("add")
        }
        disabled={currentModule.id === "payroll" && !selectedPayrollOption}
      >
        <Check className="w-5 h-5 mr-2" />
        Add This Module
      </Button>
      <Button
        type="button"
        size="lg"
        variant="destructive"
        className="flex-1 bg-chart-3 hover:bg-chart-3/80 active:scale-95 transition-transform cursor-pointer"
        onClick={() => onDecision("reject")}
      >
        <X className="w-5 h-5 mr-2" />
        Not Interested
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="flex-1 cursor-pointer active:scale-95 transition-transform"
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            Need More Info
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request More Information</DialogTitle>
            <DialogDescription>
              One of our specialists will contact you within 24 hours to discuss{" "}
              {currentModule.name} in detail.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-gray-600">
              We&lsquo;ll answer all your questions about:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              {currentModule.features.slice(0, 3).map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={() => onDecision("unsure")}
                className="flex-1"
              >
                Request Information
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onDecision("reject")}
                className="flex-1"
              >
                Skip for Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
