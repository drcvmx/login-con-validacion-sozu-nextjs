"use client"

import React from "react";
import { CrudModal, FormField } from "@/components/ui/crud-modal";
import { useCrudOperations } from "@/hooks/use-crud-operations";
import { useAuth } from "@/contexts/auth-context";
import type { CreateUsuarioForm, UpdateUsuarioForm } from "@/types";

interface UsuarioFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "view";
  initialData?: any;
  onSuccess?: (newUser: CreateUsuarioForm) => void;
}

export function UsuarioForm({ isOpen, onClose, mode, initialData, onSuccess }: UsuarioFormProps) {
  const { createUsuario, updateUsuario, loading, error } = useCrudOperations();
  const { refreshAuth } = useAuth();

  const roles = [
    { id: 1, nombre: "Super Administrador" },
    { id: 2, nombre: "Gerente de cobranza" },
    { id: 3, nombre: "Vendedor" },
    { id: 4, nombre: "Vendedor externo" },
    { id: 5, nombre: "Reportes" },
    { id: 6, nombre: "Administración de comisiones" },
  ];

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
        };
        await createUsuario(userData);
      } else {
        const userData: UpdateUsuarioForm = {
          nombre: formData.nombre,
          telefono: formData.telefono,
          clave_pais_telefono: formData.clave_pais_telefono || "+52",
          rol_id: Number.parseInt(formData.rol_id),
          activo: formData.activo !== false,
        };
        await updateUsuario(initialData?.email, userData);
      }

      refreshAuth();
      onSuccess?.(mode === "create" ? { email: formData.email, nombre: formData.nombre } : initialData);
    } catch (error) {
      console.error("Error saving usuario:", error);
    }
  };

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

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Rol</label>
            <select
              name="rol_id"
              value={formData.rol_id || ""}
              onChange={(e) => updateFormData("rol_id", e.target.value)}
              disabled={isReadOnly}
              className={`w-full p-2 border rounded ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
            >
              <option value="">Selecciona un rol</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</div>}
        </>
      )}
    </CrudModal>
  );
}