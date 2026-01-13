import { CheckCircle2, Edit2 } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { useEffect, useState } from "react";
import { BusinessProfile, FinancialOverview } from "@/src/types/questionnaire";
import { getServiceLevelFromAmount } from "../../_utils/questionnaire-logic";
import { Button } from "@/src/components/ui/button";

interface CurrentServiceLevelProps {
  expenseRange: string;
  isEditingExpense: boolean;
  setIsEditingExpense: (value: boolean) => void;
  onChange: (
    field:
      | keyof BusinessProfile
      | keyof FinancialOverview
      | "employees"
      | "states"
      | "term",
    value: boolean | number | string,
    section:
      | "bookkeepingSettings"
      | "companyProfile"
      | "businessFinancialOverview"
      | "createSubscription"
      | "getPreviewQuote"
  ) => void;
}

export function CurrentServiceLevel({
  expenseRange,
  isEditingExpense,
  setIsEditingExpense,
  onChange,
}: CurrentServiceLevelProps) {
  const [tempExpense, setTempExpense] = useState(
    (expenseRange ?? 0).toString()
  );

  useEffect(() => {
    setTempExpense((expenseRange ?? 0).toString());
  }, [expenseRange]);

  const serviceLevel = getServiceLevelFromAmount(parseFloat(expenseRange ?? "0"));
  const baseFee = serviceLevel.baseFee;


  const handleExpenseSubmit = () => {
    const newValue = parseFloat(tempExpense.replace(/,/g, ""));
    if (!isNaN(newValue) && newValue > 0) {
      onChange("avg_monthly_expenses", newValue, "businessFinancialOverview");
      setIsEditingExpense(false);
    }
  };

  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-blue-600" />
          <h3 className="text-md font-semibold text-blue-900">
            Your Current Service Level
          </h3>
        </div>
        <button
          onClick={() => setIsEditingExpense(!isEditingExpense)}
          className="flex items-center gap-1 text-sm text-chart-1 hover:text-blue-800 cursor-pointer"
        >
          <Edit2 className="h-3 w-3" />
          Edit Expenses
        </button>
      </div>

      <div>
        <p className="text-xl font-bold text-blue-800">{serviceLevel.name}</p>
        <p className="text-sm text-chart-1">
          {isEditingExpense ? (
            <span className="flex justify-center items-center gap-2 mt-2">
              <span className="text-sm text-chart-1">Monthly expenses: $</span>
              <input
                type="number"
                value={tempExpense}
                onChange={(e) => setTempExpense(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleExpenseSubmit();
                }}
                className="w-32 px-2 py-2 border border-chart-3 rounded"
                placeholder="Monthly expenses"
                min="0"
                step="0.01"
              />
              <Button
                onClick={handleExpenseSubmit}
                className="bg-chart-1 text-white rounded text-xs hover:bg-chart-1/80"
              >
                Update
              </Button>
            </span>
          ) : (
            `Monthly expenses: $${(parseFloat(expenseRange ?? "0")).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          )}
        </p>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <Badge variant="secondary" className="text-lg px-4 py-2">
          ${baseFee}/month
        </Badge>
      </div>
    </div>
  );
}
