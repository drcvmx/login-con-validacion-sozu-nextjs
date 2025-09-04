"use client";

import { useAuth } from "@/contexts/auth-context";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import SectionRouter from "@/components/sections/section-router";
import { useMenuNavigation } from "@/hooks/use-menu-navigation";

export default function SozuAdminDashboard() {
  const { usuario } = useAuth();
  const { 
    activeMenu, 
    setActiveMenu, 
    expandedSubmenus, 
    toggleSubmenu, 
    sidebarOpen, 
    setSidebarOpen 
  } = useMenuNavigation();

  if (!usuario) return null;

  return (
    <DashboardLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      activeMenu={activeMenu}
      setActiveMenu={setActiveMenu}
      expandedSubmenus={expandedSubmenus}
      toggleSubmenu={toggleSubmenu}
    >
      <SectionRouter activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
    </DashboardLayout>
  );
}