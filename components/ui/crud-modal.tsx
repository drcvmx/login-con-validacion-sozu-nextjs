"use client"

import type React from "react"

import { useState, useEffect, type ReactNode } from "react"
import { X } from "lucide-react"

interface CrudModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  onSubmit: (formData: any) => Promise<void>
  loading: boolean
  mode?: "create" | "view" | "edit"
  initialData?: any
  children: (formData: any, updateFormData: (field: string, value: any) => void, isReadOnly: boolean) => ReactNode
}

export function CrudModal({
  isOpen,
  onClose,
  title,
  description,
  onSubmit,
  loading,
  mode = "create",
  initialData = {},
  children,
}: CrudModalProps) {
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {})
    }
  }, [isOpen, initialData])

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "view") return // Don't submit in view mode

    await onSubmit(formData)
    setFormData({})
    onClose()
  }

  const handleClose = () => {
    setFormData({})
    onClose()
  }

  if (!isOpen) return null

  const isReadOnly = mode === "view"

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
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="text-primary-foreground/80 mt-1">{description}</p>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">{children(formData, updateFormData, isReadOnly)}</div>

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
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Guardando..." : mode === "edit" ? "Actualizar" : "Guardar"}
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
  onChange: (field: string, value: any) => void
  placeholder?: string
  readOnly?: boolean
}

export function FormField({
  label,
  name,
  type = "text",
  required = false,
  value,
  onChange,
  placeholder,
  readOnly = false,
}: FormFieldProps) {
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
        value={value || ""}
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
