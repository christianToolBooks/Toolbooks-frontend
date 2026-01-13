import { FileText, Receipt, CreditCard, Users } from "lucide-react";
import { ModuleData } from "./types";

export const modulesData: ModuleData[] = [
  {
    id: "invoicing",
    name: "Invoicing",
    icon: Receipt,
    color: "text-chart-1/80",
    bgColor: "bg-chart-5/50",
    borderColor: "border-chart-1",
    description: "Create professional invoices and track payments",
    longDescription:
      "Streamline your billing process with our comprehensive invoicing solution. Create professional invoices in seconds, track payments automatically, and get paid faster.",
    features: [
      "Professional invoice creation with customizable templates",
      "Payment tracking and automated reminders",
      "Client portal for easy payment access",
      "Integration with accounting systems",
      "Recurring invoice automation",
      "Multi-currency support",
    ],
    pricing: "$29/month",
    faq: [
      {
        question: "Can I customize invoice templates?",
        answer:
          "Yes! You can fully customize your invoice templates with your logo, colors, and branding.",
      },
      {
        question: "How do clients pay invoices?",
        answer:
          "Clients can pay via the secure client portal using credit card, ACH, or other payment methods.",
      },
      {
        question: "Is there a limit on invoices?",
        answer: "No, you can create unlimited invoices with any plan.",
      },
    ],
  },
  {
    id: "billPay",
    name: "Bill Payment",
    icon: CreditCard,
    color: "text-chart-1/80",
    bgColor: "bg-chart-5/50",
    borderColor: "border-chart-1",
    description: "Streamline vendor payments and approvals",
    longDescription:
      "Take control of your accounts payable with our bill payment solution. Automate payments, manage approvals, and never miss a due date.",
    features: [
      "Vendor payment processing and scheduling",
      "Multi-level approval workflows",
      "Automated payment reminders",
      "Expense tracking and categorization",
      "Integration with accounting systems",
      "Vendor management portal",
    ],
    pricing: "$39/month",
    faq: [
      {
        question: "How are payments processed?",
        answer:
          "Payments can be processed via ACH, check, or credit card, depending on your preference.",
      },
      {
        question: "Can I set up approval workflows?",
        answer:
          "Yes! You can create custom approval workflows based on amount, vendor, or other criteria.",
      },
      {
        question: "What about payment security?",
        answer:
          "All payments are secured with bank-level encryption and fraud detection.",
      },
    ],
  },
  {
    id: "payroll",
    name: "Payroll",
    icon: Users,
    color: "text-chart-1/80",
    bgColor: "bg-chart-5/50",
    borderColor: "border-chart-1",
    description: "Complete payroll processing and tax compliance",
    longDescription:
      "Handle payroll with confidence. From direct deposits to tax filings, we manage every aspect of your payroll so you can focus on growing your business.",
    features: [
      "Complete live payroll processing",
      "Direct deposits and pay stubs",
      "Automated tax calculations and filings",
      "Federal and state compliance",
      "Employee self-service portal",
      "Time tracking integration",
    ],
    pricing: "From $29/month",
    faq: [
      {
        question: "What's the difference between Connect and Complete?",
        answer:
          "Payroll Connect integrates with your existing payroll provider. Payroll Complete is our full-service live payroll solution.",
      },
      {
        question: "Do you handle tax filings?",
        answer:
          "Yes! Payroll Complete includes all federal and state tax filings and payments.",
      },
      {
        question: "Can employees access their pay stubs?",
        answer:
          "Yes, employees get access to a self-service portal for pay stubs, W-2s, and more.",
      },
    ],
  },
  {
    id: "tax",
    name: "Tax Preparation",
    icon: FileText,
    color: "text-chart-1/80",
    bgColor: "bg-chart-5/50",
    borderColor: "border-chart-1",
    description: "Professional tax preparation and compliance services",
    longDescription:
      "Navigate tax season with ease. Our certified tax professionals ensure your business stays compliant and maximizes deductions.",
    features: [
      "Annual tax return preparation",
      "Federal and state compliance",
      "Tax planning and strategy",
      "Audit support and representation",
      "Access to certified tax experts",
      "Year-round tax consultation",
    ],
    pricing: "tax",
    faq: [
      {
        question: "When should I file my taxes?",
        answer:
          "Tax deadlines vary by entity type. We'll manage all deadlines and extensions for you.",
      },
      {
        question: "Do you handle amended returns?",
        answer: "Yes, we can prepare and file amended returns if needed.",
      },
      {
        question: "What if I get audited?",
        answer: "We provide full audit support and representation services.",
      },
    ],
  },
];
