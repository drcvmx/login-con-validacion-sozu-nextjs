"use client";

import { useState } from "react";

export function useMenuNavigation() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return {
    activeMenu,
    setActiveMenu,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
  };
}