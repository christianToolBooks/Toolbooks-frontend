"use client";

import {
  ChevronRight,
  FileScan,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/src/components/ui/sidebar";
import { usePathname } from "next/navigation";

interface Props {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    id?: string;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
  currentView: string;
  loading: boolean;
  onViewChange: (view: string) => void;
  isAccountSection: boolean;
}

export function NavMain({
  items,
  currentView = "",
  onViewChange = () => {},
  isAccountSection = false,
  loading
}: Props) {
  const pathname = usePathname();

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            {items.map((item) => {
              if (!item.items)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      asChild={!isAccountSection}
                      isActive={
                        item.url === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.url)
                      }
                      onClick={
                        isAccountSection
                          ? () =>
                              onViewChange(item.id || item.title.toLowerCase())
                          : undefined
                      }
                    >
                      {isAccountSection ? (
                        <span className="w-full flex items-center gap-3">
                          {item.icon && <item.icon className="w-5 h-5  text-primary stroke-2" />}
                          <span>{item.title}</span>
                        </span>
                      ) : (
                        <Link href={item.url}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>

                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 " />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton 
                            asChild
                            isActive={pathname.startsWith(subItem.url)}
                            
                            >
                              {loading ? (
                                 <div className="flex items-center justify-center h-20">
                                  <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              ) : (
                                <Link href={subItem.url}>
                                  {subItem.icon && <subItem.icon />}
                                  <span>{subItem.title}</span>
                                </Link>
                              )}
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
