import { OutstandingItemsPrediction } from "../_components/outstanding-items-prediction";

export default function PredictionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">ToolBooks</h1>
              <p className="text-muted-foreground mt-1">Professional CPA Reconciliation System</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <OutstandingItemsPrediction />
      </div>
    </div>
  )
}
