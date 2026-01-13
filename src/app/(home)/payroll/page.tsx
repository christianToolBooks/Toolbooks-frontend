"use client"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { FileText, Settings, TrendingUp } from "lucide-react"
import { PayrollStats } from "./_components/payroll-stats"
import { AccountMappingManager } from "./_components/account-mapping-manager"
import { JournalEntriesView } from "./_components/journal-entries-view"
import PayrollTransactionsList from "./_components/payroll-transactions-list"
import { usePayrollData } from "./hooks/usePayrollData"
import { useIsMobile } from "@/src/hooks/useMobile" // Import the useIsMobile hook

export default function PayrollPage() {
  const { dashboardMetrics, loading, error } = usePayrollData()
  const [activeTab, setActiveTab] = useState("transactions")
  const isMobile = useIsMobile()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight text-chart-1 dark:text-gray-100">Payroll Management</h2>
        {/* Optional: Add a "New Transaction" button here for quick access on desktop */}
        {/* {!isMobile && (
          <Button onClick={() => setShowTransactionForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Transaction
          </Button>
        )} */}
      </div>

      {/* Payroll Stats */}
      <PayrollStats loading={loading} metrics={dashboardMetrics} />

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="relative">
          <TabsList className="flex w-full overflow-x-auto whitespace-nowrap scrollbar-hide justify-start sm:justify-center">
            <TabsTrigger value="transactions" className="flex-shrink-0">
              <FileText className="mr-2 h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="mapping" className="flex-shrink-0">
              <Settings className="mr-2 h-4 w-4" />
              Account Mapping
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex-shrink-0">
              <TrendingUp className="mr-2 h-4 w-4" />
              Journal Entries
            </TabsTrigger>
          </TabsList>
          {/* Fading overlays for visual indication of scrollability on mobile */}
          {isMobile && (
            <>
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-950 to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-950 to-transparent pointer-events-none" />
            </>
          )}
        </div>

        <TabsContent value="transactions" className="space-y-4">
          <PayrollTransactionsList />
        </TabsContent>
        <TabsContent value="mapping" className="space-y-4">
          <AccountMappingManager />
        </TabsContent>
        <TabsContent value="journal" className="space-y-4">
          <JournalEntriesView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
