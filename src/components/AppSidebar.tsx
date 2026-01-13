"use client";

import * as React from "react";
import Link from "next/link";

import { NavMain } from "@/src/components/NavMain";
import { NavSecondary } from "@/src/components/NavSecondary";
import { NavUser } from "@/src/components/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/ui/sidebar";
import { dataSidebar } from "@/src/lib/utils/data.sidebar";
import Image from "next/image";
import { useAuth } from "../app/auth/hooks/redux";
import { ArrowLeft, FileScan, Frown, Wallet } from "lucide-react";
import PlaidButton from "./plaid/plaid-connection";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import useInstitutions from "../hooks/useInstitutions";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentView?: string;
  onViewChange?: (view: string) => void;
  isAccountSection?: boolean;
  onToggleAccountSection?: (isAccount: boolean) => void;
}

export function AppSidebar({
  currentView = "dashboard",
  onViewChange = () => {},
  isAccountSection = false,
  onToggleAccountSection = () => {},
  ...props
}: AppSidebarProps) {
  const { institutions, loading, error } = useInstitutions();
  const router = useRouter();
  const { user } = useAuth();
  const userInfo = {
    name: user?.name || "",
    email: user?.email || "",
  };

  const baseItems = isAccountSection
    ? dataSidebar.accountNavItems
    : dataSidebar.navMain;

  const sidebarItems = baseItems.map((item) => {
    if (institutions.length === 0 && item.title === "Registers") {
      return {
        ...item,
        items: [
          {
            title: "No Banks Connected",
            url: "#",
            icon: Frown,
          },
        ],
      };
    } else if (item.title === "Registers") {
      return {
        ...item,
        items: [
          ...(item.items || []),
          ...institutions.map((ins) => ({
            title: `${ins.bank_name}`,
            url: `/registers/transactionsBy/${ins.bank_name}/${ins.id}`,
            icon: Wallet,
          })),
        ],
      };
    }
    return item;
  });

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <Image
                  alt="logo-ToolBooks"
                  src="/logo-toolBooks.svg"
                  width={300}
                  height={300}
                  className="h-10 w-10 rounded-full"
                />
                <span className="text-base font-semibold">ToolBooks</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {isAccountSection && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => onToggleAccountSection(false)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Main</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        <NavMain
          items={sidebarItems}
          currentView={currentView}
          onViewChange={onViewChange}
          isAccountSection={isAccountSection}
          loading={loading}
        />
        {!isAccountSection && (
          <>
            <NavSecondary
              items={dataSidebar.navSecondary}
              className="mt-auto"
            />

            <SidebarMenu>
              <SidebarMenuItem className="flex flex-col items-center gap-2 p-2">
                <Button
                  size="icon"
                  className="h-9 w-full shrink-0 group-data-[collapsible=icon]:opacity-0 cursor-pointer"
                  variant="outline"
                  onClick={() => router.push("/import-transactions")}
                >
                  <p>Import Bank Statement</p>
                  <FileScan />
                  <span className="sr-only">File scan</span>
                </Button>
                <PlaidButton />
              </SidebarMenuItem>
            </SidebarMenu>
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        {
          <NavUser
            user={userInfo}
            onToggleAccountSection={onToggleAccountSection}
            onViewChange={onViewChange}
          />
        }
      </SidebarFooter>
    </Sidebar>
  );
}
