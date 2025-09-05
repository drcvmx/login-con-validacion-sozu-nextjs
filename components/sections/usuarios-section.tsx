"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { UsuarioForm } from "@/components/forms/usuario-form";
import { useCrudOperations } from "@/hooks/use-crud-operations";
import type { Usuario } from "@/types";
import { toast } from "sonner";
import { useConfirmDialog } from "@/components/ui/confirm-dialog"

export default function UsuariosSection() {
  const { todosLosUsuarios, hasPermission, refreshAuth } = useAuth();
  const { deleteUsuario, loading } = useCrudOperations();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);

  useEffect(() => {
    if (todosLosUsuarios) {
      setLoadingUsuarios(false);
    }
  }, [todosLosUsuarios]);

  if (!todosLosUsuarios) return null;

  const handleEdit = (user: Usuario) => {
    if (!user) return; // Validación adicional
    setSelectedUser(user);
    setShowEditForm(true);
  };

  const { showConfirm, ConfirmDialog } = useConfirmDialog()
  const handleDelete = async (id: number, email: string) => {
    showConfirm({
      title: "Eliminar Usuario",
      description: `¿Estás seguro de que deseas eliminar el usuario "${email}"? Esta acción no se puede deshacer.`,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "destructive",
      onConfirm: async () => {
        try {
          await deleteUsuario(email)
          toast.success('Usuario eliminado')
          await refreshAuth() // Agregar re-fetch después de eliminación exitosa
        } catch (error) {
          console.error('Error al eliminar usuario:', error)
          toast.error('Error al eliminar')
        }
      },
    })
  }

  const canAdd = hasPermission('Agregar');
  const canEdit = hasPermission('Actualizar');
  const canDelete = hasPermission('Eliminar');

  // Datos de ejemplo para usuarios
  // const usuarios = [
  //   {
  //     name: usuario.nombre,
  //     email: usuario.email,
  //     role: usuario.rol.nombre,
  //     status: "Activo",
  //   },
  //   {
  //     name: "María López",
  //     email: "gerente@sozu.com",
  //     role: "Gerente",
  //     status: "Activo",
  //   },
  //   {
  //     name: "Juan Torres",
  //     email: "usuario1@sozu.com",
  //     role: "Usuario",
  //     status: "Activo",
  //   },
  //   {
  //     name: "Ana García",
  //     email: "ana.garcia@sozu.com",
  //     role: "Vendedor",
  //     status: "Activo",
  //   },
  //   {
  //     name: "Carlos Mendez",
  //     email: "carlos.mendez@sozu.com",
  //     role: "Usuario",
  //     status: "Inactivo",
  //   },
  // ];

  return (
    <div className="space-y-8 animate-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Gestión de Usuarios
          </h2>
          <p className="text-muted-foreground mt-1">
            Administra los usuarios del sistema
          </p>
        </div>
        {canAdd && (
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-200 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Button>
        )}
      </div>

      <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Lista de Usuarios
          </CardTitle>
          <CardDescription>
            Administra los usuarios del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loadingUsuarios ? (
              <p className="text-center py-8">Cargando usuarios...</p>
            ) : todosLosUsuarios?.length === 0 ? ( // Usa todosLosUsuarios directamente
              <p className="text-center py-8">No hay usuarios registrados.</p>
            ) : (
              todosLosUsuarios?.map((user: Usuario, index) => ( // Usa todosLosUsuarios aquí
                <div
                  key={index}
                  className="flex items-center justify-between p-6 border border-border rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-[1.01] bg-card/80 backdrop-blur-sm animate-slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-6">
                    <Avatar className="w-14 h-14 ring-2 ring-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-bold text-lg">
                        {user.nombre?.split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">
                        {user.nombre}
                      </h3>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge
                      variant="outline"
                      className="border-primary/20 text-primary"
                    >
                      {typeof user.rol === 'string' ? user.rol : user.rol?.nombre}
                    </Badge>
                    <Badge
                      className={
                        user.activo
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gray-500 hover:bg-gray-600"
                      }
                    >
                      {user.activo ? "Activo" : "Inactivo"}
                    </Badge>
                    <div className="flex space-x-2">
                      {canEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                          disabled={!user} // Deshabilitar si no hay usuario
                          className="flex-1 bg-transparent hover:bg-secondary/10 hover:text-secondary"
                          title="Editar usuario"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(user.id, user.email)}
                          disabled={loading}
                          className="flex-1 bg-transparent hover:bg-destructive/10 hover:text-destructive"
                          title="Eliminar usuario"
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas de Usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Usuarios
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500 mb-1">
              {todosLosUsuarios?.length}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span></span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Roles Únicos
            </CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <span className="text-2xl">🎭</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-500 mb-1">
              {[...new Set(todosLosUsuarios?.map(u => 
                typeof u.rol === 'string' ? u.rol : u.rol?.nombre))].length}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modales CRUD */}
      <UsuarioForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        mode="create"
        onSuccess={() => {
          setShowCreateForm(false);
          // Aquí podrías refrescar la lista de usuarios
        }}
      />

      <UsuarioForm
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false);
          setSelectedUser(null);
        }}
        mode="edit"
        initialData={selectedUser}
        onSuccess={() => {
          setShowEditForm(false);
          setSelectedUser(null);
          // Aquí podrías refrescar la lista de usuarios
        }}
      />
      
      <ConfirmDialog />
    </div>
  );
}