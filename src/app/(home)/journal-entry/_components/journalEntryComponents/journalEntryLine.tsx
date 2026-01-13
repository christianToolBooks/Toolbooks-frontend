'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { TableCell, TableRow } from '@/src/components/ui/table';
import { AccountSelector } from './accountsSelector';
import { useJournalEntry } from './context/journalContext';
import { JournalEntryLineUI } from '@/src/types/journal';
import { CombinedAccount } from '@/src/types/chart-of-accounts';
import { formatMoneyFixed2, formatMoneyLive } from '../../helpers/functions';

interface JournalEntryLineProps {
  line: JournalEntryLineUI;
  canRemove: boolean;
}

export function JournalEntryLineComponent({ line, canRemove }: JournalEntryLineProps) {
  const { updateLine, removeLine, accountSearch, getAccountSelectorState, selectAccount } =
    useJournalEntry();
  const { isOpen, setIsOpen } = getAccountSelectorState(line.id);

  // Estado local SOLO para lo que se muestra en los inputs
  const [debitDisplay, setDebitDisplay] = useState(() => formatMoneyFixed2(line.debit));
  const [creditDisplay, setCreditDisplay] = useState(() => formatMoneyFixed2(line.credit));

  const debitFocused = useRef(false);
  const creditFocused = useRef(false);

  // Si el estado arriba cambia desde fuera (reset de línea, etc.), sincroniza cuando no está enfocado
  useEffect(() => { if (!debitFocused.current) setDebitDisplay(formatMoneyFixed2(line.debit)); }, [line.debit]);
  useEffect(() => { if (!creditFocused.current) setCreditDisplay(formatMoneyFixed2(line.credit)); }, [line.credit]);

  const handleUpdateLine = (field: keyof JournalEntryLineUI, value: string | number | boolean) =>
    updateLine(line.id, field, value);

  const handleRemoveLine = () => removeLine(line.id);

  const handleSelectAccount = (lineId: string, account: CombinedAccount) => {
    selectAccount(lineId, account);
  };

  // DEBIT
  const onDebitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { display, valueNumber } = formatMoneyLive(e.target.value);
    setDebitDisplay(display);
    handleUpdateLine('debit', valueNumber);
    if (valueNumber > 0) {
      handleUpdateLine('credit', 0);
      setCreditDisplay(formatMoneyFixed2(0));
    }
  };
  const onDebitFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    debitFocused.current = true;
    e.target.select();
  };
  const onDebitBlur = () => {
    debitFocused.current = false;
    setDebitDisplay(formatMoneyFixed2(line.debit)); // ahora sí, 2 decimales fijos
  };

  // CREDIT
  const onCreditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { display, valueNumber } = formatMoneyLive(e.target.value);
    setCreditDisplay(display);
    handleUpdateLine('credit', valueNumber);
    if (valueNumber > 0) {
      handleUpdateLine('debit', 0);
      setDebitDisplay(formatMoneyFixed2(0));
    }
  };
  const onCreditFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    creditFocused.current = true;
    e.target.select();
  };
  const onCreditBlur = () => {
    creditFocused.current = false;
    setCreditDisplay(formatMoneyFixed2(line.credit));
  };

  // Otros campos
  const onMemo = (e: React.ChangeEvent<HTMLInputElement>) => handleUpdateLine('memo', e.target.value);
  const onName = (e: React.ChangeEvent<HTMLInputElement>) => handleUpdateLine('name', e.target.value);

  return (
    <TableRow>
      <TableCell>
        <AccountSelector
          lineId={line.id}
          accountNumber={line.accountNumber}
          accountName={line.accountName}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          accountSearch={accountSearch}
          onSelectAccount={handleSelectAccount}
        />
      </TableCell>

      {/* DEBIT */}
      <TableCell>
        <Input
          type="text"
          inputMode="decimal"
          value={debitDisplay}
          onChange={onDebitChange}
          onFocus={onDebitFocus}
          onBlur={onDebitBlur}
          className="text-right"
          placeholder="0.00"
        />
      </TableCell>

      {/* CREDIT */}
      <TableCell>
        <Input
          type="text"
          inputMode="decimal"
          value={creditDisplay}
          onChange={onCreditChange}
          onFocus={onCreditFocus}
          onBlur={onCreditBlur}
          className="text-right"
          placeholder="0.00"
        />
      </TableCell>

      <TableCell>
        <Input value={line.memo} onChange={onMemo} placeholder="Memo" />
      </TableCell>

      <TableCell>
        <Input value={line.name} onChange={onName} placeholder="Name" />
      </TableCell>

      <TableCell>
        {canRemove && (
          <Button variant="ghost" size="sm" onClick={handleRemoveLine} className="text-red-600 hover:text-red-800">
            {/* Trash icon aquí */}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
