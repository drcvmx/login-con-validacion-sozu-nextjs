"use client"

import { CrudModal, FormField } from "@/components/ui/crud-modal"
import { useCrudOperations } from "@/hooks/use-crud-operations"
import { useAuth } from "@/contexts/auth-context"
import type { CreateProyectoForm, UpdateProyectoForm } from "@/types"

interface ProyectoFormProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit" | "view"
  initialData?: any
  onSuccess?: () => void
}

export function ProyectoForm({ isOpen, onClose, mode, initialData, onSuccess }: ProyectoFormProps) {
  const { createProyecto, updateProyecto, loading, error } = useCrudOperations()
  const { refreshAuth } = useAuth()

  const handleSubmit = async (formData: any) => {
    try {
      if (mode === "create") {
        const projectData: CreateProyectoForm = {
          nombre: formData.nombre,
          direccion: formData.direccion,
          descripcion: formData.descripcion,
          latitud: Number.parseFloat(formData.latitud),
          longitud: Number.parseFloat(formData.longitud),
          url_logo: formData.url_logo || "",
          id_tipo_uso: Number.parseInt(formData.id_tipo_uso),
          fecha_inicio_construccion: formData.fecha_inicio_construccion,
          precio_m2_actual: Number.parseFloat(formData.precio_m2_actual),
          activo: formData.activo !== false,
        }
        await createProyecto(projectData)
      } else {
        const projectData: UpdateProyectoForm = {
          nombre: formData.nombre,
          direccion: formData.direccion,
          descripcion: formData.descripcion,
          latitud: Number.parseFloat(formData.latitud),
          longitud: Number.parseFloat(formData.longitud),
          url_logo: formData.url_logo || "",
          id_tipo_uso: Number.parseInt(formData.id_tipo_uso),
          fecha_inicio_construccion: formData.fecha_inicio_construccion,
          precio_m2_actual: Number.parseFloat(formData.precio_m2_actual),
          activo: formData.activo !== false,
        }
        await updateProyecto(initialData?.proyecto_id, projectData)
      }

      refreshAuth()
      onSuccess?.()
    } catch (error) {
      console.error("Error saving proyecto:", error)
    }
  }

  return (
    <CrudModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Crear Proyecto" : mode === "view" ? "Ver Proyecto" : "Editar Proyecto"}
      description={
        mode === "create"
          ? "Ingresa los datos del nuevo proyecto"
          : mode === "view"
            ? "Información del proyecto"
            : "Modifica los datos del proyecto"
      }
      onSubmit={handleSubmit}
      loading={loading}
      mode={mode}
      initialData={initialData}
    >
      {(formData: any, updateFormData: (field: string, value: any) => void, isReadOnly: boolean) => (
        <>
          <FormField
            label="Nombre del Proyecto"
            name="nombre"
            required
            value={formData.nombre || ""}
            onChange={updateFormData}
            placeholder="Nombre del proyecto"
            readOnly={isReadOnly}
          />

          <FormField
            label="Dirección"
            name="direccion"
            required
            value={formData.direccion || ""}
            onChange={updateFormData}
            placeholder="Dirección completa del proyecto"
            readOnly={isReadOnly}
          />

          <FormField
            label="Descripción"
            name="descripcion"
            required
            value={formData.descripcion || ""}
            onChange={updateFormData}
            placeholder="Descripción del proyecto"
            readOnly={isReadOnly}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Latitud"
              name="latitud"
              type="number"
              required
              value={formData.latitud || ""}
              onChange={updateFormData}
              placeholder="20.6597"
              readOnly={isReadOnly}
            />

            <FormField
              label="Longitud"
              name="longitud"
              type="number"
              required
              value={formData.longitud || ""}
              onChange={updateFormData}
              placeholder="-103.3496"
              readOnly={isReadOnly}
            />
          </div>

          <FormField
            label="URL del Logo"
            name="url_logo"
            type="url"
            value={formData.url_logo || ""}
            onChange={updateFormData}
            placeholder="https://ejemplo.com/logo.png"
            readOnly={isReadOnly}
          />

          <FormField
            label="ID Tipo de Uso"
            name="id_tipo_uso"
            type="number"
            required
            value={formData.id_tipo_uso || ""}
            onChange={updateFormData}
            placeholder="1"
            readOnly={isReadOnly}
          />

          <FormField
            label="Fecha de Inicio"
            name="fecha_inicio_construccion"
            type="date"
            required
            value={
              formData.fecha_inicio_construccion ||
              (formData.fecha_inicio_construccion
                ? new Date(formData.fecha_inicio_construccion).toISOString().split("T")[0]
                : "")
            }
            onChange={updateFormData}
            readOnly={isReadOnly}
          />

          <FormField
            label="Precio por m²"
            name="precio_m2_actual"
            type="number"
            required
            value={formData.precio_m2_actual || ""}
            onChange={updateFormData}
            placeholder="45000"
            readOnly={isReadOnly}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="activo"
              checked={formData.activo !== false}
              onChange={(e) => !isReadOnly && updateFormData("activo", e.target.checked)}
              disabled={isReadOnly}
              className={`rounded border-gray-300 ${isReadOnly ? "cursor-not-allowed opacity-50" : ""}`}
            />
            <label htmlFor="activo" className="text-sm font-medium">
              Proyecto activo
            </label>
          </div>

          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</div>}
        </>
      )}
    </CrudModal>
  )
}
