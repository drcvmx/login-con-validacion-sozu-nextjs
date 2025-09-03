"use client"

import { useState } from 'react'
import { ApiService } from '@/lib/api-service'
import type { 
  CreateUsuarioForm, 
  UpdateUsuarioForm, 
  CreateProyectoForm, 
  UpdateProyectoForm,
  CreatePropiedadForm,
  UpdatePropiedadForm 
} from '@/types'

export function useCrudOperations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeOperation = async <T>(operation: () => Promise<T>): Promise<T | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await operation()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Operaciones de Usuario
  const createUsuario = async (userData: CreateUsuarioForm) => {
    return executeOperation(() => ApiService.createUsuario(userData))
  }

  const updateUsuario = async (email: string, userData: UpdateUsuarioForm) => {
    return executeOperation(() => ApiService.updateUsuario(email, userData))
  }

  const deleteUsuario = async (email: string) => {
    return executeOperation(() => ApiService.deleteUsuario(email))
  }

  // Operaciones de Proyecto
  const createProyecto = async (projectData: CreateProyectoForm) => {
    return executeOperation(() => ApiService.createProyecto(projectData))
  }

  const updateProyecto = async (id: number, projectData: UpdateProyectoForm) => {
    return executeOperation(() => ApiService.updateProyecto(id, projectData))
  }

  const deleteProyecto = async (id: number) => {
    return executeOperation(() => ApiService.deleteProyecto(id))
  }

  // Operaciones de Propiedad
  const createPropiedad = async (propertyData: CreatePropiedadForm) => {
    return executeOperation(() => ApiService.createPropiedad(propertyData))
  }

  const updatePropiedad = async (id: number, propertyData: UpdatePropiedadForm) => {
    return executeOperation(() => ApiService.updatePropiedad(id, propertyData))
  }

  const deletePropiedad = async (id: number) => {
    return executeOperation(() => ApiService.deletePropiedad(id))
  }

  const clearError = () => setError(null)

  return {
    loading,
    error,
    clearError,
    // Usuario operations
    createUsuario,
    updateUsuario,
    deleteUsuario,
    // Proyecto operations
    createProyecto,
    updateProyecto,
    deleteProyecto,
    // Propiedad operations
    createPropiedad,
    updatePropiedad,
    deletePropiedad,
  }
}