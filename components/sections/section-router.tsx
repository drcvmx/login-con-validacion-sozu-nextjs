"use client";

import DashboardSection from "./dashboard-section";
import UsuariosSection from "./usuarios-section";
import EntidadesSection from "./entidades-section";
import ProyectosSection from "./proyectos-section";
import PropiedadesSection from "./propiedades-section";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, DollarSign } from "lucide-react";

interface SectionRouterProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export default function SectionRouter({ activeMenu, setActiveMenu }: SectionRouterProps) {
  // Secciones principales con componentes dedicados
  if (activeMenu === "Dashboard") {
    return <DashboardSection setActiveMenu={setActiveMenu} />;
  }

  if (activeMenu === "Usuarios") {
    return <UsuariosSection />;
  }

  if (activeMenu === "Entidades") {
    return <EntidadesSection />;
  }

  if (activeMenu === "Proyectos" || activeMenu === "Propiedades") {
    // Si es "Propiedades" del backend, mostrar la sección de propiedades
    if (activeMenu === "Propiedades") {
      return <PropiedadesSection />;
    }
    // Si es "Proyectos" genérico, mostrar la sección de proyectos
    return <ProyectosSection />;
  }

  // Secciones genéricas para otros menús
  if (activeMenu === "Productos/Servicios") {
    return (
      <div className="space-y-8 animate-slide-in">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Productos y Servicios</h2>
            <p className="text-muted-foreground mt-1">
              Gestiona los productos y servicios disponibles
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-200 text-primary-foreground">
            Nuevo Producto/Servicio
          </Button>
        </div>

        <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Administración de Productos/Servicios</CardTitle>
            <CardDescription>Gestiona los productos y servicios disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Productos y Servicios</h3>
              <p className="text-muted-foreground mb-4">Gestiona tu catálogo de productos y servicios</p>
              <Button variant="outline" className="hover:bg-primary/10 hover:text-primary hover:border-primary bg-transparent">
                Configurar Catálogo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeMenu === "Cuentas de cobranza") {
    return (
      <div className="space-y-8 animate-slide-in">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Cuentas de Cobranza</h2>
            <p className="text-muted-foreground mt-1">
              Gestiona las cuentas de cobranza y reportes financieros
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-200 text-primary-foreground">
            Nueva Cuenta
          </Button>
        </div>

        <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Administración de Cuentas de Cobranza</CardTitle>
            <CardDescription>Gestiona las cuentas de cobranza y reportes financieros</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Cuentas de Cobranza</h3>
              <p className="text-muted-foreground mb-4">Administra las cuentas de cobranza del sistema</p>
              <Button variant="outline" className="hover:bg-primary/10 hover:text-primary hover:border-primary bg-transparent">
                Ver Cuentas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeMenu === "Comisiones") {
    return (
      <div className="space-y-8 animate-slide-in">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Comisiones</h2>
            <p className="text-muted-foreground mt-1">
              Gestiona las comisiones y reportes de ventas
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-200 text-primary-foreground">
            Nueva Comisión
          </Button>
        </div>

        <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Administración de Comisiones</CardTitle>
            <CardDescription>Gestiona las comisiones y reportes de ventas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Comisiones</h3>
              <p className="text-muted-foreground mb-4">Administra las comisiones de ventas</p>
              <Button variant="outline" className="hover:bg-primary/10 hover:text-primary hover:border-primary bg-transparent">
                Ver Comisiones
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Secciones genéricas para Reportes y Finanzas
  if (activeMenu === "Reportes" || activeMenu === "Finanzas") {
    return (
      <div className="space-y-8 animate-slide-in">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {activeMenu === "Reportes" ? "Reportes del Sistema" : "Reportes Financieros"}
            </h2>
            <p className="text-muted-foreground mt-1">
              {activeMenu === "Reportes"
                ? "Genera y descarga reportes del sistema"
                : "Visualiza el rendimiento financiero de los proyectos"}
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              {activeMenu === "Reportes" ? "Reportes Disponibles" : "Análisis Financiero"}
            </CardTitle>
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
              <Button variant="outline" className="hover:bg-primary/10 hover:text-primary hover:border-primary bg-transparent">
                Configurar {activeMenu}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback para secciones no definidas
  return (
    <div className="space-y-8 animate-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{activeMenu}</h2>
          <p className="text-muted-foreground mt-1">
            Sección en desarrollo
          </p>
        </div>
      </div>

      <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">{activeMenu}</CardTitle>
          <CardDescription>Esta sección estará disponible próximamente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">{activeMenu}</h3>
            <p className="text-muted-foreground mb-4">Funcionalidad en desarrollo</p>
            <Button variant="outline" className="hover:bg-primary/10 hover:text-primary hover:border-primary bg-transparent">
              Próximamente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}