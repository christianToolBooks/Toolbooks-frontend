/* eslint-disable @typescript-eslint/no-explicit-any */
// app/onboarding/_components/wizard-step-renderer.tsx
"use client";

import { ToolbooksModulesStep } from "./steps/toolbooks-modules-step";
import BookkeepingServicesStep from "./steps/bookkeping-services-step";
import BusinessDetailsStep from "./steps/business-details-step";
import { BusinessInfoStep } from "./steps/business-info-step";
import { TaxReturnPreparationCard } from "./steps/bookkeping-services-step/TaxReturnPreparationCard";

import type { 
  OnboardingStep, 
  Contact, 
  OnboardingPayload, 
  OnboardingCompanyProfile, 
  OnboardingFinancialOverview
} from "@/src/types/questionnaire";

interface WizardStepRendererProps {
  currentStep: OnboardingStep;
  data: Partial<OnboardingPayload>;
  primaryContact: Contact;
  onUpdateSection: <K extends keyof OnboardingPayload>(
    key: K, 
    patch: Partial<OnboardingPayload[K]> | OnboardingPayload[K]
  ) => void;
  onUpdateBusinessContactAt: (index: number, patch: Partial<Contact>) => void;
  onAddAuthorizedContact: () => void;
  onRemoveBusinessContact: (index: number) => void;
  onUpdateAddressAt: (index: number, patch: any) => void;
  onAddAddress: () => void;
  onRemoveAddress: (index: number) => void;
  getFieldError: (field: string) => string | undefined;
  isLoading: boolean;
}

export function WizardStepRenderer({
  currentStep,
  data,
  primaryContact,
  onUpdateSection,
  onUpdateBusinessContactAt,
  onAddAuthorizedContact,
  onRemoveBusinessContact,
  onUpdateAddressAt,
  onAddAddress,
  onRemoveAddress,
  getFieldError,
  isLoading,
}: WizardStepRendererProps) {
  
  switch (currentStep) {
    case "business-info": {
      return (
        <BusinessInfoStep
          businessInfo={data.businessProfile ?? { 
            business_name: "", 
            hasBills: false, 
            hasInvoices: false, 
            hasPayroll: false, 
            hasTaxReturnPreparation: false 
          }}
          primaryContact={primaryContact}
          businessContacts={data.businessContacts ?? []}
          emergencyContact={data.businessEmergencyContact}
          onBusinessInfoChange={(patch) => onUpdateSection("businessProfile", patch)}
          onPrimaryContactChange={(patch) => onUpdateBusinessContactAt(0, patch)}
          onContactChange={onUpdateBusinessContactAt}
          onAddContact={onAddAuthorizedContact}
          onRemoveContact={onRemoveBusinessContact}
          businessAddresses={data.businessAddresses ?? []}
          onAddAddress={onAddAddress}
          onRemoveAddress={onRemoveAddress}
          onAddressChange={onUpdateAddressAt}
          onEmergencyContactChange={(patch) =>
            onUpdateSection("businessEmergencyContact", patch)
          }
          getFieldError={getFieldError}
          disabled={isLoading}
        />
      );
    }

    case "business-details": {
      return (
        <BusinessDetailsStep
          businessDetails={
            (data.businessCompanyProfile ?? {}) as OnboardingCompanyProfile
          }
          financialOverview={
            (data.businessFinancialOverview ?? {}) as OnboardingFinancialOverview
          }
          onFinancialOverviewChange={(patch) =>
            onUpdateSection("businessFinancialOverview", patch)
          }
          onBusinessDetailsChange={(patch) =>
            onUpdateSection("businessCompanyProfile", patch)
          }
          getFieldError={getFieldError}
        />
      );
    }

    case "bookkeeping-services": {
      return (
        <>
          <BookkeepingServicesStep
            bookkeepingSettings={data.bookkeepingSettings!}
            taxReturnPreparation={data.taxReturnPreparation!}
            onBookkeepingSettingsChange={(patch) =>
              onUpdateSection("bookkeepingSettings", patch)
            }
            onTaxReturnPreparationChange={(patch) =>
              onUpdateSection("taxReturnPreparation", patch)
            }
            getFieldError={getFieldError}
          />
          {data.businessProfile?.hasTaxReturnPreparation && (
            <TaxReturnPreparationCard
              taxReturnPreparation={data.taxReturnPreparation ?? {
                business: {
                  biz_last_filed_year: undefined,
                  biz_num_states_filed: undefined,
                  business_form_filed: undefined,
                  biz_tax_states: [],
                },
                individual: {
                  ind_last_filed_year: undefined,
                  ind_num_states_filed: undefined,
                  ind_tax_states: [],
                },
              }}
              onTaxReturnPreparationChange={(patch) =>
                onUpdateSection("taxReturnPreparation", patch)
              }
              getFieldError={getFieldError}
              disabled={isLoading}
            />
          )}
        </>
      );
    }

    case "toolbooks-modules": {
      const hasInvoicing = data.businessProfile?.hasInvoices === true;
      const hasBillPay = data.businessProfile?.hasBills === true;
      const hasPayroll = data.businessProfile?.hasPayroll === true;
      const noServicesEnabled = data.businessProfile?.hasBills === false && 
                               data.businessProfile?.hasInvoices === false && 
                               data.businessProfile?.hasPayroll === false;
      if (noServicesEnabled) {
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="rounded-lg p-6 max-w-md">
              <h3 className="text-lg font-medium text-chart-1 mb-2">
                No Additional Services Required
              </h3>
              <p className="text-chart-2">
                Based on your selections, you don&apos;t have bills, invoices, or payroll to manage. 
                You can proceed to complete your onboarding or go back to enable any services you might need.
              </p>
            </div>
          </div>
        );
      }

      return (
        <ToolbooksModulesStep
          payrollModule={data.payrrollSettings!}
          invoicingModule={data.invoicingSettings!}
          billPayModule={data.billPaySettings!}
          onPayrollModuleChange={(patch) => onUpdateSection("payrrollSettings", patch)}
          onInvoicingModuleChange={(patch) => onUpdateSection("invoicingSettings", patch)}
          onBillPayModuleChange={(patch) => onUpdateSection("billPaySettings", patch)}
          hasInvoicing={hasInvoicing}
          hasBillPay={hasBillPay}
          hasPayroll={hasPayroll}
          getFieldError={getFieldError}
          disabled={isLoading}
        />
      );
    }

    default:
      return null;
  }
}