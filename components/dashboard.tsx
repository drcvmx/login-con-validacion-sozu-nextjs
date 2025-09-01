"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  BarChart3,
  Building2,
  Users,
  FileText,
  DollarSign,
  Home,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"

const menuIcons = {
  Dashboard: BarChart3,
  Usuarios: Users,
  Proyectos: Building2,
  Reportes: FileText,
  Finanzas: DollarSign,
}

export default function SozuAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeMenu, setActiveMenu] = useState("Dashboard")
  const { usuario, logout } = useAuth()

  if (!usuario) return null

  const getMenuIcon = (menuName: string) => {
    const IconComponent = menuIcons[menuName as keyof typeof menuIcons] || Home
    return IconComponent
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">SOZU</span>
          </div>
        </div>

        <nav className="mt-6 px-4">
          {usuario.rol.menus.map((menu) => {
            if (!menu.activo) return null
            const IconComponent = getMenuIcon(menu.nombre)

            return (
              <button
                key={menu.id}
                onClick={() => setActiveMenu(menu.nombre)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeMenu === menu.nombre
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-medium">{menu.nombre}</span>
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {usuario.nombre
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{usuario.nombre}</p>
              <p className="text-xs text-muted-foreground truncate">{usuario.rol.nombre}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-200 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-foreground">{activeMenu}</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Buscar..." className="pl-10 w-64" />
              </div>
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {activeMenu === "Dashboard" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">12</div>
                    <p className="text-xs text-muted-foreground">+2 este mes</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">248</div>
                    <p className="text-xs text-muted-foreground">+12% vs mes anterior</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">$45.2M</div>
                    <p className="text-xs text-muted-foreground">+8% vs mes anterior</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Reportes Generados</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">89</div>
                    <p className="text-xs text-muted-foreground">+5 esta semana</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>Proyectos Recientes</CardTitle>
                  <CardDescription>Últimos proyectos agregados al sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "DAIKU", location: "Guadalajara", status: "Activo", price: "$3,700,000" },
                      { name: "MARGOT", location: "Ciudad de México", status: "En Desarrollo", price: "$2,850,000" },
                      { name: "GIGAPARK", location: "Monterrey", status: "Activo", price: "$4,200,000" },
                    ].map((project, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{project.name}</h3>
                            <p className="text-sm text-muted-foreground">{project.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant={project.status === "Activo" ? "default" : "secondary"}>
                            {project.status}
                          </Badge>
                          <span className="font-semibold text-primary">{project.price}</span>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeMenu === "Usuarios" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground">Gestión de Usuarios</h2>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Usuario
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Lista de Usuarios</CardTitle>
                  <CardDescription>Administra los usuarios del sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Carlos Pérez", email: "admin@sozu.com", role: "Administrador", status: "Activo" },
                      { name: "María López", email: "gerente@sozu.com", role: "Gerente", status: "Activo" },
                      { name: "Juan Torres", email: "usuario1@sozu.com", role: "Usuario", status: "Activo" },
                    ].map((user, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-foreground">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline">{user.role}</Badge>
                          <Badge variant="default">{user.status}</Badge>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeMenu === "Proyectos" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground">Gestión de Proyectos</h2>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Proyecto
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: "DAIKU",
                    location: "Av. Miguel Hidalgo y Costilla 1910, Arcos Vallarta, Guadalajara",
                    price: "Desde $3,700,000 MXN",
                    units: "1-3 habitaciones",
                    baths: "1-3.5 baños",
                    area: "122-78 m²",
                    status: "Activo",
                  },
                  {
                    name: "MARGOT",
                    location: "Ciudad de México",
                    price: "Desde $2,850,000 MXN",
                    units: "2-4 habitaciones",
                    baths: "2-3 baños",
                    area: "95-150 m²",
                    status: "En Desarrollo",
                  },
                  {
                    name: "GIGAPARK",
                    location: "Monterrey",
                    price: "Desde $4,200,000 MXN",
                    units: "1-2 habitaciones",
                    baths: "1-2 baños",
                    area: "80-120 m²",
                    status: "Activo",
                  },
                ].map((project, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <Badge variant={project.status === "Activo" ? "default" : "secondary"}>{project.status}</Badge>
                      </div>
                      <CardDescription className="text-sm">{project.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <p className="text-lg font-semibold text-primary">{project.price}</p>
                        <div className="grid grid-cols-1 gap-1 text-sm text-muted-foreground">
                          <span>🏠 {project.units}</span>
                          <span>🚿 {project.baths}</span>
                          <span>📐 {project.area}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {(activeMenu === "Reportes" || activeMenu === "Finanzas") && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">
                {activeMenu === "Reportes" ? "Reportes del Sistema" : "Reportes Financieros"}
              </h2>

              <Card>
                <CardHeader>
                  <CardTitle>{activeMenu === "Reportes" ? "Reportes Disponibles" : "Análisis Financiero"}</CardTitle>
                  <CardDescription>
                    {activeMenu === "Reportes"
                      ? "Genera y descarga reportes del sistema"
                      : "Visualiza el rendimiento financiero de los proyectos"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {activeMenu === "Reportes" ? "Reportes" : "Finanzas"}
                    </h3>
                    <p className="text-muted-foreground mb-4">Esta sección estará disponible próximamente</p>
                    <Button variant="outline">Configurar {activeMenu}</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
