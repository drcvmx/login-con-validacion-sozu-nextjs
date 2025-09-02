"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BarChart3,
  Building2,
  Users,
  FileText,
  DollarSign,
  Home,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const menuIcons = {
  Dashboard: BarChart3,
  Usuarios: Users,
  Proyectos: Building2,
  Reportes: FileText,
  Finanzas: DollarSign,
};

interface SidebarProps {
  sidebarOpen: boolean;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export function Sidebar({ sidebarOpen, activeMenu, setActiveMenu }: SidebarProps) {
  const { usuario, logout } = useAuth();

  if (!usuario) return null;

  const getMenuIcon = (menuName: string) => {
    // Mapear nombres del backend a iconos del frontend
    const menuMapping: Record<string, keyof typeof menuIcons> = {
      Entidades: "Usuarios",
      Usuarios: "Usuarios",
      Propiedades: "Proyectos",
      "Productos/Servicios": "Reportes",
      "Cuentas de cobranza": "Finanzas",
      Comisiones: "Finanzas",
    };

    const mappedName = menuMapping[menuName] || menuName;
    const IconComponent =
      menuIcons[mappedName as keyof typeof menuIcons] || Home;
    return IconComponent;
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border shadow-2xl transform transition-all duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-6 border-b border-sidebar-border bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-primary-foreground font-bold text-xl">
              S
            </span>
          </div>
          <div>
            <span className="text-xl font-bold text-sidebar-foreground">
              SOZU
            </span>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 px-6">
        {/* Dashboard siempre visible */}
        <button
          onClick={() => setActiveMenu("Dashboard")}
          className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left transition-all duration-200 mb-3 group ${
            activeMenu === "Dashboard"
              ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg scale-[1.02]"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-[1.01] hover:shadow-md"
          }`}
        >
          <BarChart3 className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span className="font-medium">Dashboard</span>
          {activeMenu === "Dashboard" && (
            <div className="ml-auto w-2 h-2 bg-secondary rounded-full animate-pulse" />
          )}
        </button>

        {/* Menu items from backend */}
        {usuario.rol.menus.map((menu) => {
          if (!menu.activo) return null;
          const IconComponent = getMenuIcon(menu.nombre);

          return (
            <button
              key={menu.id}
              onClick={() => setActiveMenu(menu.nombre)}
              className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left transition-all duration-200 mb-2 group ${
                activeMenu === menu.nombre
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg scale-[1.02]"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-[1.01] hover:shadow-md"
              }`}
            >
              <IconComponent className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">{menu.nombre}</span>
              {activeMenu === menu.nombre && (
                <div className="ml-auto w-2 h-2 bg-secondary rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-sidebar-border bg-sidebar/80 backdrop-blur-sm">
        <div className="flex items-center space-x-4 mb-4 p-3 rounded-xl bg-sidebar-accent/50">
          <Avatar className="w-12 h-12 ring-2 ring-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-semibold">
              {usuario.nombre
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">
              {usuario.nombre}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {usuario.rol.nombre}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
          onClick={logout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}