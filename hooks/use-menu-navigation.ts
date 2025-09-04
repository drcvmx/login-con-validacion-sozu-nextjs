"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";

export function useMenuNavigation() {
  // 🔄 Mantener estado persistente del menú activo
  const [activeMenu, setActiveMenuState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('activeMenu') || 'Dashboard';
    }
    return 'Dashboard';
  });
  
  // 🔄 Mantener estado de submenús expandidos
  const [expandedSubmenus, setExpandedSubmenus] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('expandedSubmenus');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { refreshAuth } = useAuth();

  // 💾 Guardar estado en localStorage cuando cambie
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeMenu', activeMenu);
    }
  }, [activeMenu]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('expandedSubmenus', JSON.stringify(expandedSubmenus));
    }
  }, [expandedSubmenus]);

  // 🔧 CORRECCIÓN: Separar navegación del re-fetch
  const handleMenuChange = (menuName: string) => {
    // ✅ 1. Cambiar menú activo INMEDIATAMENTE (síncrono)
    setActiveMenuState(menuName);
    
    // ✅ 2. Re-fetch datos del servidor de forma ASÍNCRONA con delay
    setTimeout(async () => {
      try {
        await refreshAuth();
      } catch (error) {
        console.warn('Error al actualizar datos en cambio de menú:', error);
        // No bloquear la navegación si falla el refresh
      }
    }, 100); // Pequeño delay para permitir que el estado se establezca
  };

  const toggleSubmenu = (menuName: string) => {
    setExpandedSubmenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return {
    activeMenu,
    setActiveMenu: handleMenuChange,
    expandedSubmenus,
    toggleSubmenu,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
  };
}