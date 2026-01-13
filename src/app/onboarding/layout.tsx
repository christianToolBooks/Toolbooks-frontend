"use client"
import React, { PropsWithChildren, useEffect, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar";
import { AppSidebar } from "@/src/components/AppSidebar";
import { SiteHeader } from "@/src/components/SiteHeader";
import { AuthGuard } from "@/src/components/auth/AuthGuard";
import { useAuthGuard } from "../auth/hooks/useAuthGuard";
import { Grid } from 'ldrs/react'
import 'ldrs/react/Grid.css'
import { useAuth } from "../auth/hooks/redux";
import LoadingDashboard from "@/src/components/auth/loadingPage/loadingDashboard";
import LoadingGeneral from "@/src/components/auth/loadingPage/loadingPage";

function Layout({ children }: PropsWithChildren) {
  const { isLoading } = useAuth();
  const [showExtendedLoading, setShowExtendedLoading] = useState(false);
  const [minLoadingTimePassed, setMinLoadingTimePassed] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isLoading) {
      setShowExtendedLoading(true);
      setMinLoadingTimePassed(false);
    } else {
      timeout = setTimeout(() => {
        setMinLoadingTimePassed(true);
        setShowExtendedLoading(false);
      }, 3000); 
    }

    return () => clearTimeout(timeout);
  }, [isLoading]);

  if (isLoading || (showExtendedLoading && !minLoadingTimePassed)) {
    return <LoadingGeneral />;
  }

  return (
          <div >{children}</div>
  );
}

export default Layout;
