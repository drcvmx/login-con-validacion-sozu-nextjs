'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PropertyCard } from '@/components/ui/property-card';
import { EmptyState } from '@/components/ui/empty-state';
import { StatsCard } from '@/components/ui/stats-card';
import { PropertyTable } from '@/components/ui/property-table';
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
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import type { PropiedadBase, Usuario } from '@/types';
import * as Dialog from '@radix-ui/react-dialog';
import * as Progress from '@radix-ui/react-progress';
import { toast } from 'sonner';

/**
 * Extrae propiedades de la estructura anidada (proyectos → edificios → modelos).
 * @param propiedadesDisponibles Estructura anidada del backend
 * @returns Array plano de propiedades con metadata de proyecto/edificio/modelo
 */
function extraerPropiedades(
  propiedadesDisponibles: Usuario['propiedades_disponibles'],
): PropiedadBase[] {
  // Validar que propiedadesDisponibles no sea null/undefined
  if (!propiedadesDisponibles || !Array.isArray(propiedadesDisponibles)) {
    console.warn(
      'propiedadesDisponibles es null, undefined o no es un array:',
      propiedadesDisponibles,
    );
    return [];
  }

  return propiedadesDisponibles.flatMap((proyecto) => {
    // Validar que el proyecto exista y tenga edificios
    if (
      !proyecto ||
      !proyecto.edificios ||
      !Array.isArray(proyecto.edificios)
    ) {
      console.warn('Proyecto sin edificios válidos:', proyecto);
      return [];
    }

    return proyecto.edificios.flatMap((edificio) => {
      // Validar que el edificio exista y tenga modelos
      if (!edificio || !edificio.modelos || !Array.isArray(edificio.modelos)) {
        console.warn('Edificio sin modelos válidos:', edificio);
        return [];
      }

      return edificio.modelos.flatMap((modelo) => {
        // Validar que el modelo exista y tenga propiedades
        if (
          !modelo ||
          !modelo.propiedades ||
          !Array.isArray(modelo.propiedades)
        ) {
          console.warn('Modelo sin propiedades válidas:', modelo);
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

  const N8N_ENDPOINT =
    'https://automatizacion-n8n.fbqqbe.easypanel.host/webhook/cargar-archivo-propiedades';

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
  const currentProperties = propiedades.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(propiedades.length / itemsPerPage);

  // ESTADÍSTICAS CORREGIDAS - Calcular desde la estructura completa
  const proyectosUnicos = usuario?.propiedades_disponibles
    ? [
        ...new Set(
          usuario.propiedades_disponibles.map((p) => p.proyecto_nombre),
        ),
      ]
    : [];

  const edificiosUnicos = usuario?.propiedades_disponibles
    ? [
        ...new Set(
          usuario.propiedades_disponibles.flatMap((p) =>
            (p.edificios || []).map((e) => e.edificio_nombre),
          ),
        ),
      ]
    : [];

  const tiposUnicos = usuario?.propiedades_disponibles
    ? [
        ...new Set(
          usuario.propiedades_disponibles.flatMap((p) =>
            (p.edificios || []).flatMap((e) =>
              (e.modelos || []).map((m) => m.modelo_nombre),
            ),
          ),
        ),
      ]
    : [];

  const propiedadesEnriquecidas = propiedades.map((propiedad) => {
    const modelo = usuario?.propiedades_disponibles
      ?.flatMap((p) => p.edificios || [])
      ?.flatMap((e) => e.modelos || [])
      ?.find((m) => m.modelo_id === propiedad.modelo_id);

    return {
      ...propiedad,
      recamaras: modelo?.recamaras ?? 0,
      banos_completos: modelo?.banos_completos ?? 0,
      medio_banos: modelo?.medio_banos ?? 0,
    };
  });

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

      {/* Lista de Propiedades */}
      <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Propiedades Disponibles
          </CardTitle>
          <CardDescription className="text-base">
            Edificios y departamentos disponibles en tus proyectos (
            {propiedades.length} propiedades)
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
              onAction={() => console.log('Solicitar acceso a propiedades')}
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
                .filter((proyecto) => {
                  const propiedadesProyecto = propiedades.filter(
                    (p) => p.proyecto_nombre === proyecto,
                  );
                  return propiedadesProyecto.length > 0; // Solo mostrar si tiene propiedades
                })
                .map((proyecto, index) => {
                  const propiedadesProyecto = propiedades.filter(
                    (p) => p.proyecto_nombre === proyecto,
                  );
                  const edificiosProyecto = [
                    ...new Set(
                      propiedadesProyecto.map((p) => p.edificio_nombre),
                    ),
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
    </div>
  );
}