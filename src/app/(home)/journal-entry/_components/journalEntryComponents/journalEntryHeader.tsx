// src/app/(...)/_components/journalEntryComponents/journalEntryHeader.tsx
"use client";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Calendar } from "@/src/components/ui/calendar";
import { format } from "date-fns";

// (Opcional) si quieres exponer status/currency en UI, agrégalo a props
interface JournalEntryHeaderProps {
  entryDate: Date | undefined;
  setEntryDate: (date: Date | undefined) => void;
  entryNumber: string;
  setEntryNumber: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
}

export function JournalEntryHeader({
  entryDate,
  setEntryDate,
  entryNumber,
  setEntryNumber,
  description,
  setDescription,
}: JournalEntryHeaderProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg">
      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${!entryDate ? "text-muted-foreground" : ""}`}
            >
              {entryDate ? format(entryDate, "MM/dd/yyyy") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={entryDate} onSelect={setEntryDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Entry No.</Label>
        <Input value={entryNumber} onChange={(e) => setEntryNumber(e.target.value)} placeholder="Entry number" readOnly />
      </div>

      <div className="space-y-2 md:col-span-1">
        <Label>Description</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this entry..."
        />
      </div>
    </div>
  );
}
