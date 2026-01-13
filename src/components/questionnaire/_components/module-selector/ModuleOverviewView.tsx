import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Progress } from "@/src/components/ui/progress";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { ArrowRight, ArrowLeft, Check, Info } from "lucide-react";
import { ModuleCard } from "./ModuleCard";
import { ModuleData, ModuleDecision } from "./types";

interface ModuleOverviewViewProps {
  modules: ModuleData[];
  currentModule: ModuleData;
  currentModuleIndex: number;
  moduleDecisions: Record<string, ModuleDecision>;
  progress: number;
  allDecisionsMade: boolean;
  canGoBack: boolean;
  canAccessModule: (index: number) => boolean;
  goToModule: (index: number) => void;
  setShowDetails: (show: boolean) => void;
}

export function ModuleOverviewView({
  modules,
  currentModule,
  currentModuleIndex,
  moduleDecisions,
  progress,
  allDecisionsMade,
  canGoBack,
  canAccessModule,
  goToModule,
  setShowDetails,
}: ModuleOverviewViewProps) {
  const Icon = currentModule.icon;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Module {currentModuleIndex + 1} of {modules.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {modules.map((module, index) => (
          <ModuleCard
            key={module.id}
            module={module}
            index={index}
            currentModuleIndex={currentModuleIndex}
            decision={moduleDecisions[module.id]}
            canAccess={canAccessModule(index)}
            onClick={() => goToModule(index)}
          />
        ))}
      </div>

      <Card className={`rounded-xl p-8 ${currentModule.bgColor}`}>
        <div className="flex items-center gap-2 mb-6">
          <div className={`p-6 rounded-2xl ${currentModule.bgColor} ${currentModule.borderColor}`}>
            <Icon className={`w-16 h-16 ${currentModule.color}`} />
          </div>
          <div className="flex-1 w-[10%]">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentModule.name}
            </h2>
            <p className="text-gray-700">{currentModule.description}</p>
            {moduleDecisions[currentModule.id] && (
              <Badge className="mt-2 bg-chart-4/50 w-fit text-md text-chart-2">
                {moduleDecisions[currentModule.id] === "add"
                  ? "✓ Already Added"
                  : moduleDecisions[currentModule.id] === "reject"
                    ? "✗ Previously Skipped"
                    : "? Info Requested"}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="button" size="lg" className="flex-1" onClick={() => setShowDetails(true)}>
            {moduleDecisions[currentModule.id]
              ? "Review & Change Decision"
              : "View Module Details"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          {canGoBack && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => goToModule(currentModuleIndex - 1)}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Previous Module
            </Button>
          )}
        </div>
      </Card>

      {allDecisionsMade && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-900">
            <strong>All modules reviewed!</strong> You can proceed to the next
            step, or go back to review and change any decisions.
          </AlertDescription>
        </Alert>
      )}

      {currentModuleIndex > 0 && !allDecisionsMade && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            You&lsquo;ve reviewed {currentModuleIndex} of {modules.length} modules.
            You can click on any accessible module icon to review and change your
            decision. Complete the current module to unlock the next one.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
