"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  Building2,
  Plus,
  Eye,
  Edit,
  Trash2,
  Home,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { ProyectoForm } from "@/components/forms/proyecto-form";
import { useCrudOperations } from "@/hooks/use-crud-operations";
import { useConfirmDialog } from "@/components/ui/confirm-dialog"
import { toast } from "sonner"
import type { PropiedadBase, Usuario } from "@/types";

/**
 * Extrae propiedades de la estructura anidada (proyectos → edificios → modelos).
 */
function extraerPropiedades(
  propiedadesDisponibles: Usuario['propiedades_disponibles'],
): PropiedadBase[] {
  if (!propiedadesDisponibles || !Array.isArray(propiedadesDisponibles)) {
    return [];
  }

  return propiedadesDisponibles.flatMap((proyecto) => {
    if (!proyecto || !proyecto.edificios || !Array.isArray(proyecto.edificios)) {
      return [];
    }

    return proyecto.edificios.flatMap((edificio) => {
      if (!edificio || !edificio.modelos || !Array.isArray(edificio.modelos)) {
        return [];
      }

      return edificio.modelos.flatMap((modelo) => {
        if (!modelo || !modelo.propiedades || !Array.isArray(modelo.propiedades)) {
          return [];
        }

        return modelo.propiedades.map((propiedad) => ({
          ...propiedad,
          proyecto_nombre: proyecto.proyecto_nombre || 'Sin Proyecto',
          edificio_nombre: edificio.edificio_nombre || 'Sin Edificio',
          modelo_nombre: modelo.modelo_nombre || 'Sin Modelo',
        }));
      });
    });
  });
}

export default function ProyectosSection() {
  const { proyectos, hasPermission, refreshAuth, usuario } = useAuth();
  const { deleteProyecto, loading } = useCrudOperations();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Extraer propiedades y calcular edificios únicos
  const propiedades = usuario?.propiedades_disponibles
    ? extraerPropiedades(usuario.propiedades_disponibles)
    : usuario?.todas_las_propiedades ?? [];

  const edificiosUnicos = usuario?.propiedades_disponibles
    ? [
        ...new Set(
          usuario.propiedades_disponibles.flatMap((p) =>
            (p.edificios || []).map((e) => e.edificio_nombre),
          ),
        ),
      ]
    : [];

  const handleView = (project: any) => {
    setSelectedProject(project);
    setShowViewModal(true);
  };

  const handleEdit = (project: any) => {
    setSelectedProject(project);
    setShowEditForm(true);
  };

  const { showConfirm, ConfirmDialog } = useConfirmDialog()
  const handleDelete = async (id: number, nombre: string) => {
    showConfirm({
      title: "Eliminar Proyecto",
      description: `¿Estás seguro de que deseas eliminar el proyecto "${nombre}"? Esta acción no se puede deshacer.`,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "destructive",
      onConfirm: async () => {
        try {
          await deleteProyecto(id)
          toast.success("Proyecto eliminado exitosamente")
          await refreshAuth() // Agregar re-fetch después de eliminación exitosa
        } catch (error) {
          console.error('Error al eliminar proyecto:', error)
          toast.error("Error al eliminar el proyecto")
        }
      },
    })
  }

  const canAdd = hasPermission('Agregar');
  const canEdit = hasPermission('Actualizar');
  const canDelete = hasPermission('Eliminar');

  return (
    <div className="space-y-8 animate-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Gestión de Proyectos
          </h2>
          <p className="text-muted-foreground mt-1">
            Administra los proyectos inmobiliarios
          </p>
        </div>
        {canAdd && (
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-200 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Proyecto
          </Button>
        )}
      </div>

      {/* Estadísticas de Proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Proyectos
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-1">
              {proyectos.length}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Edificios
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <span className="text-2xl">🏗️</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500 mb-1">
              {proyectos.reduce((acc, p) => acc + p.edificios_count, 0)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Precio Promedio
            </CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-500 mb-1">
              $
              {proyectos.length > 0
                ? Math.round(
                    proyectos.reduce((acc, p) => acc + p.precio_m2_actual, 0) /
                      proyectos.length
                  ).toLocaleString()
                : "0"}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>MXN por m²</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {proyectos.length > 0 ? (
          proyectos.map((project, index) => (
            <Card
              key={project.proyecto_id}
              className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-lg animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{project.nombre}</CardTitle>
                  <Badge
                    variant={project.activo ? "default" : "secondary"}
                    className={
                      project.activo ? "bg-green-500 hover:bg-green-600" : ""
                    }
                  >
                    {project.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <CardDescription className="text-sm line-clamp-2">
                  {project.direccion}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-lg font-semibold text-primary">
                    ${project.precio_m2_actual.toLocaleString()} MXN/m²
                  </p>
                  
                  <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                      <span>🏢 Tipo:</span>
                      <span className="font-medium">{project.tipo_uso}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                      <span>🏗️ Edificios:</span>
                      <span className="font-medium">{project.edificios_count}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                      <span>🎯 Amenidades:</span>
                      <span className="font-medium">{project.amenidades_count}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                      <span>📅 Inicio:</span>
                      <span className="font-medium">
                        {new Date(project.fecha_inicio_construccion).toLocaleDateString("es-MX")}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {project.descripcion}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(project)}
                      className="flex-1 bg-transparent hover:bg-primary/10 hover:text-primary"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver
                    </Button>
                    {canEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(project)}
                        className="flex-1 bg-transparent hover:bg-secondary/10 hover:text-secondary"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(project.proyecto_id, project.nombre)}
                        disabled={loading}
                        className="flex-1 bg-transparent hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 opacity-20">
              <Building2 className="w-12 h-12 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No hay proyectos disponibles
            </h3>
            <p className="text-muted-foreground mb-6">
              No tienes acceso a ningún proyecto actualmente
            </p>
            <Button
              variant="outline"
              className="hover:bg-primary/10 hover:text-primary hover:border-primary bg-transparent"
            >
              Solicitar Acceso
            </Button>
          </div>
        )}
      </div>

      {proyectos.length > 0 && (
        <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Análisis por Tipo de Uso
            </CardTitle>
            <CardDescription>
              Distribución de proyectos por tipo de uso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...new Set(proyectos.map(p => p.tipo_uso))].map((tipo, index) => {
                const proyectosTipo = proyectos.filter(p => p.tipo_uso === tipo);
                const precioPromedio = Math.round(
                  proyectosTipo.reduce((acc, p) => acc + p.precio_m2_actual, 0) / proyectosTipo.length
                );
                
                return (
                  <div
                    key={tipo}
                    className="p-6 border border-border rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-card/80 backdrop-blur-sm"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <h4 className="font-bold text-lg text-foreground mb-4">
                      {tipo}
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground font-medium">
                          Proyectos:
                        </span>
                        <span className="font-bold text-primary">
                          {proyectosTipo.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground font-medium">
                          Precio Promedio:
                        </span>
                        <span className="font-bold text-green-500">
                          ${precioPromedio.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground font-medium">
                          Edificios:
                        </span>
                        <span className="font-bold text-secondary">
                          {proyectosTipo.reduce((acc, p) => acc + p.edificios_count, 0)}
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

        
       {/* Nueva Sección: Edificios */}
      {edificiosUnicos.length > 0 && (
        <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Home className="w-6 h-6 text-blue-500" />
              Edificios Disponibles
            </CardTitle>
            <CardDescription>
              Información detallada de todos los edificios ({edificiosUnicos.length} edificios)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {edificiosUnicos.map((edificioNombre, index) => {
                // Obtener información del edificio
                const edificioInfo = usuario?.propiedades_disponibles
                  ?.flatMap(p => p.edificios || [])
                  ?.find(e => e.edificio_nombre === edificioNombre);
                
                // Contar propiedades en este edificio
                const propiedadesEdificio = propiedades.filter(
                  p => p.edificio_nombre === edificioNombre
                );
                
                // Obtener modelos únicos en este edificio
                const modelosEdificio = [...new Set(
                  propiedadesEdificio.map(p => p.modelo_nombre)
                )];
                
                // Obtener proyecto del edificio
                const proyectoEdificio = usuario?.propiedades_disponibles
                  ?.find(p => p.edificios?.some(e => e.edificio_nombre === edificioNombre))
                  ?.proyecto_nombre || 'Sin Proyecto';

                return (
                  <div
                    key={edificioNombre}
                    className="group p-6 border border-border rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-blue-500/5 to-cyan-500/5 hover:from-blue-500/10 hover:to-cyan-500/10"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                          <Home className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-foreground">
                            {edificioNombre}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {proyectoEdificio}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-500">
                          {propiedadesEdificio.length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Propiedades
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-card/60 rounded-lg border border-border/50">
                        <span className="text-sm font-medium text-muted-foreground">
                          ID Edificio:
                        </span>
                        <span className="text-sm font-bold text-foreground">
                          {edificioInfo?.edificio_id || 'N/A'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-card/60 rounded-lg border border-border/50">
                        <span className="text-sm font-medium text-muted-foreground">
                          Modelos:
                        </span>
                        <span className="text-sm font-bold text-secondary">
                          {modelosEdificio.length}
                        </span>
                      </div>
                      
                      {modelosEdificio.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-medium text-muted-foreground mb-2">
                            Modelos disponibles:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {modelosEdificio.slice(0, 3).map(modelo => (
                              <span
                                key={modelo}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20"
                              >
                                {modelo}
                              </span>
                            ))}
                            {modelosEdificio.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                                +{modelosEdificio.length - 3} más
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <ProyectoForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        mode="create"
        onSuccess={() => {
          setShowCreateForm(false);
        }}
      />

      <ProyectoForm
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false);
          setSelectedProject(null);
        }}
        mode="edit"
        initialData={selectedProject}
        onSuccess={() => {
          setShowEditForm(false);
          setSelectedProject(null);
        }}
      />

      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalles del Proyecto</DialogTitle>
            <DialogDescription>Consulta la información del proyecto.</DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-3">
              <div>
                <span className="font-semibold">Nombre: </span>
                <span>{selectedProject.nombre}</span>
              </div>
              <div>
                <span className="font-semibold">Dirección: </span>
                <span>{selectedProject.direccion}</span>
              </div>
              <div>
                <span className="font-semibold">Tipo de uso: </span>
                <span>{selectedProject.tipo_uso}</span>
              </div>
              <div>
                <span className="font-semibold">Edificios: </span>
                <span>{selectedProject.edificios_count}</span>
              </div>
              <div>
                <span className="font-semibold">Amenidades: </span>
                <span>{selectedProject.amenidades_count}</span>
              </div>
              <div>
                <span className="font-semibold">Precio m²: </span>
                <span>${selectedProject.precio_m2_actual?.toLocaleString()} MXN</span>
              </div>
              <div>
                <span className="font-semibold">Inicio construcción: </span>
                <span>{new Date(selectedProject.fecha_inicio_construccion).toLocaleDateString("es-MX")}</span>
              </div>
              <div>
                <span className="font-semibold">Descripción: </span>
                <span>{selectedProject.descripcion}</span>
              </div>
              <div>
                <span className="font-semibold">Estado: </span>
                <span>{selectedProject.activo ? "Activo" : "Inactivo"}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog />
    </div>
  );
}