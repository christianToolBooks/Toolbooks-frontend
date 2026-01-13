'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { TypesChartOfAccounts } from '@/src/types/chart-of-accounts';
import { toast } from 'sonner';
import { useCreateCoAForm } from '../hooks/journalEntryHooks/useCreateCoA';

interface AddAccountDialogProps {
  reset: () => void;
  isOpen: boolean;
  onClose: () => void;
  newAccountForm: {
    account_code: string;
    account_name: string;
    account_type: TypesChartOfAccounts;
  };
  onUpdateForm: (updates: Partial<{
    account_code: string;
    account_name: string;
    account_type: TypesChartOfAccounts;
  }>) => void;
  onAddAccount: (accountData: {
    account_code: string;
    account_name: string;
    account_type: TypesChartOfAccounts;
  }) => Promise<void>;
  coaForm: ReturnType<typeof useCreateCoAForm>;
}

export function AddAccountDialog({
  isOpen,
  onClose,
  newAccountForm,
  onUpdateForm,
  onAddAccount,
  coaForm,
}: AddAccountDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAccountForm.account_code.trim() || !newAccountForm.account_name.trim()) {
      toast.error('Account code and name are required');
      return;
    }

    // Validate account code
    const validationError = coaForm.validateAccountCode(
      newAccountForm.account_type, 
      newAccountForm.account_code
    );
    
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddAccount(newAccountForm);
      onClose()
    } catch (error) {
      toast.error(`Error adding account: ${error}`);
      // Error notifications are handled by the hook via toast
    } finally {
      setIsSubmitting(false);
      
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  // Validation error for current inputs
  const codeValidationError = newAccountForm.account_code 
    ? coaForm.validateAccountCode(newAccountForm.account_type, newAccountForm.account_code)
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="account_type">Account Type</Label>
            <Select
              value={newAccountForm.account_type}
              onValueChange={(value: TypesChartOfAccounts) => 
                onUpdateForm({ 
                  account_type: value,
                  account_code: '' // Reset code when type changes
                })
              }
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                {coaForm.accountTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account_code">Account Code</Label>
            <Input
              id="account_code"
              type="text"
              value={newAccountForm.account_code}
              onChange={(e) => onUpdateForm({ account_code: e.target.value })}
              placeholder={coaForm.getCodePlaceholder(newAccountForm.account_type)}
              disabled={isSubmitting}
              className={codeValidationError ? 'border-red-500' : ''}
            />
            <p className="text-sm text-gray-500">
              Range: {coaForm.getCodePlaceholder(newAccountForm.account_type)}
            </p>
            {codeValidationError && (
              <p className="text-sm text-red-600">
                {codeValidationError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="account_name">Account Name</Label>
            <Input
              id="account_name"
              type="text"
              value={newAccountForm.account_name}
              onChange={(e) => onUpdateForm({ account_name: e.target.value })}
              placeholder="Enter account name"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || coaForm.isLoading || !!codeValidationError}
            >
              {isSubmitting || coaForm.isLoading ? 'Adding...' : 'Add Account'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}