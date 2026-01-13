"use client";

import { useState } from "react";
import type {
  BusinessProfile,
  FinancialOverview,
} from "@/src/types/questionnaire";
import { AddonCode } from "@/src/types/paymentMethods";
import { useSubscriptionFlow } from "../_hooks/useSubscriptionFlow";
import { ModuleDecision } from "./module-selector/types";
import { ModuleDetailsView } from "./module-selector/ModuleDetailsView";
import { ModuleOverviewView } from "./module-selector/ModuleOverviewView";
import { modulesData } from "./module-selector/modulesData";

interface ModuleSelectorProps {
  onChange: (
    field: keyof BusinessProfile | keyof FinancialOverview,
    value: boolean | number | string,
    section: "bookkeepingSettings" | "companyProfile" | "businessFinancialOverview"
  ) => void;
  subscriptionFlow: ReturnType<typeof useSubscriptionFlow>;
}

export function ModuleSelector({ onChange, subscriptionFlow }: ModuleSelectorProps) {
  const s = subscriptionFlow;
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [moduleDecisions, setModuleDecisions] = useState<Record<string, ModuleDecision>>({
    invoicing: null,
    billPay: null,
    payroll: null,
    tax: null,
  });
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPayrollOption, setSelectedPayrollOption] = useState<"connect" | "complete" | null>(null);

  const modules = modulesData;
  const currentModule = modules[currentModuleIndex];
  const progress = ((currentModuleIndex + 1) / modules.length) * 100;
  const allDecisionsMade = Object.values(moduleDecisions).every((decision) => decision !== null);
  const canGoBack = currentModuleIndex > 0;
  const canGoNext = currentModuleIndex < modules.length - 1;
  const isLastModule = currentModuleIndex === modules.length - 1;

  const goToModule = (index: number) => {
    setCurrentModuleIndex(index);
    setShowDetails(false);
  };

  const canAccessModule = (index: number): boolean => {
    if (index === currentModuleIndex) return true;
    if (index < currentModuleIndex) return true;
    if (index === currentModuleIndex + 1) {
      const currentModuleId = modules[currentModuleIndex].id;
      return moduleDecisions[currentModuleId] !== null;
    }
    for (let i = 0; i < index; i++) {
      if (moduleDecisions[modules[i].id] === null) return false;
    }
    return true;
  };

  const handlePayrollCheckboxChange = (option: "connect" | "complete", checked: boolean) => {
    if (checked) {
      setSelectedPayrollOption(option);
    } else {
      if (selectedPayrollOption === option) {
        setSelectedPayrollOption(null);
      }
    }
  };

  const handleDecision = (decision: ModuleDecision) => {
    setModuleDecisions((prev) => ({ ...prev, [currentModule.id]: decision }));

    if (decision === "add") {
      switch (currentModule.id) {
        case "invoicing":
          onChange("hasInvoices", true, "bookkeepingSettings");
          if (!s.addons.includes(AddonCode.INVOICING)) s.toggleAddon(AddonCode.INVOICING);
          break;
        case "billPay":
          onChange("hasBills", true, "bookkeepingSettings");
          if (!s.addons.includes(AddonCode.BILL_PAY)) s.toggleAddon(AddonCode.BILL_PAY);
          break;
        case "payroll":
          if (selectedPayrollOption) {
            onChange("hasPayroll", true, "bookkeepingSettings");
            if (selectedPayrollOption === "connect") {
              if (s.addons.includes(AddonCode.PAYROLL_COMPLETE)) s.toggleAddon(AddonCode.PAYROLL_COMPLETE);
              if (!s.addons.includes(AddonCode.PAYROLL_CONNECT)) s.toggleAddon(AddonCode.PAYROLL_CONNECT);
            } else {
              if (s.addons.includes(AddonCode.PAYROLL_CONNECT)) s.toggleAddon(AddonCode.PAYROLL_CONNECT);
              if (!s.addons.includes(AddonCode.PAYROLL_COMPLETE)) s.toggleAddon(AddonCode.PAYROLL_COMPLETE);
            }
          }
          break;
        case "tax":
          break;
      }
    } else if (decision === "reject") {
      switch (currentModule.id) {
        case "invoicing":
          onChange("hasInvoices", false, "bookkeepingSettings");
          if (s.addons.includes(AddonCode.INVOICING)) s.toggleAddon(AddonCode.INVOICING);
          break;
        case "billPay":
          onChange("hasBills", false, "bookkeepingSettings");
          if (s.addons.includes(AddonCode.BILL_PAY)) s.toggleAddon(AddonCode.BILL_PAY);
          break;
        case "payroll":
          onChange("hasPayroll", false, "bookkeepingSettings");
          if (s.addons.includes(AddonCode.PAYROLL_CONNECT)) s.toggleAddon(AddonCode.PAYROLL_CONNECT);
          if (s.addons.includes(AddonCode.PAYROLL_COMPLETE)) s.toggleAddon(AddonCode.PAYROLL_COMPLETE);
          setSelectedPayrollOption(null);
          break;
      }
    }

    setTimeout(() => {
      if (isLastModule) {
        setShowDetails(false);
      } else if (canGoNext) {
        setCurrentModuleIndex((prev) => prev + 1);
        setShowDetails(false);
      }
    }, 500);
  };

  if (showDetails) {
    return (
      <ModuleDetailsView
        currentModule={currentModule}
        currentModuleIndex={currentModuleIndex}
        modulesLength={modules.length}
        progress={progress}
        decision={moduleDecisions[currentModule.id]}
        selectedPayrollOption={selectedPayrollOption}
        onBack={() => setShowDetails(false)}
        onPayrollCheckboxChange={handlePayrollCheckboxChange}
        onDecision={handleDecision}
        subscriptionFlow={s}
      />
    );
  }

  return (
    <ModuleOverviewView
      modules={modules}
      currentModule={currentModule}
      currentModuleIndex={currentModuleIndex}
      moduleDecisions={moduleDecisions}
      progress={progress}
      allDecisionsMade={allDecisionsMade}
      canGoBack={canGoBack}
      canAccessModule={canAccessModule}
      goToModule={goToModule}
      setShowDetails={setShowDetails}
    />
  );
}
