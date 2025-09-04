export interface Proyecto {
  proyecto_id: number
  nombre: string
  direccion: string
  descripcion: string
  latitud: number
  longitud: number
  url_logo: string
  tipo_uso: string
  fecha_inicio_construccion: string
  precio_m2_actual: number
  activo: boolean
  edificios_count: number
  amenidades_count: number
}

export interface PropiedadDisponible {
  modelo_id: number
  modelo_nombre: string
  descripcion: string
  recamaras: number
  banos_completos: number
  medio_banos: number
  proyecto_id: number
  proyecto_nombre: string
  edificio_id: number
  edificio_nombre: string
  edificio_pisos: string
  caracteristicas: string[]
  multimedias: Multimedia[] | null
}

export interface Multimedia {
  es_imagen: boolean
  url: string
}

export interface Usuario {
  email: string
  nombre: string
  telefono: string
  clave_pais_telefono: string
  activo: boolean
  rol: {
    id: number
    nombre: string
    descripcion: string
    activo: boolean
    menus: Array<{
      id: number
      nombre: string
      activo: boolean
      submenus: Array<{
        id: number
        nombre: string
        activo: boolean
        permisos: Array<{
          id: number
          nombre: string
          descripcion: string | null
          activo: boolean
        }>
      }>
    }>
  }
  proyectos_acceso: Proyecto[]
  propiedades_disponibles: {
    proyecto_id: number;
    proyecto_nombre: string;
    edificios: {
      edificio_id: number;
      edificio_nombre: string;
      modelos: {
        modelo_id: number;
        modelo_nombre: string;
        propiedades: PropiedadBase[] | null; // Propiedades específicas
        recamaras?: number;
        banos_completos?: number;
        medio_banos?: number;
      }[];
    }[];
  }[]
  // Opcional: mantener temporalmente el campo obsoleto con comentario
  /** @deprecated Usar propiedades_disponibles en su lugar */
  todas_las_propiedades?: PropiedadBase[]; 
}

// Tipos para formularios CRUD
export interface CreateUsuarioForm {
  email: string
  nombre: string
  telefono: string
  clave_pais_telefono: string
  rol_id: number
  activo?: boolean
}

export interface UpdateUsuarioForm {
  nombre: string
  telefono: string
  clave_pais_telefono: string
  rol_id: number
  activo: boolean
}

export interface CreateProyectoForm {
  nombre: string
  direccion: string
  descripcion: string
  latitud: number
  longitud: number
  url_logo: string
  id_tipo_uso: number
  fecha_inicio_construccion: string
  precio_m2_actual: number
  activo?: boolean
}

export interface UpdateProyectoForm {
  nombre: string
  direccion: string
  descripcion: string
  latitud: number
  longitud: number
  url_logo: string
  id_tipo_uso: number
  fecha_inicio_construccion: string
  precio_m2_actual: number
  activo: boolean
}

export interface CreatePropiedadForm {
  nombre: string
  descripcion: string
  numero_recamaras: number
  numero_completo_banos: number
  numero_medio_bano: number
  activo?: boolean
}

export interface UpdatePropiedadForm {
  nombre: string
  descripcion: string
  numero_recamaras: number
  numero_completo_banos: number
  numero_medio_bano: number
  activo: boolean
}

// Tipos para respuestas de API
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: { // Para respuestas paginadas
    total: number;
    page: number;
  };
}

export interface CrudOperation {
  entity: 'usuario' | 'proyecto' | 'propiedad'
  operation: 'create' | 'update' | 'delete' | 'read'
  data?: any
  id?: string | number
}

export interface PropiedadBase {
  propiedad_id: number;
  numero_propiedad: string;
  precio_lista: number;
  m2_reales: number;
  activo: boolean;
  modelo_id: number;
  modelo_nombre: string;
  proyecto_id: number;
  proyecto_nombre: string;
  edificio_id: number;
  edificio_nombre: string;
  edificio_pisos?: string; // Hacer opcional
}

export interface ModeloPropiedad {
  modelo_id: number;
  recamaras: number;
  banos_completos: number;
  medio_banos: number;
  descripcion: string;
  caracteristicas: string[];
  multimedias: Array<{
    es_imagen: boolean;
    url: string;
  }>;
}

export interface PropiedadCompleta extends PropiedadBase {
  recamaras: number;
  banos_completos: number;
  medio_banos: number;
  descripcion: string;
  caracteristicas: string[];
  multimedias: Array<{
    es_imagen: boolean;
    url: string;
  }>;
}

/**
 * Extrae y aplana las propiedades de la estructura anidada
 */
export function extraerPropiedades(propiedadesDisponibles: Usuario['propiedades_disponibles']): PropiedadBase[] {
  return propiedadesDisponibles.flatMap(proyecto => 
    proyecto.edificios.flatMap(edificio => 
      edificio.modelos.flatMap(modelo => 
        modelo.propiedades?.map(propiedad => ({
          ...propiedad,
          proyecto_nombre: proyecto.proyecto_nombre,
          edificio_nombre: edificio.edificio_nombre,
          modelo_nombre: modelo.modelo_nombre,
        })) || []
      )
    )
  );
}