'use client';

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import { useJournalEntry } from './context/journalContext';
import { JournalEntryLineComponent } from './journalEntryLine';

export function JournalEntryTable() {
  const { lines } = useJournalEntry();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[200px]">Account</TableHead>
            <TableHead className="w-[120px] text-right">Debit</TableHead>
            <TableHead className="w-[120px] text-right">Credit</TableHead>
            <TableHead className="w-[200px]">Memo</TableHead>
            <TableHead className="w-[150px]">Name</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.map((line) => (
            <JournalEntryLineComponent
              key={line.id}
              line={line}
              canRemove={lines.length > 2}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}