"use client";

import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export function DashboardLayout({
  children,
  sidebarOpen,
  setSidebarOpen,
  activeMenu,
  setActiveMenu,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Sidebar
        sidebarOpen={sidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-0"}`}>
        <Header
          activeMenu={activeMenu}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}