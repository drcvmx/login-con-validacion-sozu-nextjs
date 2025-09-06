import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { PropertyFiltersComponent, PropertyFilters } from './property-filters';
import { useMemo } from 'react';
import {
  Plus,
  Trash2,
  Pencil,
  Download,
  UploadCloud,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import type { NombrePermiso } from '@/lib/permisos-ls';

type PermisosTabla = Record<string, NombrePermiso[]>;

interface PropertyTableProps {
  propiedades: Array<{
    propiedad_id: number;
    numero_propiedad: string;
    modelo_nombre: string;
    recamaras: number;
    banos_completos: number;
    m2_reales: number;
    precio_lista: number;
    proyecto_nombre: string;
  }>;
  permisos?: PermisosTabla;
  submenuActivo?: string;
  // acciones por fila:
  onAgregar?: (p: any) => void;
  onCargarInfo?: (p: any) => void;
  onDescargarInfo?: (p: any) => void;
  onActualizar?: (p: any) => void;
  onEliminar?: (p: any) => void;
  onGenerarOferta?: (p: any) => void;
}

const ICON = {
  agregar: {
    C: Plus,
    cls: 'bg-green-600 hover:bg-green-700 text-white',
    title: 'Agregar',
  },
  cargar: {
    C: UploadCloud,
    cls: 'bg-sky-600 hover:bg-sky-700 text-white',
    title: 'Cargar información',
  },
  descargar: {
    C: Download,
    cls: 'bg-gray-600 hover:bg-gray-700 text-white',
    title: 'Descargar información',
  },
  actualizar: {
    C: Pencil,
    cls: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    title: 'Actualizar',
  },
  eliminar: {
    C: Trash2,
    cls: 'bg-red-600 hover:bg-red-700 text-white',
    title: 'Eliminar',
  },
  oferta: {
    C: FileText,
    cls: 'bg-violet-600 hover:bg-violet-700 text-white',
    title: 'Generar oferta',
  },
  generico: {
    C: ShieldCheck,
    cls: 'bg-neutral-600 hover:bg-neutral-700 text-white',
    title: 'Acción',
  },
} as const;

const ORDER: NombrePermiso[] = [
  'Agregar',
  'Cargar información',
  'Descargar información',
  'Actualizar',
  'Eliminar',
  'Generar oferta',
];

function cfgFor(nombre: string) {
  const key = nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  if (key === 'agregar') return ICON.agregar;
  if (key === 'cargar informacion') return ICON.cargar;
  if (key === 'descargar informacion') return ICON.descargar;
  if (key === 'actualizar') return ICON.actualizar;
  if (key === 'eliminar') return ICON.eliminar;
  if (key === 'generar oferta') return ICON.oferta;
  return { ...ICON.generico, title: nombre };
}

export function PropertyTable({
  propiedades,
  permisos,
  submenuActivo,
  onAgregar,
  onCargarInfo,
  onDescargarInfo,
  onActualizar,
  onEliminar,
  onGenerarOferta,
}: PropertyTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<PropertyFilters>({});
  const itemsPerPage = 10;

  // Función para filtrar propiedades
  const filterProperties = (
    properties: typeof propiedades,
    filters: PropertyFilters,
  ) => {
    return properties.filter((propiedad) => {
      // Filtro por ID
      if (
        filters.id &&
        !propiedad.propiedad_id.toString().includes(filters.id)
      ) {
        return false;
      }

      // Filtro por número
      if (
        filters.numero &&
        !propiedad.numero_propiedad
          .toLowerCase()
          .includes(filters.numero.toLowerCase())
      ) {
        return false;
      }

      // Filtro por modelo
      if (filters.modelo && propiedad.modelo_nombre !== filters.modelo) {
        return false;
      }

      // Filtro por proyecto
      if (filters.proyecto && propiedad.proyecto_nombre !== filters.proyecto) {
        return false;
      }

      // Filtro por recámaras
      if (filters.recamaras) {
        if (
          filters.recamaras.min !== undefined &&
          propiedad.recamaras < filters.recamaras.min
        ) {
          return false;
        }
        if (
          filters.recamaras.max !== undefined &&
          propiedad.recamaras > filters.recamaras.max
        ) {
          return false;
        }
      }

      // Filtro por baños
      if (filters.banos) {
        if (
          filters.banos.min !== undefined &&
          propiedad.banos_completos < filters.banos.min
        ) {
          return false;
        }
        if (
          filters.banos.max !== undefined &&
          propiedad.banos_completos > filters.banos.max
        ) {
          return false;
        }
      }

      // Filtro por m²
      if (filters.m2) {
        if (
          filters.m2.min !== undefined &&
          propiedad.m2_reales < filters.m2.min
        ) {
          return false;
        }
        if (
          filters.m2.max !== undefined &&
          propiedad.m2_reales > filters.m2.max
        ) {
          return false;
        }
      }

      // Filtro por precio
      if (filters.precio) {
        if (
          filters.precio.min !== undefined &&
          propiedad.precio_lista < filters.precio.min
        ) {
          return false;
        }
        if (
          filters.precio.max !== undefined &&
          propiedad.precio_lista > filters.precio.max
        ) {
          return false;
        }
      }

      return true;
    });
  };

  // Obtener listas únicas para los selectores
  const proyectosUnicos = [
    ...new Set(propiedades.map((p) => p.proyecto_nombre)),
  ].sort();
  const modelosUnicos = [
    ...new Set(propiedades.map((p) => p.modelo_nombre)),
  ].sort();

  // Aplicar filtros
  const propiedadesFiltradas = filterProperties(propiedades, filters);

  // Calcular propiedades paginadas
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = propiedadesFiltradas.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(propiedadesFiltradas.length / itemsPerPage);

  // Reset página cuando cambian los filtros
  const handleFiltersChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const permisosFila = useMemo(() => {
    const list = submenuActivo
      ? permisos?.[submenuActivo] ?? []
      : Array.from(new Set(Object.values(permisos ?? {}).flat()));
    return new Set<NombrePermiso>(list);
  }, [permisos, submenuActivo]);

  const onClickByName: Record<string, (p: any) => void> = {
    Agregar: (p) => onAgregar?.(p),
    'Cargar información': (p) => onCargarInfo?.(p),
    'Descargar información': (p) => onDescargarInfo?.(p),
    Actualizar: (p) => onActualizar?.(p),
    Eliminar: (p) => onEliminar?.(p),
    'Generar oferta': (p) => onGenerarOferta?.(p),
  };

  const renderRowActions = (prop: any) => {
    if (!permisosFila.size)
      return (
        <span className="text-xs text-muted-foreground">Solo lectura</span>
      );

    const visibles = Array.from(permisosFila).sort((a, b) => {
      const ia = ORDER.indexOf(a);
      const ib = ORDER.indexOf(b);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });

    return (
      <div className="flex items-center gap-2">
        {visibles.map((nombre) => {
          const { C, cls, title } = cfgFor(nombre);
          const onClick = onClickByName[nombre] ?? (() => {});
          return (
            <Button
              key={nombre}
              size="icon"
              className={cls}
              title={title}
              aria-label={title}
              onClick={() => onClick(prop)}
            >
              <C className="h-4 w-4" />
            </Button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Componente de filtros */}
      <PropertyFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        proyectos={proyectosUnicos}
        modelos={modelosUnicos}
      />

      {/* Información de resultados */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>
          Mostrando {currentItems.length} de {propiedadesFiltradas.length}{' '}
          propiedades
          {propiedadesFiltradas.length !== propiedades.length && (
            <span className="text-primary font-medium">
              {' '}
              (filtradas de {propiedades.length} total)
            </span>
          )}
        </span>
      </div>

      {/* Tabla */}
      <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
        <div className="relative w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="sticky top-0 z-20 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Número
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Modelo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Recámaras
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Baños
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  m²
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Proyecto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {currentItems.length > 0 ? (
                currentItems.map((propiedad) => (
                  <tr
                    key={propiedad.propiedad_id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {propiedad.propiedad_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {propiedad.numero_propiedad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {propiedad.modelo_nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                        {propiedad.recamaras}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                        {propiedad.banos_completos}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {propiedad.m2_reales}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                      ${propiedad.precio_lista.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {propiedad.proyecto_nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {renderRowActions(propiedad)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Search className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="font-medium">
                        No se encontraron propiedades
                      </p>
                      <p className="text-sm">
                        Intenta ajustar los filtros de búsqueda
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="border-border/50 hover:bg-muted/50"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="border-border/50 hover:bg-muted/50"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
