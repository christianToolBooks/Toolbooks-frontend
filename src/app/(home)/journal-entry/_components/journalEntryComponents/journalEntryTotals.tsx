'use client';

interface JournalEntryTotalsProps {
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
}

export function JournalEntryTotals({
  totalDebits,
  totalCredits,
  isBalanced,
}: JournalEntryTotalsProps) {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
    });
  };

  return (
    <div className="flex justify-end space-x-8 border-t pt-4">
      <div className="text-right">
        <div className="text-sm text-gray-600">Total Debits</div>
        <div className="font-semibold font-mono text-lg">
          ${formatCurrency(totalDebits)}
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm text-gray-600">Total Credits</div>
        <div className="font-semibold font-mono text-lg">
          ${formatCurrency(totalCredits)}
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm text-gray-600">Difference</div>
        <div
          className={`font-semibold font-mono text-lg ${
            isBalanced ? 'text-green-600' : 'text-red-600'
          }`}
        >
          ${formatCurrency(Math.abs(totalDebits - totalCredits))}
        </div>
      </div>
    </div>
  );
}