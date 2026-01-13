import { ReconciliationDashboard } from "../_components/reconciliation-dashboard";

export default function ReconciliationPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">ToolBooks</h1>
              <p className="text-muted-foreground mt-1">Professional CPA Reconciliation System</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">November 2025</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <ReconciliationDashboard />
      </div>
    </div>
  )
}
