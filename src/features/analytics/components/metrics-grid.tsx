// src/features/analytics/components/metrics-grid.tsx
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"; // O la ruta donde tengas tus tarjetas de Shadcn
import { Activity, Dumbbell, Zap } from "lucide-react";

interface MetricsGridProps {
  summary: {
    totalKm: number;
    totalKg: number;
    condition: string;
  };
}

export function MetricsGrid({ summary }: MetricsGridProps) {
  // Formateamos los kilogramos con puntos para que quede profesional (ej: 12.400 kg)
  const formattedKg = new Intl.NumberFormat("es-ES").format(summary.totalKg);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Tarjeta 1: Volumen de Carrera */}
      <Card className="bg-zinc-950 border-zinc-900 text-zinc-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">
            Volumen de Carrera
          </CardTitle>
          <Activity className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold tracking-tight">
            {summary.totalKm} km
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Carga total en el rango seleccionado
          </p>
        </CardContent>
      </Card>

      {/* Tarjeta 2: Tonelaje de Fuerza */}
      <Card className="bg-zinc-950 border-zinc-900 text-zinc-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">
            Tonelaje de Fuerza
          </CardTitle>
          <Dumbbell className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold tracking-tight">
            {formattedKg} kg
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Carga total movida
          </p>
        </CardContent>
      </Card>

      {/* Tarjeta 3: Estado del Atleta */}
      <Card className="bg-zinc-950 border-zinc-900 text-zinc-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">
            Estado del Atleta (IA)
          </CardTitle>
          <Zap className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold tracking-tight text-yellow-500">
            {summary.condition}
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Análisis de fatiga acumulada
          </p>
        </CardContent>
      </Card>
    </div>
  );
}