import { Badge } from "@/src/components/ui/badge";
import { Check } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ModuleCardProps {
  module: {
    id: string;
    name: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
    borderColor: string;
  };
  index: number;
  currentModuleIndex: number;
  decision: "add" | "reject" | "unsure" | null;
  canAccess: boolean;
  onClick: () => void;
}

export function ModuleCard({
  module,
  index,
  currentModuleIndex,
  decision,
  canAccess,
  onClick,
}: ModuleCardProps) {
  const ModIcon = module.icon;
  const isCurrent = index === currentModuleIndex;
  const isCompleted = decision !== null;

  return (
    <div
      className={`relative p-6 rounded-xl border-1 transition-all ${
        canAccess ? "cursor-pointer hover:shadow-md" : "cursor-not-allowed"
      } ${
        isCurrent
          ? `${module.borderColor} ${module.bgColor} shadow-lg scale-105`
          : isCompleted
            ? "border-chart-1 bg-chart-5/50 opacity-80"
            : !canAccess
              ? "border-gray-200 bg-gray-50 opacity-50"
              : "border-gray-200 bg-white"
      }`}
      onClick={() => canAccess && onClick()}
    >
      {isCompleted && (
        <div className="absolute -top-2 -right-2 z-10 bg-chart-1 rounded-full p-1">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
      {!canAccess && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-xl">
          <span className="text-sm font-medium text-gray-500">Locked</span>
        </div>
      )}
      <div
        className={`p-4 rounded-full mx-auto w-fit mb-3 ${
          isCurrent ? module.bgColor : isCompleted ? "bg-chart-5/50" : "bg-gray-100"
        }`}
      >
        <ModIcon
          className={`w-12 h-12 ${
            isCurrent ? module.color : isCompleted ? "text-chart-1" : "text-gray-400"
          }`}
        />
      </div>
      <h4
        className={`font-semibold text-center text-sm ${
          isCurrent ? module.color : isCompleted ? "text-chart-1" : "text-gray-600"
        }`}
      >
        {module.name}
      </h4>
      {decision && (
        <Badge
          className="mt-2 w-full justify-center text-xs"
          variant={
            decision === "add"
              ? "default"
              : decision === "reject"
                ? "destructive"
                : "secondary"
          }
        >
          {decision === "add" ? "Added" : decision === "reject" ? "Skipped" : "Info Requested"}
        </Badge>
      )}
    </div>
  );
}
