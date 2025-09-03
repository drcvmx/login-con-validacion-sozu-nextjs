"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Usuario, Proyecto, PropiedadBase, ModeloPropiedad } from "@/types"

interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  logout: () => void;
  refreshAuth: () => void;
  hasPermission: (permissionName: string) => boolean;
  proyectos: Proyecto[];
  todosLosUsuarios: Usuario[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const [todosLosUsuarios, setTodosLosUsuarios] = useState<Usuario[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  const loadUserData = () => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      try {
        const parsedData = JSON.parse(userData)
        let userToSet: Usuario | null = null
        let usersList: Usuario[] = []

        // Manejo de formato de respuesta
        if (Array.isArray(parsedData) && parsedData[0]?.usuario) {
          userToSet = {
            ...parsedData[0].usuario,
            propiedades_disponibles: parsedData[0].usuario.propiedades_disponibles || [],
            todas_las_propiedades: parsedData[0].usuario.todas_las_propiedades || []
          }
          usersList = parsedData[0].todos_los_usuarios || []
        } else if (parsedData.usuario) {
          userToSet = {
            ...parsedData.usuario,
            propiedades_disponibles: parsedData.usuario.propiedades_disponibles || [],
            todas_las_propiedades: parsedData.usuario.todas_las_propiedades || []
          }
          usersList = parsedData.todos_los_usuarios || []
        }

        if (userToSet) {
          // Valores por defecto para arrays
          if (!userToSet.proyectos_acceso) userToSet.proyectos_acceso = []
          if (!userToSet.propiedades_disponibles) userToSet.propiedades_disponibles = []
          if (!userToSet.todas_las_propiedades) userToSet.todas_las_propiedades = []
          
          setUsuario(userToSet)
          setTodosLosUsuarios(usersList)
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("userData")
        setUsuario(null)
        setTodosLosUsuarios([])
      }
    } else {
      setUsuario(null)
      setTodosLosUsuarios([])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!mounted) return
    loadUserData()
  }, [mounted])

  // Escuchar cambios en localStorage
  useEffect(() => {
    if (!mounted) return

    const handleStorageChange = () => {
      loadUserData()
    }

    // Escuchar eventos de storage
    window.addEventListener('storage', handleStorageChange)
    
    // También escuchar cambios manuales (para cuando se actualiza en la misma pestaña)
    const interval = setInterval(() => {
      const currentUserData = localStorage.getItem("userData")
      const hasUser = usuario !== null
      const shouldHaveUser = currentUserData !== null
      
      if (hasUser !== shouldHaveUser) {
        loadUserData()
      }
    }, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [mounted, usuario])

  const logout = () => {
    localStorage.removeItem("userData")
    setUsuario(null)
    setLoading(false)
    router.replace("/login")
  }

  const hasPermission = (permissionName: string): boolean => {
    if (!usuario) return false

    return usuario.rol.menus.some(
      (menu) =>
        menu.activo &&
        menu.submenus.some(
          (submenu) =>
            submenu.activo && submenu.permisos.some((permiso) => permiso.activo && permiso.nombre === permissionName),
        ),
    )
  }

  // Evitar renderizar hasta que el componente esté montado
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  const refreshAuth = () => {
    setLoading(true)
    loadUserData()
  }

  const proyectos = usuario?.proyectos_acceso || []

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      loading, 
      logout, 
      refreshAuth, 
      hasPermission, 
      proyectos: usuario?.proyectos_acceso || [],
      todosLosUsuarios
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
