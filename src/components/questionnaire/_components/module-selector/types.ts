import { LucideIcon } from "lucide-react";

export type ModuleDecision = "add" | "reject" | "unsure" | null;

export interface ModuleData {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  longDescription: string;
  features: string[];
  pricing: string;
  faq: Array<{ question: string; answer: string }>;
}
