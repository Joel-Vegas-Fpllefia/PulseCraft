// src/features/analytics/services/get-analytics.ts
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

// 1. Obtener analíticas del rango seleccionado
export async function getCachedAnalyticsData(days: number = 7) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    cutoffDate.setHours(0, 0, 0, 0);

    // Intenta leer de la base de datos (Funciona en local)
    const metrics = await prisma.workoutMetric.findMany({
      where: {
        date: {
          gte: cutoffDate,
        },
      },
      orderBy: { date: "asc" },
    });

    if (metrics.length > 0) {
      return {
        summary: {
          totalKm: Number(metrics.reduce((acc, m) => acc + m.runningVolume, 0).toFixed(1)),
          totalKg: metrics.reduce((acc, m) => acc + m.strengthVolume, 0),
          condition: metrics.length > 15 ? "Carga Alta" : "Óptimo",
        },
        timeSeries: metrics.map(m => ({
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
  } catch (error) {
    // Captura el Error 14 en Vercel y evita que la web muera escupiendo un 500
    console.warn("Aviso: SQLite no está accesible en este entorno. Cargando Mock Data de seguridad.");
  }

  // 🔴 PLAN B AUTOMÁTICO: Si la base de datos falla (Vercel), genera datos dinámicos simulados al vuelo
  return {
    summary: { totalKm: 42.5, totalKg: 11400, condition: "Óptimo (Demo)" },
    timeSeries: Array.from({ length: days }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - i - 1));
      return {
        date: d.toLocaleDateString("es-ES", { 
          weekday: days <= 7 ? "short" : undefined,
          day: days > 7 ? "numeric" : undefined,
          month: days > 7 ? "short" : undefined,
        }),
        // Genera picos aleatorios realistas para que el gráfico luzca espectacular en la demo
        runningVolume: Math.random() > 0.3 ? Number((Math.random() * 12 + 3).toFixed(1)) : 0,
        strengthVolume: Math.random() > 0.4 ? Math.floor(Math.random() * 3500) + 1200 : 0,
      };
    }),
  };
}

// 2. Obtener el entrenamiento del día actual
export async function getTodayMetric() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const metric = await prisma.workoutMetric.findFirst({
      where: { date: today }
    });

    return metric || { runningVolume: 0, strengthVolume: 0 };
  } catch (error) {
    // Si falla en Vercel, devuelve valores a cero de forma segura
    return { runningVolume: 0, strengthVolume: 0 };
  }
}

// 3. Server Action para registrar un entrenamiento
export async function registerTodayWorkout(formData: FormData) {
  "use server";

  const runningVolume = parseFloat(formData.get("running") as string) || 0;
  const strengthVolume = parseInt(formData.get("strength") as string, 10) || 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    await prisma.workoutMetric.upsert({
      where: { date: today },
      update: { runningVolume, strengthVolume },
      create: { date: today, runningVolume, strengthVolume },
    });
    
    revalidatePath("/");
  } catch (error) {
    console.error("No se pudo escribir en la base de datos SQLite en este entorno.");
  }
}