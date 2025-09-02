"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatsCard } from "@/components/ui/stats-card";
import { ProjectCard } from "@/components/ui/project-card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Building2,
  Users,
  FileText,
  DollarSign,
  Plus,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface DashboardSectionProps {
  setActiveMenu: (menu: string) => void;
}

export default function DashboardSection({ setActiveMenu }: DashboardSectionProps) {
  const { usuario, proyectos } = useAuth();

  if (!usuario) return null;

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Proyectos"
          value={proyectos.length}
          subtitle={`🟢 ${proyectos.filter((p) => p.activo).length} activos`}
          icon={Building2}
          iconColor="bg-primary/10 text-primary"
          gradientFrom="from-primary/5"
          gradientTo="to-secondary/5"
          valueColor="text-primary"
        />

        <StatsCard
          title="Usuarios Activos"
          value={248}
          subtitle="📈 +12% vs mes anterior"
          icon={Users}
          iconColor="bg-secondary/10 text-secondary"
          gradientFrom="from-secondary/5"
          gradientTo="to-primary/5"
          valueColor="text-secondary"
        />

        <StatsCard
          title="Precio Promedio m²"
          value={`$${proyectos.length > 0
            ? Math.round(
                proyectos.reduce((acc, p) => acc + p.precio_m2_actual, 0) / proyectos.length
              ).toLocaleString()
            : "0"}`}
          subtitle="MXN por m²"
          icon={DollarSign}
          iconColor="bg-green-500/10 text-green-500"
          gradientFrom="from-green-500/5"
          gradientTo="to-emerald-500/5"
          valueColor="text-green-500"
        />

        <StatsCard
          title="Propiedades Disponibles"
          value={usuario.propiedades_disponibles?.length || 0}
          subtitle={`En ${proyectos.reduce((acc, p) => acc + p.edificios_count, 0)} edificios`}
          icon={FileText}
          iconColor="bg-purple-500/10 text-purple-500"
          gradientFrom="from-purple-500/5"
          gradientTo="to-violet-500/5"
          valueColor="text-purple-500"
        />
      </div>

      {/* Recent Projects */}
      <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                Proyectos Disponibles
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Proyectos a los que tienes acceso
              </CardDescription>
            </div>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-200 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Proyecto
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proyectos.length > 0 ? (
              proyectos.map((project, index) => (
                <ProjectCard key={project.proyecto_id} project={project} index={index} />
              ))
            ) : (
              <EmptyState
                icon={Building2}
                title="No hay proyectos disponibles"
                description="No tienes acceso a ningún proyecto actualmente"
                actionLabel="Solicitar Acceso"
                onAction={() => console.log("Solicitar acceso")}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resumen de Propiedades Disponibles */}
      {usuario.propiedades_disponibles &&
        usuario.propiedades_disponibles.length > 0 && (
          <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Resumen de Propiedades
              </CardTitle>
              <CardDescription className="text-base">
                Vista rápida de las propiedades disponibles por proyecto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {proyectos.map((proyecto, index) => {
                  const propiedadesProyecto =
                    usuario.propiedades_disponibles?.filter(
                      (p) => p.proyecto_id === proyecto.proyecto_id
                    ) || [];

                  const edificiosUnicos = [
                    ...new Set(
                      propiedadesProyecto.map((p) => p.edificio_nombre)
                    ),
                  ];

                  return (
                    <div
                      key={proyecto.proyecto_id}
                      className="p-6 border border-border rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-card/80 backdrop-blur-sm"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <h4 className="font-bold text-lg text-foreground mb-4">
                        {proyecto.nombre}
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
                            {edificiosUnicos.length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground font-medium">
                            Tipos:
                          </span>
                          <span className="font-bold text-green-500">
                            {
                              [
                                ...new Set(
                                  propiedadesProyecto.map(
                                    (p) => p.modelo_nombre
                                  )
                                ),
                              ].length
                            }
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all duration-200 bg-transparent"
                        onClick={() => setActiveMenu("Propiedades")}
                      >
                        Ver Detalles
                      </Button>
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