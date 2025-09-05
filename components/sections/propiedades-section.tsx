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
import { PropertyTable } from "@/components/ui/property-table";
import {
  Building2,
  Plus,
  Home,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  UploadCloud,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import type { PropiedadBase, Usuario } from "@/types";
import * as Dialog from '@radix-ui/react-dialog';
import * as Progress from '@radix-ui/react-progress';
import { toast } from 'sonner';

/**
 * Extrae propiedades de la estructura anidada (proyectos → edificios → modelos).
 * @param propiedadesDisponibles Estructura anidada del backend
 * @returns Array plano de propiedades con metadata de proyecto/edificio/modelo
 */
function extraerPropiedades(
  propiedadesDisponibles: Usuario['propiedades_disponibles']
): PropiedadBase[] {
  // Validar que propiedadesDisponibles no sea null/undefined
  if (!propiedadesDisponibles || !Array.isArray(propiedadesDisponibles)) {
    return [];
  }

  return propiedadesDisponibles.flatMap(proyecto => {
    // Validar que el proyecto exista y tenga edificios
    if (!proyecto || !proyecto.edificios || !Array.isArray(proyecto.edificios)) {
      return [];
    }
    
    return proyecto.edificios.flatMap(edificio => {
      // Validar que el edificio exista y tenga modelos
      if (!edificio || !edificio.modelos || !Array.isArray(edificio.modelos)) {
        return [];
      }
      
      return edificio.modelos.flatMap(modelo => {
        // Validar que el modelo exista y tenga propiedades
        if (!modelo || !modelo.propiedades || !Array.isArray(modelo.propiedades)) {
          return [];
        }
        
        return modelo.propiedades.map(propiedad => ({
          ...propiedad,
          proyecto_nombre: proyecto.proyecto_nombre || 'Sin Proyecto',
          edificio_nombre: edificio.edificio_nombre || 'Sin Edificio',
          modelo_nombre: modelo.modelo_nombre || 'Sin Modelo',
        }));
      });
    });
  });
}

export default function PropiedadesSection() {
  const { usuario } = useAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [openCarga, setOpenCarga] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const N8N_ENDPOINT = 'https://automatizacion-n8n.fbqqbe.easypanel.host/webhook/cargar-archivo-propiedades';

  const onFileSelect = (f?: File) => {
    if (!f) return;
    const isValid = /\.(csv|xlsx?)$/i.test(f.name);
    if (!isValid) {
      toast.error('Formato no permitido. Usa .csv, .xls o .xlsx');
      return;
    }
    setFile(f);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => setDragActive(false);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFileSelect(f);
  };

  const resetState = () => {
    setFile(null);
    setProgress(0);
    setUploading(false);
    xhrRef.current?.abort();
    xhrRef.current = null;
    setOpenCarga(false);
  };

  const subirArchivo = async () => {
    if (!file) {
      toast.error('Selecciona un archivo primero');
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      const form = new FormData();
      form.append('archivo', file);
      form.append('usuario', usuario?.email || 'desconocido@sozu.com');
      form.append('actividad', '7');
      form.append('nombre_usuario', usuario?.nombre || 'desconocido');

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;
        xhr.open('POST', N8N_ENDPOINT, true);
        xhr.setRequestHeader('Accept', 'application/json');

        // (Opcional) timeout de red
        xhr.timeout = 120_000; // 120s
        xhr.ontimeout = () => reject(new Error('Tiempo de espera agotado.'));

        // Progreso REAL de SUBIDA
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 95); // deja 5% para el cierre
            setProgress(pct);
          } else {
            // fallback si no es computable
            setProgress((p) => (p < 90 ? p + 1 : p));
          }
        };

        xhr.onerror = () =>
          reject(new Error('Error de red al subir el archivo.'));
        xhr.onabort = () => reject(new Error('Subida cancelada.'));

        xhr.onload = () => {
          setProgress(100);

          let data: any = null;
          try {
            data = JSON.parse(xhr.responseText || '{}');
          } catch {
            // Si no es JSON, deja data = null
          }

          const success = typeof data?.success === 'boolean' && data.success;

          const mensaje =
            data?.mensaje ??
            data?.message ??
            (success
              ? 'Archivo subido con éxito.'
              : `Error ${xhr.status}: ${xhr.statusText || 'Fallo al subir'}`);

          if (success) {
            toast.success(mensaje, { description: file.name });
            setTimeout(() => resetState(), 700);
            resolve();
          } else {
            reject(new Error(mensaje));
          }
        };

        xhr.send(form);
      });
    } catch (err: any) {
      toast.error('Error al subir', { description: err.message });
    } finally {
      setUploading(false);
    }
  };

  if (!usuario) return null;

  const propiedades = usuario?.propiedades_disponibles 
    ? extraerPropiedades(usuario.propiedades_disponibles) 
    : usuario?.todas_las_propiedades ?? [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProperties = propiedades.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(propiedades.length / itemsPerPage);

  // ESTADÍSTICAS CORREGIDAS - Calcular desde la estructura completa
  const proyectosUnicos = usuario?.propiedades_disponibles 
    ? [...new Set(usuario.propiedades_disponibles.map(p => p.proyecto_nombre))]
    : [];
  
  const edificiosUnicos = usuario?.propiedades_disponibles 
    ? [...new Set(usuario.propiedades_disponibles.flatMap(p => 
        (p.edificios || []).map(e => e.edificio_nombre)
      ))]
    : [];
  
  const tiposUnicos = usuario?.propiedades_disponibles 
    ? [...new Set(usuario.propiedades_disponibles.flatMap(p => 
        (p.edificios || []).flatMap(e => (e.modelos || []).map(m => m.modelo_nombre))
      ))]
    : [];

  const propiedadesEnriquecidas = propiedades.map(propiedad => {
    const modelo = usuario?.propiedades_disponibles
      ?.flatMap(p => (p.edificios || []))
      ?.flatMap(e => (e.modelos || []))
      ?.find(m => m.modelo_id === propiedad.modelo_id);

    // Buscar información adicional del modelo incluso si no tiene propiedades asociadas
    let recamaras = modelo?.recamaras ?? 0;
    let banos_completos = modelo?.banos_completos ?? 0;
    let medio_banos = modelo?.medio_banos ?? 0;
    
    // Si no encontramos el modelo por modelo_id, buscar por nombre del modelo
    if (!modelo || (recamaras === 0 && banos_completos === 0 && medio_banos === 0)) {
      const modeloPorNombre = usuario?.propiedades_disponibles
        ?.flatMap(p => (p.edificios || []))
        ?.flatMap(e => (e.modelos || []))
        ?.find(m => m.modelo_nombre === propiedad.modelo_nombre);
      
      if (modeloPorNombre) {
        recamaras = modeloPorNombre.recamaras ?? recamaras;
        banos_completos = modeloPorNombre.banos_completos ?? banos_completos;
        medio_banos = modeloPorNombre.medio_banos ?? medio_banos;
      }
    }

    console.log(`Modelo: ${propiedad.modelo_nombre}, Recámaras: ${recamaras}, Baños completos: ${banos_completos}, Medio baños: ${medio_banos}`);

    return {
      ...propiedad,
      recamaras,
      banos_completos,
      medio_banos,
    };
  });

  return (
    <div className="space-y-8 animate-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestión de Propiedades</h2>
          <p className="text-muted-foreground mt-1">Administra las propiedades disponibles</p>
        </div>
        <div className="flex gap-4">
          <Dialog.Root
            open={openCarga}
            onOpenChange={(v) => {
              if (!v) resetState();
              setOpenCarga(v);
            }}
          >
            <Dialog.Trigger asChild>
              <Button className="cursor-pointer bg-gradient-to-r from-primary to-secondary">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Carga Masiva
              </Button>
            </Dialog.Trigger>
            <Dialog.Content className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
              <div className="bg-card p-6 rounded-lg max-w-md w-full z-[10000]">
                <Dialog.Title className="text-xl font-bold flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5" />
                  Subir Archivo
                </Dialog.Title>
                <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center mt-4 ${
                    dragActive ? 'border-primary bg-primary/10' : 'border-muted'
                  }`}
                >
                  <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2">Arrastra tu archivo aquí o</p>
                  <input
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    onChange={(e) => onFileSelect(e.target.files?.[0])}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block mt-2 px-4 py-2 bg-muted rounded-md cursor-pointer"
                  >
                    Seleccionar Archivo
                  </label>
                </div>
                {file && (
                  <div className="mt-4">
                    <p className="text-sm">
                      Archivo seleccionado:{' '}
                      <span className="font-medium">{file.name}</span>
                    </p>
                  </div>
                )}
                {uploading && (
                  <div className="mt-4">
                    <Progress.Root className="h-2 bg-muted rounded-full overflow-hidden">
                      <Progress.Indicator
                        className="h-full bg-primary transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </Progress.Root>
                    <p className="text-xs mt-1 text-muted-foreground">
                      Subiendo... {progress}%
                    </p>
                  </div>
                )}
                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="outline" onClick={resetState} className='cursor-pointer'>
                    Cancelar
                  </Button>
                  <Button
                    onClick={subirArchivo}
                    disabled={!file || uploading}
                    className="cursor-pointer px-4 py-2 text-sm"
                  >
                    {uploading ? 'Subiendo...' : 'Subir'}
                  </Button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </div>

      {/* Estadísticas de Propiedades */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Proyectos"
          value={proyectosUnicos.length}
          subtitle=""
          icon={Users}
          iconColor="bg-green-500/10 text-green-500"
          gradientFrom="from-green-500/5"
          gradientTo="to-emerald-500/5"
          valueColor="text-green-500"
        />

        <StatsCard
          title="Edificios"
          value={edificiosUnicos.length}
          subtitle=""
          icon={Home}
          iconColor="bg-blue-500/10 text-blue-500"
          gradientFrom="from-blue-500/5"
          gradientTo="to-cyan-500/5"
          valueColor="text-blue-500"
        />
        
          <StatsCard
          title="Modelos"
          value={tiposUnicos.length}
          subtitle=""
          icon={FileText}
          iconColor="bg-orange-500/10 text-orange-500"
          gradientFrom="from-orange-500/5"
          gradientTo="to-red-500/5"
          valueColor="text-orange-500"
        />

        <StatsCard
          title="Propiedades"
          value={propiedades.length}
          subtitle=""
          icon={Building2}
          iconColor="bg-purple-500/10 text-purple-500"
          gradientFrom="from-purple-500/5"
          gradientTo="to-violet-500/5"
          valueColor="text-purple-500"
        />
      </div>

      
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
          {currentProperties.length > 0 ? (
            <PropertyTable propiedades={propiedadesEnriquecidas} />
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
              {proyectosUnicos
                .filter(proyecto => {
                  const propiedadesProyecto = propiedades.filter(
                    (p) => p.proyecto_nombre === proyecto
                  );
                  return propiedadesProyecto.length > 0; // Solo mostrar si tiene propiedades
                })
                .map((proyecto, index) => {
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
                          Modelos:
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

     

      {/* Nueva Sección: Modelos */}
      {tiposUnicos.length > 0 && (
        <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6 text-orange-500" />
              Modelos Disponibles
            </CardTitle>
            <CardDescription>
              Información detallada de todos los modelos de propiedades ({tiposUnicos.length} modelos)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tiposUnicos.map((modeloNombre, index) => {
                // Obtener información completa del modelo
                const modeloInfo = usuario?.propiedades_disponibles
                  ?.flatMap(p => p.edificios || [])
                  ?.flatMap(e => e.modelos || [])
                  ?.find(m => m.modelo_nombre === modeloNombre);
                
                // Contar propiedades de este modelo
                const propiedadesModelo = propiedades.filter(
                  p => p.modelo_nombre === modeloNombre
                );
                
                // Obtener edificios que tienen este modelo
                const edificiosConModelo = [...new Set(
                  propiedadesModelo.map(p => p.edificio_nombre)
                )];
                
                // Obtener proyectos que tienen este modelo
                const proyectosConModelo = [...new Set(
                  propiedadesModelo.map(p => p.proyecto_nombre)
                )];

                return (
                  <div
                    key={modeloNombre}
                    className="group p-6 border border-border rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-orange-500/5 to-red-500/5 hover:from-orange-500/10 hover:to-red-500/10"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-500/10 rounded-xl group-hover:bg-orange-500/20 transition-colors">
                          <FileText className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-foreground">
                            {modeloNombre}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Modelo ID: {modeloInfo?.modelo_id || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-500">
                          {propiedadesModelo.length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Propiedades
                        </div>
                      </div>
                    </div>
                    
                    {/* Información de recámaras y baños */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-3 bg-card/60 rounded-lg border border-border/50">
                        <div className="text-lg font-bold text-secondary">
                          {modeloInfo?.recamaras ?? 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Recámaras
                        </div>
                      </div>
                      
                      <div className="text-center p-3 bg-card/60 rounded-lg border border-border/50">
                        <div className="text-lg font-bold text-accent">
                          {modeloInfo?.banos_completos ?? 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Baños
                        </div>
                      </div>
                      
                      <div className="text-center p-3 bg-card/60 rounded-lg border border-border/50">
                        <div className="text-lg font-bold text-chart-1">
                          {modeloInfo?.medio_banos ?? 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Medio Baños
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-card/60 rounded-lg border border-border/50">
                        <span className="text-sm font-medium text-muted-foreground">
                          Edificios:
                        </span>
                        <span className="text-sm font-bold text-blue-500">
                          {edificiosConModelo.length}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-card/60 rounded-lg border border-border/50">
                        <span className="text-sm font-medium text-muted-foreground">
                          Proyectos:
                        </span>
                        <span className="text-sm font-bold text-green-500">
                          {proyectosConModelo.length}
                        </span>
                      </div>
                      
                      {/* Lista de proyectos */}
                      {proyectosConModelo.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-medium text-muted-foreground mb-2">
                            Disponible en:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {proyectosConModelo.slice(0, 2).map(proyecto => (
                              <span
                                key={proyecto}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20"
                              >
                                {proyecto}
                              </span>
                            ))}
                            {proyectosConModelo.length > 2 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                                +{proyectosConModelo.length - 2} más
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
    </div>
  );
}