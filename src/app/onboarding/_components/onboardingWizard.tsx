// app/onboarding/_components/onboarding-wizard.tsx
"use client";

import * as React from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

import { StepIndicator } from "./step-indicator";
import { useWizardFormLogic } from "../hooks/use-wizard-form-logic";
import { WizardStepRenderer } from "./wizardStepRenderer";
import { WizardErrorDisplay } from "./wizardErrorDisplay";


function CompletedScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Onboarding Complete!
          </h2>
          <p className="text-muted-foreground mb-6">
            Thank you for completing your business onboarding. We&apos;ll
            review your information and get back to you soon.
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Start New Onboarding
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadErrorBanner({ 
  loadError, 
  isLoading, 
  onRetry 
}: { 
  loadError: string; 
  isLoading: boolean; 
  onRetry: () => void; 
}) {
  return (
    <Card className="mb-4 border-destructive">
      <CardContent className="p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-destructive font-medium">
            We couldn&apos;t load your previous information.
          </p>
          <p className="text-sm text-destructive/80">{loadError}</p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          disabled={isLoading}
          onClick={onRetry}
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          <RotateCcw className="w-4 h-4" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}

function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex items-center justify-center">
      <div className="flex items-center gap-3 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading your information…</span>
      </div>
    </div>
  );
}

export default function OnboardingWizard(): React.JSX.Element {
  const {
    currentStep,
    data,
    errors,
    isSubmitting,
    isLoading,
    loadError,
    completedSteps,
    primaryContact,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    totalSteps,
    updateSection,
    updateBusinessContactAt,
    addAuthorizedContact,
    removeBusinessContact,
    updateAddressAt,
    addAddress,
    removeAddress,
    getFieldError,
    handleNext,
    handlePrevious,
    handleStepClick,
    handleSubmit,
    handleRetryLoad,
  } = useWizardFormLogic();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Business Onboarding
          </h1>
          <p className="text-muted-foreground">
            Let&apos;s get your business set up with our platform
          </p>
        </div>

        {loadError && (
          <LoadErrorBanner 
            loadError={loadError} 
            isLoading={isLoading} 
            onRetry={handleRetryLoad} 
          />
        )}

        <StepIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />

        <Card className="mb-8 relative overflow-hidden">
          {isLoading && <LoadingOverlay />}
          <CardContent className="p-8">
            <WizardStepRenderer
              currentStep={currentStep}
              data={data}
              primaryContact={primaryContact}
              onUpdateSection={updateSection}
              onUpdateBusinessContactAt={updateBusinessContactAt}
              onAddAuthorizedContact={addAuthorizedContact}
              onRemoveBusinessContact={removeBusinessContact}
              onUpdateAddressAt={updateAddressAt}
              onAddAddress={addAddress}
              onRemoveAddress={removeAddress}
              getFieldError={getFieldError}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstStep || isLoading}
            className="flex items-center gap-2 bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            Step {currentStepIndex + 1} of {totalSteps}
          </div>

          {isLastStep ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isLoading}
              className="flex items-center gap-2"
            >
              {(isSubmitting || isLoading) && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              Complete Onboarding
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {isLastStep && <WizardErrorDisplay errors={errors} />}
      </div>
    </div>
  );
}