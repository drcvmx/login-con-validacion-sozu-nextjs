export type NombrePermiso =
  | 'Agregar'
  | 'Eliminar'
  | 'Actualizar'
  | 'Descargar información'
  | 'Cargar información'
  | 'Generar oferta';

export type PermisosByMenu = Record<string, Record<string, NombrePermiso[]>>;

type UsuarioLS = {
  usuario?: {
    rol?: {
      menus?: Array<{
        nombre: string;
        activo: boolean;
        submenus?: Array<{
          nombre: string;
          activo: boolean;
          permisos?: Array<{ nombre: string; activo: boolean }>;
        }>;
      }>;
    };
  };
};

/** Busca en localStorage un JSON con { usuario: { rol: { menus ... }}} */
export function loadUsuarioFromLocalStorage(): UsuarioLS | null {
  if (typeof window === 'undefined') return null;
  // Si ya sabes la llave exacta, usa esa. Si no, escanea.
  const keys = Object.keys(localStorage);
  for (const k of keys) {
    try {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.usuario?.rol?.menus) return parsed as UsuarioLS;
    } catch {
      /* ignore */
    }
  }
  return null;
}

/** { [menu]: { [submenu]: [permisosCanonicos] } } */
export function permisosByMenuFromLS(): PermisosByMenu {
  const out: PermisosByMenu = {};
  const data = loadUsuarioFromLocalStorage();
  const menus = data?.usuario?.rol?.menus ?? [];
  for (const menu of menus) {
    if (!menu?.activo) continue;
    const porSub = (out[menu.nombre] ??= {});
    for (const sub of menu.submenus ?? []) {
      if (!sub?.activo) continue;
      const set = new Set<NombrePermiso>();
      for (const p of sub.permisos ?? []) {
        if (!p?.activo) continue;
        // usamos exactamente el nombre que viene de BD/LS
        set.add(p.nombre as NombrePermiso);
      }
      porSub[sub.nombre] = Array.from(set);
    }
  }
  return out;
}
