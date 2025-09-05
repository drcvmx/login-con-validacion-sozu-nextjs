import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, X, Search } from "lucide-react";

export interface PropertyFilters {
  id?: string;
  numero?: string;
  modelo?: string;
  recamaras?: { min?: number; max?: number };
  banos?: { min?: number; max?: number };
  m2?: { min?: number; max?: number };
  precio?: { min?: number; max?: number };
  proyecto?: string;
}

interface PropertyFiltersProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  proyectos: string[];
  modelos: string[];
}

export function PropertyFiltersComponent({ 
  filters, 
  onFiltersChange, 
  proyectos, 
  modelos 
}: PropertyFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const updateRangeFilter = (key: 'recamaras' | 'banos' | 'm2' | 'precio', type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    const currentRange = filters[key] || {};
    updateFilter(key, { ...currentRange, [type]: numValue });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof PropertyFilters];
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== undefined && v !== '');
    }
    return value !== undefined && value !== '';
  });

  return (
    <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Filtros de Propiedades
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4 mr-1" />
                Limpiar
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20"
            >
              {isExpanded ? 'Ocultar' : 'Mostrar'} Filtros
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Filtros básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filter-id" className="text-sm font-medium text-foreground">
                ID Propiedad
              </Label>
              <Input
                id="filter-id"
                placeholder="Buscar por ID..."
                value={filters.id || ''}
                onChange={(e) => updateFilter('id', e.target.value)}
                className="border-border/50 focus:border-primary focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="filter-numero" className="text-sm font-medium text-foreground">
                Número
              </Label>
              <Input
                id="filter-numero"
                placeholder="Buscar por número..."
                value={filters.numero || ''}
                onChange={(e) => updateFilter('numero', e.target.value)}
                className="border-border/50 focus:border-primary focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="filter-modelo" className="text-sm font-medium text-foreground">
                Modelo
              </Label>
              <select
                id="filter-modelo"
                value={filters.modelo || ''}
                onChange={(e) => updateFilter('modelo', e.target.value)}
                className="w-full px-3 py-2 border border-border/50 rounded-md bg-background text-foreground focus:border-primary focus:ring-primary/20 focus:outline-none"
              >
                <option value="">Todos los modelos</option>
                {modelos.map(modelo => (
                  <option key={modelo} value={modelo}>{modelo}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="filter-proyecto" className="text-sm font-medium text-foreground">
                Proyecto
              </Label>
              <select
                id="filter-proyecto"
                value={filters.proyecto || ''}
                onChange={(e) => updateFilter('proyecto', e.target.value)}
                className="w-full px-3 py-2 border border-border/50 rounded-md bg-background text-foreground focus:border-primary focus:ring-primary/20 focus:outline-none"
              >
                <option value="">Todos los proyectos</option>
                {proyectos.map(proyecto => (
                  <option key={proyecto} value={proyecto}>{proyecto}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Filtros de rango */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Recámaras */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Recámaras</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.recamaras?.min || ''}
                  onChange={(e) => updateRangeFilter('recamaras', 'min', e.target.value)}
                  className="border-border/50 focus:border-secondary focus:ring-secondary/20"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.recamaras?.max || ''}
                  onChange={(e) => updateRangeFilter('recamaras', 'max', e.target.value)}
                  className="border-border/50 focus:border-secondary focus:ring-secondary/20"
                />
              </div>
            </div>
            
            {/* Baños */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Baños</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.banos?.min || ''}
                  onChange={(e) => updateRangeFilter('banos', 'min', e.target.value)}
                  className="border-border/50 focus:border-secondary focus:ring-secondary/20"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.banos?.max || ''}
                  onChange={(e) => updateRangeFilter('banos', 'max', e.target.value)}
                  className="border-border/50 focus:border-secondary focus:ring-secondary/20"
                />
              </div>
            </div>
            
            {/* m² */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">m²</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.m2?.min || ''}
                  onChange={(e) => updateRangeFilter('m2', 'min', e.target.value)}
                  className="border-border/50 focus:border-accent focus:ring-accent/20"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.m2?.max || ''}
                  onChange={(e) => updateRangeFilter('m2', 'max', e.target.value)}
                  className="border-border/50 focus:border-accent focus:ring-accent/20"
                />
              </div>
            </div>
            
            {/* Precio */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Precio ($)</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.precio?.min || ''}
                  onChange={(e) => updateRangeFilter('precio', 'min', e.target.value)}
                  className="border-border/50 focus:border-chart-1 focus:ring-chart-1/20"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.precio?.max || ''}
                  onChange={(e) => updateRangeFilter('precio', 'max', e.target.value)}
                  className="border-border/50 focus:border-chart-1 focus:ring-chart-1/20"
                />
              </div>
            </div>
          </div>
          
          {/* Indicador de filtros activos */}
          {hasActiveFilters && (
            <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-primary font-medium">
                <Search className="w-4 h-4 inline mr-1" />
                Filtros activos aplicados
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}