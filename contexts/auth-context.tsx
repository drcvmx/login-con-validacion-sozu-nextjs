"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Usuario, Proyecto } from "@/types"

interface AuthContextType {
  usuario: Usuario | null
  loading: boolean
  logout: () => void
  refreshAuth: () => void
  hasPermission: (permissionName: string) => boolean
  proyectos: Proyecto[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Función para cargar datos del usuario
  const loadUserData = () => {
    const userData = localStorage.getItem("userData")

    if (userData) {
      try {
        const parsedData = JSON.parse(userData)

        let userToSet = null
        // Nuevo formato: { usuario: {...} } con proyectos_acceso
        if (parsedData.usuario) {
          userToSet = parsedData.usuario
        }
        // Formato legacy: { resultado_json: { usuario: {...} } }
        else if (parsedData.resultado_json && parsedData.resultado_json.usuario) {
          userToSet = parsedData.resultado_json.usuario
        }
        // Formato directo: { email: ..., nombre: ... }
        else if (parsedData.email) {
          userToSet = parsedData
        }

        if (userToSet) {
          // Asegurar que proyectos_acceso existe como array vacío si no está presente
          if (!userToSet.proyectos_acceso) {
            userToSet.proyectos_acceso = []
          }
          // Asegurar que propiedades_disponibles existe como array vacío si no está presente
          if (!userToSet.propiedades_disponibles) {
            userToSet.propiedades_disponibles = []
          }
          setUsuario(userToSet)
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("userData")
        setUsuario(null)
      }
    } else {
      setUsuario(null)
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

  return <AuthContext.Provider value={{ usuario, loading, logout, refreshAuth, hasPermission, proyectos }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
