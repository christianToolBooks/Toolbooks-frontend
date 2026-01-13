'use client';
import React, { PropsWithChildren, useState } from 'react';
import { SidebarInset, SidebarProvider } from '@/src/components/ui/sidebar';
import { AppSidebar } from '@/src/components/AppSidebar';
import { SiteHeader } from '@/src/components/SiteHeader';
import { AuthGuard } from '@/src/components/auth/AuthGuard';
import 'ldrs/react/Grid.css';
import { useAuth } from '../auth/hooks/redux';
import { completeWelcomeLoading } from '@/src/store/authSlice';
import LoadingDashboard from '@/src/components/auth/loadingPage/loadingDashboard';
import { AccountView } from '@/src/components/sideBarAccountViews/accountSettings/AccountView';
import { MyBusinessView } from '@/src/components/sideBarAccountViews/myBusiness/MyBusinessView';
import { GoogleMapsProvider } from '@/src/components/loaderGoogle';
import { MyModulesView } from '@/src/components/sideBarAccountViews/modulesAndSettings/modulesView';

function Layout({ children }: PropsWithChildren) {
  const { showWelcomeLoading } = useAuth();
  const {dispatch} = useAuth();
  const [currentView, setCurrentView] = useState("dashboard");
  const [isAccountSection, setIsAccountSection] = useState(false);

  const handleLoadingComplete = () => {
    setTimeout(() => {
      dispatch(completeWelcomeLoading());
    }, 0);
  };

  if (showWelcomeLoading) {
    return (
      <LoadingDashboard onComplete={handleLoadingComplete} />
    );
  }

  const renderContent = () => {
    if (isAccountSection) {
      switch (currentView) {
        case "account":
          return <AccountView />
        case "my-company-profile":
          return <MyBusinessView />
        case "modules-settings":
          return <MyModulesView />
        default:
          return <AccountView />
      }
    }
    return children;
  };

  return (
    <SidebarProvider>
      <AppSidebar 
        variant="inset" 
        currentView={currentView}
        onViewChange={setCurrentView}
        isAccountSection={isAccountSection}
        onToggleAccountSection={setIsAccountSection} 
      />
      <SidebarInset>
        <SiteHeader />
        <AuthGuard>
          <GoogleMapsProvider>

          <div className="py-4 md:py-6">{renderContent()}</div>
          </GoogleMapsProvider>
        </AuthGuard>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Layout;