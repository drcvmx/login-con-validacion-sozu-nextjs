import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyTableProps {
  propiedades: Array<{
    propiedad_id: number;
    numero_propiedad: string;
    modelo_nombre: string;
    recamaras: number;
    banos_completos: number;
    m2_reales: number;
    precio_lista: number;
    proyecto_nombre: string;
  }>;
}

export function PropertyTable({ propiedades }: PropertyTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calcular propiedades paginadas
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = propiedades.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(propiedades.length / itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recámaras</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Baños</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">m²</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proyecto</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((propiedad) => (
              <tr key={propiedad.propiedad_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{propiedad.propiedad_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{propiedad.numero_propiedad}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{propiedad.modelo_nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {propiedad.recamaras}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {propiedad.banos_completos}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{propiedad.m2_reales}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${propiedad.precio_lista.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{propiedad.proyecto_nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-gray-700">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
