"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, Edit } from "lucide-react";
import type { PropiedadCompleta } from "@/types";

interface PropertyCardProps {
  propiedad: {
    propiedad_id: number;
    numero_propiedad: string;
    // ... otros campos básicos
    recamaras: number;  // Asegúrate de incluir esto
    banos_completos: number;
    medio_banos: number;
  };
  index?: number;
}

export function PropertyCard({ propiedad, index = 0 }: PropertyCardProps) {
  console.log("Datos recibidos en PropertyCard:", propiedad); // ← Añade esto
  console.log('Propiedad completa:', propiedad);
  
  return (
    <Card
      key={`${propiedad.propiedad_id}-${propiedad.numero_propiedad}-${index}`}
      className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-lg"
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{propiedad.modelo_nombre}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {propiedad.proyecto_nombre}
          </Badge>
        </div>
        <CardDescription className="text-sm line-clamp-2">
          {propiedad.descripcion}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Información del edificio */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm font-medium text-foreground mb-1">
              🏢 {propiedad.edificio_nombre}
            </p>
            <p className="text-xs text-muted-foreground">
              {propiedad.edificio_pisos?.trim() || "N/A"} pisos
            </p>
          </div>

          {/* Detalles de la propiedad */}
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-center">
              <p className="font-semibold text-primary">
                {propiedad.recamaras} {/* Usar directamente el valor ya procesado */}
              </p>
              <p className="text-xs text-muted-foreground">Recámaras</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-primary">
                {propiedad.banos_completos ?? 0} {/* Fallback a 0 */}
              </p>
              <p className="text-xs text-muted-foreground">Baños</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-primary">
                {propiedad.medio_banos ?? 0} {/* Fallback a 0 */}
              </p>
              <p className="text-xs text-muted-foreground">½ Baños</p>
            </div>
          </div>

          {/* Características */}
          {propiedad.caracteristicas && propiedad.caracteristicas.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Características:
              </p>
              <div className="flex flex-wrap gap-1">
                {propiedad.caracteristicas?.slice(0, 3).map((caracteristica, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {caracteristica}
                  </Badge>
                ))}
                {propiedad.caracteristicas.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{propiedad.caracteristicas.length - 3} más
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Multimedia */}
          {propiedad.multimedias && propiedad.multimedias.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                📷 {propiedad.multimedias.filter((m) => m.es_imagen).length} fotos
              </span>
              {propiedad.multimedias.some((m) => !m.es_imagen) && (
                <span>
                  🎥 {propiedad.multimedias.filter((m) => !m.es_imagen).length} videos
                </span>
              )}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex space-x-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              <Eye className="w-3 h-3 mr-1" />
              Ver
            </Button>
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              <Edit className="w-3 h-3 mr-1" />
              Editar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}