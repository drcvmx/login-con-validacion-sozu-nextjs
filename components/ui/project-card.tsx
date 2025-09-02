"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Eye, Edit } from "lucide-react";
import type { Proyecto } from "@/types";

interface ProjectCardProps {
  project: Proyecto;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <div
      className="flex items-center justify-between p-6 border border-border rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-[1.01] bg-card/80 backdrop-blur-sm"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center space-x-6">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
          <Building2 className="w-8 h-8 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground mb-1">
            {project.nombre}
          </h3>
          <p className="text-muted-foreground mb-2">
            {project.direccion}
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              🏢 {project.tipo_uso}
            </span>
            <span className="flex items-center">
              🏗️ {project.edificios_count} edificios
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="text-right">
          <Badge
            variant={project.activo ? "default" : "secondary"}
            className={project.activo ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {project.activo ? "Activo" : "Inactivo"}
          </Badge>
          <p className="font-bold text-xl text-primary mt-2">
            ${project.precio_m2_actual.toLocaleString()}/m²
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/10 hover:text-primary"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-secondary/10 hover:text-secondary"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}