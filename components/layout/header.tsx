"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Menu,
  Bell,
  Search,
  Settings,
} from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeMenu: string;
}

export function Header({ activeMenu, sidebarOpen, setSidebarOpen }: HeaderProps) {
  return (
    <header className="bg-card/80 backdrop-blur-xl border-b border-border px-8 py-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-primary/10 hover:text-primary transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {activeMenu}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gestiona tu {activeMenu.toLowerCase()} de manera eficiente
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar..."
              className="pl-12 w-80 bg-muted/50 border-0 focus:bg-background transition-all duration-200"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="relative hover:bg-secondary/10 hover:text-secondary"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/10 hover:text-primary"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}