// app/onboarding/page.tsx
"use client";

import React from "react";
import { useGuestGuard } from "../auth/hooks/useGuestGuard";
import { redirect, useSearchParams } from "next/navigation";
import OnboardingWizard from "./_components/onboardingWizard";

function OnboardingPage() {
  const { isAuthenticated } = useGuestGuard();
  const search = useSearchParams();
  // ?gs=<id-del-get-started>
  const seedId = search.get("gs") ?? undefined;

  if (!isAuthenticated) {
    redirect("/auth");
  }

  return (
    <div className="container mx-auto py-10">
      <OnboardingWizard  />
    </div>
  );
}

export default OnboardingPage;
