// src/app/(dashboard)/analytics/page.tsx
import { Suspense } from "react";
import { ActivityChart } from "@/features/analytics/components/activity-chart";
import { MetricsGrid } from "@/features/analytics/components/metrics-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { getCachedAnalyticsData } from "@/features/analytics/services/get-analytics";

export const revalidate = 300; // Revalida la caché del servidor cada 5 minutos

export default async function AnalyticsPage() {
  // Fetch de datos directo en el servidor (sin pasar por fetch internos de API de Next)
  const data = await getCachedAnalyticsData();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rendimiento Híbrido</h1>
        <p className="text-muted-foreground">
          Análisis de carga de entrenamiento cardiovascular y de fuerza.
        </p>
      </div>

      {/* Uso de Suspense para un streaming progresivo si el componente tarda en procesar */}
      <Suspense fallback={<Skeleton className="h-[120px] w-full" />}>
        <MetricsGrid initialData={data.summary} />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
            <ActivityChart chartData={data.timeSeries} />
          </Suspense>
        </div>
        {/* Aquí iría otro componente como el feed de IA o el estado de los agentes */}
      </div>
    </div>
  );
}