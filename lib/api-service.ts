// Servicio para comunicación con n8n workflows
export class ApiService {
  private static readonly BASE_URL = 'https://n8n.sozu.com/webhook/crud-proyectos-propiedades-usuarios';
  
  // Método genérico para operaciones CRUD
  static async crudOperation<T = any>(
    entity: 'usuario' | 'proyecto' | 'propiedad',
    operation: 'create' | 'update' | 'delete' | 'read',
    data?: any,
    id?: string | number
  ): Promise<T> {
    const payload = {
      entity,
      operation,
      data,
      id
    };

    try {
      const response = await fetch("https://n8n.sozu.com/webhook/crud-proyectos-propiedades-usuarios", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        redirect: 'follow' // Añade esto para manejar redirecciones
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Métodos específicos para usuarios
  static async createUsuario(userData: {
    email: string;
    nombre: string;
    telefono: string;
    clave_pais_telefono: string;
    rol_id: number;
    activo?: boolean;
  }) {
    return this.crudOperation('usuario', 'create', userData);
  }

  static async updateUsuario(email: string, userData: {
    nombre: string;
    telefono: string;
    clave_pais_telefono: string;
    rol_id: number;
    activo: boolean;
  }) {
    return this.crudOperation('usuario', 'update', userData, email);
  }

  static async deleteUsuario(email: string) {
    return this.crudOperation('usuario', 'delete', null, email);
  }

  // Métodos específicos para proyectos
  static async createProyecto(projectData: {
    nombre: string;
    direccion: string;
    descripcion: string;
    latitud: number;
    longitud: number;
    url_logo: string;
    id_tipo_uso: number;
    fecha_inicio_construccion: string;
    precio_m2_actual: number;
    activo?: boolean;
  }) {
    return this.crudOperation('proyecto', 'create', projectData);
  }

  static async updateProyecto(id: number, projectData: {
    nombre: string;
    direccion: string;
    descripcion: string;
    latitud: number;
    longitud: number;
    url_logo: string;
    id_tipo_uso: number;
    fecha_inicio_construccion: string;
    precio_m2_actual: number;
    activo: boolean;
  }) {
    return this.crudOperation('proyecto', 'update', projectData, id);
  }

  static async deleteProyecto(id: number) {
    return this.crudOperation('proyecto', 'delete', null, id);
  }

  // Métodos específicos para propiedades
  static async createPropiedad(propertyData: {
    nombre: string;
    descripcion: string;
    numero_recamaras: number;
    numero_completo_banos: number;
    numero_medio_bano: number;
    activo?: boolean;
  }) {
    return this.crudOperation('propiedad', 'create', propertyData);
  }

  static async updatePropiedad(id: number, propertyData: {
    nombre: string;
    descripcion: string;
    numero_recamaras: number;
    numero_completo_banos: number;
    numero_medio_bano: number;
    activo: boolean;
  }) {
    return this.crudOperation('propiedad', 'update', propertyData, id);
  }

  static async deletePropiedad(id: number) {
    return this.crudOperation('propiedad', 'delete', null, id);
  }

  // Método para login (usando el workflow existente)
  static async login(email: string) {
    try {
      const response = await fetch(`${this.BASE_URL}/loginconvalidacion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en el login');
      }

      return await response.json();
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  }
}