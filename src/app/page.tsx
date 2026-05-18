// src/app/page.tsx
import { getCachedAnalyticsData, getTodayMetric } from "@/features/analytics/services/get-analytics";
import { AnalyticsFilter } from "@/features/analytics/components/analytics-filter";
import { MetricsGrid } from "@/features/analytics/components/metrics-grid";
import { ActivityChart } from "@/features/analytics/components/activity-chart";
import { QuickLog } from "@/features/analytics/components/quick-log";

interface PageProps {
  searchParams: Promise<{ range?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const rangeParam = params.range || "7d";
  const days = rangeParam === "30d" ? 30 : 7;

  // Consultas paralelas directas a SQLite
  const data = await getCachedAnalyticsData(days);
  const todayData = await getTodayMetric();

  return (
    <main className="min-h-screen bg-black text-white p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-900 pb-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100">PulseCraft Dashboard</h1>
          <p className="text-zinc-400 mt-1">Métricas de rendimiento para atletas híbridos.</p>
        </div>
        <div className="flex items-center self-start md:self-auto">
          <AnalyticsFilter />
        </div>
      </div>

      {/* Grid de Tarjetas */}
      <MetricsGrid summary={data.summary} />
      
      {/* Gráfico de Carga Cruzada */}
      <ActivityChart chartData={data.timeSeries} />

      {/* Nueva Sección: Registro e info del día de hoy */}
      <QuickLog todayData={todayData} />

    </main>
  );
}