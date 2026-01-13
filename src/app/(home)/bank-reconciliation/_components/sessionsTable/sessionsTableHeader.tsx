interface SessionsTableHeaderProps {
  total: number
  sessionId: string
}

export function SessionsTableHeader({ total, sessionId }: SessionsTableHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Reconciliation Session</h1>
        <p className="text-sm text-muted-foreground mt-1">ID: {sessionId}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-muted-foreground">Total transactions</p>
        <p className="text-2xl font-bold">{total}</p>
      </div>
    </div>
  )
}
