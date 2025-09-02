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
  proyectos_acceso?: Proyecto[]
  propiedades_disponibles?: PropiedadDisponible[]
}