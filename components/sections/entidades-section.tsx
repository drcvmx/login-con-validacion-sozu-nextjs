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
import {
  Users,
  Plus,
  Eye,
  Edit,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function EntidadesSection() {
  const { usuario } = useAuth();

  if (!usuario) return null;

  // Obtener los submenús de entidades
  const entidadesMenu = usuario.rol.menus.find((m) => m.nombre === "Entidades");
  const submenus = entidadesMenu?.submenus.filter((s) => s.activo) || [];

  return (
    <div className="space-y-8 animate-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Gestión de Entidades
          </h2>
          <p className="text-muted-foreground mt-1">
            Administra clientes, empresas y notarios del sistema
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-200 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Entidad
        </Button>
      </div>

      <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Tipos de Entidades
          </CardTitle>
          <CardDescription>
            Administra clientes, empresas y notarios del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submenus.map((submenu, index) => (
              <div
                key={submenu.id}
                className="flex items-center justify-between p-6 border border-border rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-[1.01] bg-card/80 backdrop-blur-sm animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">
                      {submenu.nombre}
                    </h3>
                    <p className="text-muted-foreground">
                      {submenu.permisos.length} permisos disponibles
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {submenu.permisos.slice(0, 3).map((permiso) => (
                        <Badge
                          key={permiso.id}
                          variant="secondary"
                          className="text-xs"
                        >
                          {permiso.nombre}
                        </Badge>
                      ))}
                      {submenu.permisos.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{submenu.permisos.length - 3} más
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className="bg-green-500 hover:bg-green-600">
                    Activo
                  </Badge>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-secondary/10 hover:text-secondary"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas de Entidades */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Tipos de Entidades
            </CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <span className="text-2xl">🏢</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500 mb-1">
              {submenus.length}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>Tipos configurados</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Total Permisos
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <span className="text-2xl">🔐</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500 mb-1">
              {submenus.reduce((acc, submenu) => acc + submenu.permisos.length, 0)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>Permisos disponibles</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Entidades Activas
            </CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500 mb-1">
              {submenus.filter(s => s.activo).length}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>Entidades activas</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista detallada de permisos por entidad */}
      <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Permisos por Entidad
          </CardTitle>
          <CardDescription>
            Detalle de permisos disponibles para cada tipo de entidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submenus.map((submenu, index) => (
              <div
                key={submenu.id}
                className="p-6 border border-border rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-card/80 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h4 className="font-bold text-lg text-foreground mb-4">
                  {submenu.nombre}
                </h4>
                <div className="space-y-2">
                  {submenu.permisos.map((permiso) => (
                    <div
                      key={permiso.id}
                      className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {permiso.nombre}
                      </span>
                      <Badge
                        variant={permiso.activo ? "default" : "secondary"}
                        className={
                          permiso.activo
                            ? "bg-green-500 hover:bg-green-600 text-xs"
                            : "text-xs"
                        }
                      >
                        {permiso.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}