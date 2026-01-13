import { Checkbox } from "@/src/components/ui/checkbox";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { useSubscriptionFlow } from "../../_hooks/useSubscriptionFlow";

interface PayrollOptionsProps {
  selectedPayrollOption: "connect" | "complete" | null;
  onCheckboxChange: (option: "connect" | "complete", checked: boolean) => void;
  subscriptionFlow: ReturnType<typeof useSubscriptionFlow>;
}

export function PayrollOptions({
  selectedPayrollOption,
  onCheckboxChange,
  subscriptionFlow,
}: PayrollOptionsProps) {
  return (
    <div className="bg-white rounded-lg p-6 mb-6 space-y-4">
      <h3 className="text-xl font-semibold mb-4">Choose Your Payroll Option</h3>

      <div
        className={`p-4 rounded-lg border-2 transition-all ${
          selectedPayrollOption === "connect"
            ? "border-chart-1 bg-chart-5/50"
            : "border-gray-200"
        }`}
      >
        <div className="flex items-start gap-3">
          <Checkbox
            id="payroll-connect"
            checked={selectedPayrollOption === "connect"}
            onCheckedChange={(checked) => onCheckboxChange("connect", checked === true)}
            className="mt-1 border-chart-1/60"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="payroll-connect" className="font-semibold text-lg cursor-pointer">
                Payroll Connect
              </Label>
              <Badge>$29/month</Badge>
            </div>
            <p className="text-sm text-gray-600">
              Integration with existing payroll providers and post-payroll reconciliation
            </p>
          </div>
        </div>
      </div>

      <div
        className={`p-4 rounded-lg border-2 transition-all ${
          selectedPayrollOption === "complete"
            ? "border-chart-1 bg-chart-5/50"
            : "border-gray-200"
        }`}
      >
        <div className="flex items-start gap-3">
          <Checkbox
            id="payroll-complete"
            checked={selectedPayrollOption === "complete"}
            onCheckedChange={(checked) => onCheckboxChange("complete", checked === true)}
            className="mt-1 border-chart-1/60"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="payroll-complete" className="font-semibold text-lg cursor-pointer">
                Payroll Complete
              </Label>
              <Badge>$99/month + $15/employee + $35/state</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Complete live payroll processing, tax filings, and compliance
            </p>

            {selectedPayrollOption === "complete" && (
              <div className="mt-4 space-y-3 pt-4 border-t">
                <div>
                  <Label>Number of Employees</Label>
                  <Input
                    type="number"
                    min={0}
                    value={subscriptionFlow.employees}
                    onChange={(e) => subscriptionFlow.setEmployees(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Number of States</Label>
                  <Input
                    type="number"
                    min={0}
                    value={subscriptionFlow.states}
                    onChange={(e) => subscriptionFlow.setStates(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
