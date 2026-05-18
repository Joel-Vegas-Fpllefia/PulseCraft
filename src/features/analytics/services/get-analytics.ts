import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache"; // <-- 🔥 CORRECCIÓN: Añade esta línea
// Forzamos a Next.js a traer datos frescos de la BD en cada petición sin cachear
export const revalidate = 0;

export async function getCachedAnalyticsData(days: number = 7) {
  // Calculamos la fecha de corte restando los días al día de hoy
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  cutoffDate.setHours(0, 0, 0, 0);

  // Traemos las métricas de SQLite
  const metrics = await prisma.workoutMetric.findMany({
    where: {
      date: {
        gte: cutoffDate,
      },
    },
    orderBy: { date: "asc" },
  });

  // Si la BD estuviera vacía (Plan B de seguridad)
  if (metrics.length === 0) {
    return {
      summary: { totalKm: 0, totalKg: 0, condition: "Sin Datos" },
      timeSeries: [],
    };
  }

  // Si hay datos reales (como tu seed de 35 días)
  return {
    summary: {
      totalKm: Number(metrics.reduce((acc, m) => acc + m.runningVolume, 0).toFixed(1)),
      totalKg: metrics.reduce((acc, m) => acc + m.strengthVolume, 0),
      condition: metrics.length > 15 ? "Carga Alta" : "Óptimo",
    },
    timeSeries: metrics.map(m => ({
      // Si filtramos por 7 días ponemos "Lun", "Mar"... si son 30 días ponemos la fecha "18 may"
      date: m.date.toLocaleDateString("es-ES", { 
        weekday: days <= 7 ? "short" : undefined,
        day: days > 7 ? "numeric" : undefined,
        month: days > 7 ? "short" : undefined,
      }),
      runningVolume: m.runningVolume,
      strengthVolume: m.strengthVolume,
    })),
  };
}

// Añade estos imports arriba si no están:
// import { revalidatePath } from "next-cache";

export async function getTodayMetric() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const metric = await prisma.workoutMetric.findFirst({
    where: {
      date: today
    }
  });

  return metric || { runningVolume: 0, strengthVolume: 0 };
}

// ⚡ Server Action para registrar el entrenamiento
export async function registerTodayWorkout(formData: FormData) {
  "use server";

  const runningVolume = parseFloat(formData.get("running") as string) || 0;
  const strengthVolume = parseInt(formData.get("strength") as string, 10) || 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Usamos upsert: si ya existe el día de hoy, lo actualiza (acumula o machaca); si no, lo crea.
  await prisma.workoutMetric.upsert({
    where: {
      date: today,
    },
    update: {
      runningVolume: runningVolume,
      strengthVolume: strengthVolume,
    },
    create: {
      date: today,
      runningVolume: runningVolume,
      strengthVolume: strengthVolume,
    },
  });

  // Rompemos la caché de la página actual para que el gráfico y las tarjetas se actualicen al vuelo
  revalidatePath("/");
}