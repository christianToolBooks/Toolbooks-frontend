"use client";

import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Phone } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function InputPhoneContactCard({ value, onChange, disabled }: Props) {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "");
    if (raw.startsWith("1")) raw = raw.substring(1); 
    let formatted = "+1 ";

    if (raw.length > 0) {
      formatted += "(" + raw.substring(0, 3);
    }
    if (raw.length >= 4) {
      formatted += ") " + raw.substring(3, 6);
    }
    if (raw.length >= 7) {
      formatted += "-" + raw.substring(6, 10);
    }

    onChange(formatted.trim());
  };

  const isPhoneValid = value?.replace(/\D/g, "").length === 10;

  return (
    <div className="space-y-1">
      <Label htmlFor="phone" className="flex items-center gap-2">
        Phone
      </Label>
      <div className="flex gap-2">
        <Input
          id="phone"
          placeholder="+1 (555) 000-0000"
          type="tel"
          value={value}
          onChange={handleInput}
        />
        {isPhoneValid && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center text-green-500 text-sm"
          >
            ✓
          </motion.div>
        )}
      </div>
    </div>
  );
}
