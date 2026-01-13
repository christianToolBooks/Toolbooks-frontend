"use client";

import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { NotesProps } from "../types/types";

export function Notes({ notes, onChange }: NotesProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#EFECE6]/50 bg-white/80 shadow-sm backdrop-blur-sm">
      <header className="border-b border-[#EFECE6]/50 px-5 py-4 md:px-6">
        <h2 className="text-lg font-semibold text-[#1E3A8A] md:text-xl">Additional Notes</h2>
      </header>
      <div className="px-5 py-6 md:px-6">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide text-[#5C769D]">Notes</Label>
          <Textarea
            value={notes || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Add any additional notes about this vendor..."
            className="resize-none rounded-md border-2 border-chart-5 bg-transparent px-2 text-base placeholder:font-light focus:border-[#1E3A8A] focus:ring-0"
            rows={3}
          />
        </div>
      </div>
    </section>
  );
}
