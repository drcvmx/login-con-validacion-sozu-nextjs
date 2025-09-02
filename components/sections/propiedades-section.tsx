"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PropertyCard } from "@/components/ui/property-card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatsCard } from "@/components/ui/stats-card";
import {
  Building2,
  Plus,
  Home,
  Users,
  FileText,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function PropiedadesSection() {
  const { usuario } = useAuth();

  if (!usuario) return null;

  const propiedades = usuario.propiedades_disponibles || [];

  // Estadísticas calculadas
  const edificiosUnicos = [...new Set(propiedades.map(p => p.edificio_nombre))];
  const proyectosUnicos = [...new Set(propiedades.map(p => p.proyecto_nombre))];
  const tiposUnicos = [...new Set(propiedades.map(p => p.modelo_nombre))];

  return (
    <div className="space-y-8 animate-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Gestión de Propiedades
          </h2>
          <p className="text-muted-foreground mt-1">
            Administra las propiedades disponibles
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-200 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Propiedad
        </Button>
      </div>

      {/* Estadísticas de Propiedades */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Propiedades"
          value={propiedades.length}
          subtitle="Propiedades disponibles"
          icon={Building2}
          iconColor="bg-purple-500/10 text-purple-500"
          gradientFrom="from-purple-500/5"
          gradientTo="to-violet-500/5"
          valueColor="text-purple-500"
        />

        <StatsCard
          title="Edificios"
          value={edificiosUnicos.length}
          subtitle="Edificios únicos"
          icon={Home}
          iconColor="bg-blue-500/10 text-blue-500"
          gradientFrom="from-blue-500/5"
          gradientTo="to-cyan-500/5"
          valueColor="text-blue-500"
        />

        <StatsCard
          title="Proyectos"
          value={proyectosUnicos.length}
          subtitle="Proyectos con acceso"
          icon={Users}
          iconColor="bg-green-500/10 text-green-500"
          gradientFrom="from-green-500/5"
          gradientTo="to-emerald-500/5"
          valueColor="text-green-500"
        />

        <StatsCard
          title="Tipos de Modelo"
          value={tiposUnicos.length}
          subtitle="Modelos diferentes"
          icon={FileText}
          iconColor="bg-orange-500/10 text-orange-500"
          gradientFrom="from-orange-500/5"
          gradientTo="to-red-500/5"
          valueColor="text-orange-500"
        />
      </div>

      {/* Lista de Propiedades */}
      <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Propiedades Disponibles
          </CardTitle>
          <CardDescription className="text-base">
            Edificios y departamentos disponibles en tus proyectos ({propiedades.length} propiedades)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {propiedades.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {propiedades.map((propiedad, index) => (
                <PropertyCard 
                  key={`${propiedad.modelo_id}-${propiedad.edificio_id}-${index}`} 
                  propiedad={propiedad} 
                  index={index} 
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Building2}
              title="No hay propiedades disponibles"
              description="No tienes acceso a propiedades en este momento"
              actionLabel="Solicitar Acceso"
              onAction={() => console.log("Solicitar acceso a propiedades")}
            />
          )}
        </CardContent>
      </Card>

      {/* Análisis por Proyecto */}
      {propiedades.length > 0 && (
        <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Análisis por Proyecto
            </CardTitle>
            <CardDescription>
              Distribución de propiedades por proyecto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proyectosUnicos.map((proyecto, index) => {
                const propiedadesProyecto = propiedades.filter(
                  (p) => p.proyecto_nombre === proyecto
                );
                const edificiosProyecto = [
                  ...new Set(propiedadesProyecto.map((p) => p.edificio_nombre)),
                ];
                const tiposProyecto = [
                  ...new Set(propiedadesProyecto.map((p) => p.modelo_nombre)),
                ];

                return (
                  <div
                    key={proyecto}
                    className="p-6 border border-border rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-card/80 backdrop-blur-sm"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <h4 className="font-bold text-lg text-foreground mb-4">
                      {proyecto}
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground font-medium">
                          Propiedades:
                        </span>
                        <span className="font-bold text-primary">
                          {propiedadesProyecto.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground font-medium">
                          Edificios:
                        </span>
                        <span className="font-bold text-secondary">
                          {edificiosProyecto.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground font-medium">
                          Tipos:
                        </span>
                        <span className="font-bold text-green-500">
                          {tiposProyecto.length}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}