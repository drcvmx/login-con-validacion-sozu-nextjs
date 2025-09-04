"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog"
import { Button } from "./button"
import { AlertTriangle, Trash2 } from "lucide-react"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
  onConfirm: () => void
  onCancel?: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "destructive",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {variant === "destructive" ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Trash2 className="h-5 w-5 text-primary" />
              </div>
            )}
            <div className="flex-1">
              <DialogTitle className="text-left">{title}</DialogTitle>
            </div>
          </div>
        </DialogHeader>
        <DialogDescription className="text-left py-4">
          {description}
        </DialogDescription>
        <DialogFooter className="flex-row justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="min-w-[80px]"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            className="min-w-[80px]"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Hook personalizado para usar el modal de confirmación
export function useConfirmDialog() {
  const [dialogState, setDialogState] = React.useState<{
    open: boolean
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: "default" | "destructive"
    onConfirm: () => void
    onCancel?: () => void
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  })

  const showConfirm = React.useCallback(
    (options: {
      title: string
      description: string
      confirmText?: string
      cancelText?: string
      variant?: "default" | "destructive"
      onConfirm: () => void
      onCancel?: () => void
    }) => {
      setDialogState({
        ...options,
        open: true,
      })
    },
    []
  )

  const hideConfirm = React.useCallback(() => {
    setDialogState((prev) => ({ ...prev, open: false }))
  }, [])

  const ConfirmDialogComponent = React.useCallback(
    () => (
      <ConfirmDialog
        {...dialogState}
        onOpenChange={hideConfirm}
      />
    ),
    [dialogState, hideConfirm]
  )

  return {
    showConfirm,
    hideConfirm,
    ConfirmDialog: ConfirmDialogComponent,
  }
}