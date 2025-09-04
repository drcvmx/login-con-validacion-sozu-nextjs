"use client"

import React from "react";
import { CrudModal, FormField } from "@/components/ui/crud-modal";
import { useCrudOperations } from "@/hooks/use-crud-operations";
import { useAuth } from "@/contexts/auth-context";
import type { CreateProyectoForm, UpdateProyectoForm } from "@/types";

interface ProyectoFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "view";
  initialData?: any;
  onSuccess?: () => void;
}

export function ProyectoForm({ isOpen, onClose, mode, initialData, onSuccess }: ProyectoFormProps) {
  const { createProyecto, updateProyecto, loading, error } = useCrudOperations();
  const { refreshAuth } = useAuth();

  const tiposUso = [
    { id: 1, nombre: "Residencial" },
    { id: 2, nombre: "Comercial" },
    { id: 3, nombre: "Mixto" },
    { id: 4, nombre: "Industrial" },
    { id: 5, nombre: "Turístico" },
    { id: 6, nombre: "Oficinas" },
    { id: 7, nombre: "Retail" },
    { id: 8, nombre: "Hotelero" },
  ];

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
          fecha_inicio_construccion: formData.fecha_inicio_construccion || new Date().toISOString().split('T')[0], // Fecha actual si no se especifica
          precio_m2_actual: Number.parseFloat(formData.precio_m2_actual),
          activo: formData.activo !== false,
        };
        await createProyecto(projectData);
      } else {
        const projectData: UpdateProyectoForm = {
          nombre: formData.nombre,
          direccion: formData.direccion,
          descripcion: formData.descripcion,
          latitud: Number.parseFloat(formData.latitud),
          longitud: Number.parseFloat(formData.longitud),
          url_logo: formData.url_logo || "",
          id_tipo_uso: Number.parseInt(formData.id_tipo_uso),
          fecha_inicio_construccion: initialData?.fecha_inicio_construccion, // Mantener la fecha original
          precio_m2_actual: Number.parseFloat(formData.precio_m2_actual),
          activo: formData.activo !== false,
        };
        await updateProyecto(initialData?.proyecto_id, projectData);
      }

      refreshAuth();
      onSuccess?.();
    } catch (error) {
      console.error("Error saving proyecto:", error);
    }
  };

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

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tipo de Uso</label>
            <select
              name="id_tipo_uso"
              value={formData.id_tipo_uso || ""}
              onChange={(e) => updateFormData("id_tipo_uso", e.target.value)}
              disabled={isReadOnly}
              className={`w-full p-2 border rounded ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
            >
              <option value="">Selecciona un tipo de uso</option>
              {tiposUso.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>

          <FormField
            label="Fecha de Inicio"
            name="fecha_inicio_construccion"
            type="date"
            required
            value={
              mode === "create" 
                  ? formData.fecha_inicio_construccion || new Date().toISOString().split('T')[0]
                  : initialData?.fecha_inicio_construccion?.split('T')[0] || ""
            }
            onChange={mode === "create" ? updateFormData : undefined}
            readOnly={mode !== "create"}
            disabled={mode !== "create"}
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

          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</div>}
        </>
      )}
    </CrudModal>
  );
}