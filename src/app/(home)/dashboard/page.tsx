"use client";
import { ChartAreaInteractive } from "@/src/components/ChartAreaInteractive";
import { UnifiedInbox } from "./_components/unified-inbox/unified-inbox";
import { MetricsCards } from "./_components/metrics-cards/metrics-cards";
import { useGetStartedForm } from "@/src/components/questionnaire/_hooks/useGetStaredForm";
import MissingOnBoardingCard from "./_components/missingOnBoardingCard";
import { DashboardSkeleton } from "./_components/skeleton/dashboardSkeleton";
import {
  FormalReconciliationCard,
  LastReconciliationCard,
  LiveReconciliationCard,
} from "./_components/bank-reconciliation";
import { useBankReconciliation } from "./hooks/useBankReconciliation";

export default function Dashboard() {
  const { fetchData, loading } = useGetStartedForm();
  const {
    formalReconciliation,
    lastReconciliation,
    realTimeReconciliation,
    loading: reconciliationLoading,
    selectedYear,
    selectedMonth,
    refreshRealTime,
    changePeriod,
  } = useBankReconciliation();

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="px-4 lg:px-6">
            <MetricsCards />
          </div>
          <div className="px-4 lg:px-6">
            {fetchData?.get_started_complete === true &&
              fetchData?.onboarding_complete === false && (
                <MissingOnBoardingCard />
              )}
          </div>
          <div className="px-4 lg:px-6">
            <div className="grid gap-4 md:grid-cols-3">
              <FormalReconciliationCard
                data={formalReconciliation}
                loading={reconciliationLoading}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                onYearChange={(year) => changePeriod(year, selectedMonth)}
                onMonthChange={(month) => changePeriod(selectedYear, month)}
              />
              <LiveReconciliationCard
                data={realTimeReconciliation}
                handleRefreshRealTimeReconciliation={refreshRealTime}
              />
              <LastReconciliationCard data={lastReconciliation} />
            </div>
          </div>
          <div className="px-4 lg:px-6">
            <UnifiedInbox />
          </div>
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
        </div>
      </div>
    </div>
  );
}
