import {
  BanknoteArrowUp,
  BarChart3,
  BookOpenText,
  Building2,
  Calculator,
  CameraIcon,
  CheckCircle,
  CreditCard,
  DollarSign,
  FileCodeIcon,
  FileTextIcon,
  HelpCircleIcon,
  Landmark,
  LayoutDashboardIcon,
  ListTree,
  LucideIcon,
  Notebook,
  Receipt,
  Settings2,
  User,
  Users,
} from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  id?: string;
  badge?: {
    count: number;
    variant: "default" | "secondary" | "destructive";
  };
  items?: {
    title: string;
    url: string;
    icon?: LucideIcon;
    badge?: {
      count: number;
      variant: "default" | "secondary" | "destructive";
    };
  }[];
}

export const dataSidebar: {
  navMain: NavItem[];
  navClouds: NavItem[];
  navSecondary: NavItem[];
  accountNavItems: NavItem[];
} = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
      id: "dashboard",
    },
    {
      title: "Chart of Accounts",
      url: "/chart-of-accounts",
      icon: ListTree,
      id: "chart-of-accounts",
    },
    {
      title: "General Ledger",
      url: "/general-ledger",
      icon: BookOpenText,
      id: "general-ledger",
    },
    {
      title: "Bank Reconciliation",
      url: "/bank-reconciliation",
      icon:BanknoteArrowUp,
      id: "bank-reconciliation",
      items: [
        {
          title: "Match Transactions",
          url: "/bank-reconciliation/matching",
          icon: CheckCircle,
        },
        {
          title: "Predictions Reconciliations",
          url: "/bank-reconciliation/predictions",
          icon: CheckCircle,
        },
        {
          title: "Reconciliations",
          url: "/bank-reconciliation/reconciliations",
          icon: BarChart3,
        },
        {
          title: "Transactions",
          url: "/bank-reconciliation/transactions",
          icon: ListTree,
        }
      ]
    },
    {
      title: "Journal Entry",
      url: "/journal-entry",
      icon: Notebook,
      id: "journal-entry",
    },
    {
      title: "Registers",
      url: "/registers",
      icon: Landmark,
      items: [],
    },
    {
      title: "Bill Pay",
      url: "/bill-pay",
      icon: CreditCard,
      id: "bill-pay",
      badge: { count: 23, variant: "secondary" },
      items: [
        {
          title: "Vendors",
          url: "/bill-pay/vendors",
          icon: Users,
        },
        {
          title: "Bills",
          url: "/bill-pay/bills",
          icon: Receipt,
          badge: { count: 45, variant: "destructive" },
        },
        {
          title: "Approvals",
          url: "/bill-pay/approvals",
          icon: CheckCircle,
          badge: { count: 12, variant: "default" },
        },
        {
          title: "Payments",
          url: "/bill-pay/payments",
          icon: DollarSign,
          badge: { count: 8, variant: "secondary" },
        },
        {
          title: "Reports",
          url: "/bill-pay/reports",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "Invoices",
      url: "#",
      icon: Receipt,
      items: [
        {
          title: "Invoices",
          url: "/invoices",
          icon: Receipt,
        },
        {
          title: "Customers",
          url: "/customer",
          icon: User,
        },
      ],
    },
    {
      title: "Payroll",
      url: "/payroll",
      icon: Calculator,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
  ],
  accountNavItems: [
    {
      title: "Account",
      icon: User,
      url: "/account",
      id: "account",
    },
    {
      title: "My Company Profile",
      url: "/my-company-profile",
      icon: Building2,
      id: "my-company-profile",
    },
    {
      title: "Modules & Settings",
      url: "/modules-settings",
      icon: Settings2,
      id: "modules-settings",
    }
  ],
};
