import { Dispatch, SetStateAction } from 'react';
import UseCoaFilter, { CombinedAccount } from '../../hooks/generalLedgerHooks/useCoaFilter';
import { AccountFilterType } from '../../hooks/generalLedgerHooks/useGeneralLedger';
import { cn } from '@/src/lib/utils/utils';
import { Input } from '@/src/components/ui/input';

export default function AccountFilter({
  setAccountFilter,
  setPage
}: {
  setAccountFilter: Dispatch<SetStateAction<AccountFilterType | null>>;
  setPage: Dispatch<SetStateAction<number>>;
}) {
  const {
    setQuery,
    query,

    loading,

    combinedAccounts,

    setShowSuggestions,
    showSuggestions,

    inputRef,
    suggestionsRef,

    setSelectedAccount,
    selectedAccount,
    
    selectedIndex,
    setSelectedIndex,
    selectAccount,
  } = UseCoaFilter();

  const handleSelectAccount = (account: CombinedAccount) => {
    selectAccount(account);
    setAccountFilter({ id: account.id, type: account.type });
    setPage(1); 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedAccount(null);
    if (value.length === 0) {
      setPage(1); 
      setShowSuggestions(false);
       setAccountFilter(null);
    }
  };

  return (
    <div className="relative">
      <label className="text-sm font-medium mb-1 block">Account Filter</label>
      <Input
        ref={inputRef}
        onChange={handleInputChange}
        value={selectedAccount ? `${selectedAccount.account_name}` : query}
        placeholder="Filter by account..."
        autoComplete="off"
        className="border border-gray-300 rounded-md shadow-sm"
      />
      {loading && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4">
          <div className="text-sm text-gray-500">Searching...</div>
        </div>
      )}
      {showSuggestions && !loading && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {combinedAccounts.map((account, index) => (
            <div
              key={account.id}
              className={cn(
                'px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50',
                selectedIndex === index && 'bg-gray-100'
              )}
              onClick={() =>
                handleSelectAccount({
                  id: account.id,
                  account_name: account.account_name,
                  account_code: account.account_code,
                  type: account.type as 'account' | 'subaccount',
                })
              }
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex flex-col">
                <span className="text-sm text-gray-900">
                  {account.account_name}
                </span>
                <span className="text-xs text-gray-500">
                  Code: {account.account_code}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      {query.length > 0 && !loading && combinedAccounts.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4">
          <div className="text-sm text-gray-500">No accounts found</div>
        </div>
      )}
    </div>
  );
}
