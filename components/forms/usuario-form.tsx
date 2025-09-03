"use client"
import { CrudModal, FormField } from "@/components/ui/crud-modal"
import { useCrudOperations } from "@/hooks/use-crud-operations"
import { useAuth } from "@/contexts/auth-context"
import type { CreateUsuarioForm, UpdateUsuarioForm } from "@/types"

interface UsuarioFormProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit" | "view"
  initialData?: any
  onSuccess?: () => void
}

export function UsuarioForm({ isOpen, onClose, mode, initialData, onSuccess }: UsuarioFormProps) {
  const { createUsuario, updateUsuario, loading, error } = useCrudOperations()
  const { refreshAuth } = useAuth()

  const handleSubmit = async (formData: any) => {
    try {
      if (mode === "create") {
        const userData: CreateUsuarioForm = {
          email: formData.email,
          nombre: formData.nombre,
          telefono: formData.telefono,
          clave_pais_telefono: formData.clave_pais_telefono || "+52",
          rol_id: Number.parseInt(formData.rol_id),
          activo: formData.activo !== false,
        }
        await createUsuario(userData)
      } else {
        const userData: UpdateUsuarioForm = {
          nombre: formData.nombre,
          telefono: formData.telefono,
          clave_pais_telefono: formData.clave_pais_telefono || "+52",
          rol_id: Number.parseInt(formData.rol_id),
          activo: formData.activo !== false,
        }
        await updateUsuario(initialData?.email, userData)
      }

      // Refresh auth context to get updated data
      refreshAuth()
      onSuccess?.()
    } catch (error) {
      // Error is handled by the hook
      console.error("Error saving usuario:", error)
    }
  }

  return (
    <CrudModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Crear Usuario" : mode === "view" ? "Ver Usuario" : "Editar Usuario"}
      description={
        mode === "create"
          ? "Ingresa los datos del nuevo usuario"
          : mode === "view"
            ? "Información del usuario"
            : "Modifica los datos del usuario"
      }
      onSubmit={handleSubmit}
      loading={loading}
      mode={mode}
      initialData={initialData}
    >
      {(formData: any, updateFormData: (field: string, value: any) => void, isReadOnly: boolean) => (
        <>
          {(mode === "create" || mode === "view") && (
            <FormField
              label="Email"
              name="email"
              type="email"
              required={mode === "create"}
              value={formData.email || ""}
              onChange={updateFormData}
              placeholder="usuario@ejemplo.com"
              readOnly={isReadOnly}
            />
          )}

          <FormField
            label="Nombre Completo"
            name="nombre"
            required
            value={formData.nombre || ""}
            onChange={updateFormData}
            placeholder="Nombre completo del usuario"
            readOnly={isReadOnly}
          />

          <FormField
            label="Teléfono"
            name="telefono"
            type="tel"
            required
            value={formData.telefono || ""}
            onChange={updateFormData}
            placeholder="1234567890"
            readOnly={isReadOnly}
          />

          <FormField
            label="Código de País"
            name="clave_pais_telefono"
            value={formData.clave_pais_telefono || "+52"}
            onChange={updateFormData}
            placeholder="+52"
            readOnly={isReadOnly}
          />

          <FormField
            label="ID del Rol"
            name="rol_id"
            type="number"
            required
            value={formData.rol_id || ""}
            onChange={updateFormData}
            placeholder="1"
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
              Usuario activo
            </label>
          </div>

          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</div>}
        </>
      )}
    </CrudModal>
  )
}
