import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Progress } from "@/src/components/ui/progress";
import { ArrowLeft, Check, X, HelpCircle } from "lucide-react";
import { ModuleData, ModuleDecision } from "./types";
import { useSubscriptionFlow } from "../../_hooks/useSubscriptionFlow";
import { ModuleFeatures } from "./ModuleFeatures";
import { PayrollOptions } from "./PayrollOptions";
import { ModuleFAQ } from "./ModuleFAQ";
import { ModuleDecisionButtons } from "./ModuleDecisionButtons";

interface ModuleDetailsViewProps {
  currentModule: ModuleData;
  currentModuleIndex: number;
  modulesLength: number;
  progress: number;
  decision: ModuleDecision;
  selectedPayrollOption: "connect" | "complete" | null;
  onBack: () => void;
  onPayrollCheckboxChange: (option: "connect" | "complete", checked: boolean) => void;
  onDecision: (decision: ModuleDecision) => void;
  subscriptionFlow: ReturnType<typeof useSubscriptionFlow>;
}

export function ModuleDetailsView({
  currentModule,
  currentModuleIndex,
  modulesLength,
  progress,
  decision,
  selectedPayrollOption,
  onBack,
  onPayrollCheckboxChange,
  onDecision,
  subscriptionFlow,
}: ModuleDetailsViewProps) {
  const Icon = currentModule.icon;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Module {currentModuleIndex + 1} of {modulesLength}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className={`rounded-xl p-8 ${currentModule.bgColor}`}>
        <div className="flex flex-col-reverse gap-16 mb-6">
          <div className="grid grid-cols-2">
            <div className="flex-1 justify-center">
              <div className="flex gap-1 mb-4">
                <Icon className={`w-10 h-10 ${currentModule.color}`} />
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                  {currentModule.name}
                </h2>
              </div>
              <p className="text-md text-justify text-gray-700 mb-4">
                {currentModule.longDescription}
              </p>
            </div>
            <div className="flex justify-center items-center">
              {currentModule.pricing === "tax" ? (
                <div className="flex flex-col gap-2">
                  <Badge className="text-xl font-bold px-4 py-2 text-center">
                    Business: $1,000/year
                  </Badge>
                  <Badge className="text-xl font-bold px-4 py-2 text-center">
                    Individual: $500/year
                  </Badge>
                </div>
              ) : (
                <Badge className="text-3xl font-bold px-4 py-1">
                  {currentModule.pricing}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button
              className="cursor-pointer active:scale-95 transition-transform"
              variant="outline"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4 text-chart-1" />
              Back to Selection
            </Button>

            {decision && (
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    decision === "add"
                      ? "default"
                      : decision === "reject"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  Current Decision:{" "}
                  {decision === "add"
                    ? "Added"
                    : decision === "reject"
                    ? "Skipped"
                    : "Info Requested"}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <ModuleFeatures features={currentModule.features} />

        {currentModule.id === "payroll" && decision !== "reject" && (
          <PayrollOptions
            selectedPayrollOption={selectedPayrollOption}
            onCheckboxChange={onPayrollCheckboxChange}
            subscriptionFlow={subscriptionFlow}
          />
        )}

        <ModuleFAQ faq={currentModule.faq} />

        <ModuleDecisionButtons
          currentModule={currentModule}
          selectedPayrollOption={selectedPayrollOption}
          onDecision={onDecision}
        />
      </Card>
    </div>
  );
}
