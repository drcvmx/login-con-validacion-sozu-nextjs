"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function UsuariosSection() {
  const { usuario } = useAuth();

  if (!usuario) return null;

  // Datos de ejemplo para usuarios
  const usuarios = [
    {
      name: usuario.nombre,
      email: usuario.email,
      role: usuario.rol.nombre,
      status: "Activo",
    },
    {
      name: "María López",
      email: "gerente@sozu.com",
      role: "Gerente",
      status: "Activo",
    },
    {
      name: "Juan Torres",
      email: "usuario1@sozu.com",
      role: "Usuario",
      status: "Activo",
    },
    {
      name: "Ana García",
      email: "ana.garcia@sozu.com",
      role: "Vendedor",
      status: "Activo",
    },
    {
      name: "Carlos Mendez",
      email: "carlos.mendez@sozu.com",
      role: "Usuario",
      status: "Inactivo",
    },
  ];

  return (
    <div className="space-y-8 animate-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Gestión de Usuarios
          </h2>
          <p className="text-muted-foreground mt-1">
            Administra los usuarios del sistema
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-200 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Lista de Usuarios
          </CardTitle>
          <CardDescription>
            Administra los usuarios del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usuarios.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-6 border border-border rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-[1.01] bg-card/80 backdrop-blur-sm animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-6">
                  <Avatar className="w-14 h-14 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-bold text-lg">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">
                      {user.name}
                    </h3>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge
                    variant="outline"
                    className="border-primary/20 text-primary"
                  >
                    {user.role}
                  </Badge>
                  <Badge
                    className={
                      user.status === "Activo"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-500 hover:bg-gray-600"
                    }
                  >
                    {user.status}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas de Usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Total Usuarios
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500 mb-1">
              {usuarios.length}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>Usuarios registrados</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Usuarios Activos
            </CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500 mb-1">
              {usuarios.filter(u => u.status === "Activo").length}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>Usuarios activos</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Roles Únicos
            </CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <span className="text-2xl">🎭</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-500 mb-1">
              {[...new Set(usuarios.map(u => u.role))].length}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>Roles diferentes</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}