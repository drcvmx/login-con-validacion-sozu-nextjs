"use client"

import type React from "react"

import { useState, useEffect, type ReactNode } from "react"
import { X } from "lucide-react"

// 1. Mejora la interfaz con tipos genéricos
interface CrudModalProps<T = any> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onSubmit: (formData: T) => Promise<void>;
  loading: boolean;
  mode?: "create" | "view" | "edit";
  initialData?: T | null; // Permitir null explícitamente
  children: (formData: T, updateFormData: (field: keyof T, value: any) => void, isReadOnly: boolean) => ReactNode;
}

// 2. Componente con tipos genéricos
export function CrudModal<T>({ isOpen, initialData, ...props }: CrudModalProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>({});

  // 3. Efecto para sincronizar initialData
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {});
    }
  }, [isOpen, initialData]);

  // 4. Actualización segura de campos
  const updateFormData = (field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 5. Resetear al valor inicial al cerrar
  const handleClose = () => {
    setFormData(initialData || {});
    props.onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (props.mode === "view") return // Don't submit in view mode

    await props.onSubmit(formData as T)
    setFormData({})
    props.onClose()
  }

  if (!isOpen) return null

  const isReadOnly = props.mode === "view"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-primary/10">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{props.title}</h2>
              <p className="text-primary-foreground/80 mt-1">{props.description}</p>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">{props.children(formData as T, updateFormData, isReadOnly)}</div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              {isReadOnly ? "Cerrar" : "Cancelar"}
            </button>
            {!isReadOnly && (
              <button
                type="submit"
                disabled={props.loading}
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {props.loading ? "Guardando..." : props.mode === "edit" ? "Actualizar" : "Guardar"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

interface FormFieldProps {
  label: string
  name: string
  type?: string
  required?: boolean
  value: any
  onChange?: (field: string, value: any) => void; // Hacer onChange opcional
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean; // Añadir prop disabled
}

export function FormField<T>({
  label,
  name,
  type = "text",
  required = false,
  value,
  onChange,
  placeholder,
  readOnly = false,
}: FormFieldProps & { name: keyof T }) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
        {label}
        {required && !readOnly && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required && !readOnly}
        value={value ?? ""} // Manejo seguro de null/undefined
        onChange={(e) => !readOnly && onChange(name, e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full px-4 py-3 border border-gray-200 rounded-lg transition-colors ${
          readOnly
            ? "bg-gray-50 text-gray-600 cursor-not-allowed"
            : "focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
        }`}
      />
    </div>
  )
}
