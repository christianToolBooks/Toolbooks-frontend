"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import type { OnboardingPayload } from "@/src/types/questionnaire";
import { getQuestionnaire } from "@/src/lib/services/questionnarieService";

type UseOnboardingDataOptions = {
  autoLoad?: boolean;
  onLoaded?: (incoming: Partial<OnboardingPayload>) => void;
  normalize?: (server: unknown) => Partial<OnboardingPayload>;
};

type UseOnboardingDataReturn = {
  isLoading: boolean;
  loadError: string | null;
  isLoaded: boolean;
  loadAndFill: () => Promise<void>;
};

export function useOnboardingData(
  options?: UseOnboardingDataOptions
): UseOnboardingDataReturn {
  const [isLoading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoaded, setLoaded] = useState(false);

  const normalize: (server: unknown) => Partial<OnboardingPayload> = useMemo(
    () =>
      options?.normalize ??
      ((server) => (server as Partial<OnboardingPayload>) ?? {}),
    [options?.normalize]
  );

  const loadAndFill = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const res = await getQuestionnaire();
      if ("statusCode" in res) {
        setLoadError(res.message ?? "Failed to load onboarding data");
        setLoaded(false);
        return;
      }

      if (!res?.data) {
        setLoadError("Invalid API response: missing data");
        setLoaded(false);
        return;
      }

      const normalized = normalize(res.data);
      options?.onLoaded?.(normalized);
      setLoaded(true);
    } catch (error) {
      console.error("❌ Unexpected error loading onboarding data:", error);
      setLoadError("Unexpected error loading onboarding data");
      setLoaded(false);
    } finally {
      setLoading(false);
    }
  }, [normalize, options]);

  useEffect(() => {
    if (options?.autoLoad !== false && !isLoaded) {
      void loadAndFill();
    }
  }, [options?.autoLoad, isLoaded, loadAndFill]);

  return { isLoading, loadError, isLoaded, loadAndFill };
}
