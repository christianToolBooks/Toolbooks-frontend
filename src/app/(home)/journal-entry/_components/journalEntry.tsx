// src/app/(...)/journal-entry/page.tsx (o equivalente donde lo uses)
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { PlusIcon, SaveIcon } from 'lucide-react';
import { JournalEntryHeader } from '../_components/journalEntryComponents/journalEntryHeader';
import { JournalEntryTable } from '../_components/journalEntryComponents/journalEntryTable';
import { JournalEntryTotals } from '../_components/journalEntryComponents/journalEntryTotals';
import { useJournalEntry } from '../_components/journalEntryComponents/context/journalContext';
import { AddAccountDialog } from '../dialogs/addAccountDialog';

export function JournalEntry() {
  const {
    entryDate, setEntryDate,
    entryNumber, setEntryNumber,
    description, setDescription,

    addLine,

    isAddAccountDialogOpen, setIsAddAccountDialogOpen,
    newAccountForm, updateNewAccountForm, handleCreateAccount, coaForm,

    totalDebits, totalCredits, isBalanced,

    handleSave, isSaving,
    resetNewAccountForm,
  } = useJournalEntry();

  const handleCloseDialog = () => {
    setIsAddAccountDialogOpen(false);
    resetNewAccountForm();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-1xl font-bold text-center">MAKE GENERAL JOURNAL ENTRIES</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <JournalEntryHeader
            entryDate={entryDate}
            setEntryDate={setEntryDate}
            entryNumber={entryNumber}
            setEntryNumber={setEntryNumber}
            description={description}
            setDescription={setDescription}
          />

          <JournalEntryTable />

          <div className="flex justify-start">
            <Button variant="outline" onClick={addLine}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Line
            </Button>
          </div>

          <JournalEntryTotals totalDebits={totalDebits} totalCredits={totalCredits} isBalanced={isBalanced} />

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <SaveIcon className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Entry"}
            </Button>
          </div>

         
        </CardContent>
      </Card>

      <AddAccountDialog
        isOpen={isAddAccountDialogOpen}
        onClose={handleCloseDialog}
        newAccountForm={newAccountForm}
        onUpdateForm={updateNewAccountForm}
        onAddAccount={handleCreateAccount}
        coaForm={coaForm}
        reset={resetNewAccountForm}
      />
    </div>
  );
}
