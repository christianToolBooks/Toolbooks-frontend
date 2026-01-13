"use client";

import { Edit, RefreshCw, X } from "lucide-react";
import { Button } from "../../ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useBusinessProfile } from "../myBusiness/hooks/useBusinessProfile";
import { FinancialOverview } from "./sections/financial-overview";
import { BillsDetails } from "./sections/bill-pay-details";
import { TaxReturnPreparation } from "./sections/tax-return-preparation";
import { InvoicingModuleSettingsCard } from "./sections/invoicing-module-settings";
import { PayrollModuleCard } from "@/src/app/onboarding/_components/steps/toolbooks-modules-step/PayrollModuleCard";
import { PayrollSettingsCard } from "./sections/payroll-module-settings";

export function MyModulesView() {
  const {
    handleUpdateFinancialOverview,
    getBusinessProfileComplete,
    loading,
    error,
    businessProfileComplete,
  } = useBusinessProfile();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    getBusinessProfileComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["businessProfile"] });
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <p>Loading modules information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <p className="text-red-500">Error loading modules information</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={refetch} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Modules</h1>
          <p className="text-muted-foreground">
            Comprehensive view of your modules information
          </p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} disabled={isUpdating}>
          {isUpdating ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : isEditing ? (
            <X className="h-4 w-4 mr-2" />
          ) : (
            <Edit className="h-4 w-4 mr-2" />
          )}
          {isUpdating ? "Saving..." : isEditing ? "Cancel" : "Edit Business"}
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="h-full">
          <FinancialOverview
            financialOverview={businessProfileComplete?.financialOverview}
            isEditing={isEditing}
            onSave={async (data) => {
              const financialOverviewId =
                businessProfileComplete?.financialOverview?.id ?? "";
              if (data) {
                await handleUpdateFinancialOverview(data, financialOverviewId);
              }
            }}
          />
        </div>
        <div className="h-full">
          <BillsDetails
            billPayModuleSettings={
              businessProfileComplete?.billPayModuleSettings ?? undefined
            }
          />
        </div>
        <div>
          <TaxReturnPreparation
            taxReturnPreparation={
              businessProfileComplete?.taxReturnPreparation ?? undefined
            }
          />
        </div>
        <div className="h-full">
          <InvoicingModuleSettingsCard
            invoicingModuleSettings={
              businessProfileComplete?.invoicingModuleSettings ?? undefined
            }
          />
        </div>
        <div className="h-full">
          <PayrollSettingsCard
            payrollModuleSettings={
              businessProfileComplete?.payrollModuleSettings ?? undefined
            }
          />
        </div>
      </div>
      <div className="text-sm text-muted-foreground border-t pt-4">
        <div className="flex flex-wrap gap-4">
          {businessProfileComplete?.createdAt && (
            <p>
              Created:{" "}
              {new Date(businessProfileComplete.createdAt).toLocaleDateString()}
            </p>
          )}
          {businessProfileComplete?.updatedAt && (
            <p>
              Last Updated:{" "}
              {new Date(businessProfileComplete.updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
