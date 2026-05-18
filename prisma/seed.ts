// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./dev.db",
    },
  },
});
async function main() {
  console.log("🧹 Limpiando base de datos existente...");
  await prisma.workoutMetric.deleteMany({});

  console.log("🚀 Generando 35 días de métricas de rendimiento híbrido...");

  const metricsToInsert = [];
  const totalDays = 35;
  const today = new Date();

  for (let i = totalDays; i >= 0; i--) {
    // Calculamos la fecha yendo hacia atrás desde hoy
    const currentDate = new Date();
    currentDate.setDate(today.getDate() - i);
    currentDate.setHours(0, 0, 0, 0); // Limpiamos horas para evitar desfases

    const dayOfWeek = currentDate.getDay(); // 0 = Domingo, 1 = Lunes, etc.

    let runningVolume = 0;   // Kilómetros
    let strengthVolume = 0;  // Tonelaje (kg totales movidos)

    // Patrón semanal de un atleta híbrido ordenado:
    switch (dayOfWeek) {
      case 1: // Lunes: Fuerza (Empuje/Pecho) + Carrera suave de recuperación
        runningVolume = Math.round((4 + Math.random() * 2) * 10) / 10; // 4-6 km
        strengthVolume = 3200 + Math.floor(Math.random() * 600);       // ~3500 kg
        break;
      case 2: // Martes: Running estructurado (Series / Umbral)
        runningVolume = Math.round((10 + Math.random() * 4) * 10) / 10; // 10-14 km
        strengthVolume = 0; // Enfoque puro carrera
        break;
      case 3: // Miércoles: Fuerza pesada (Pierna / Cadena posterior)
        runningVolume = 0;
        strengthVolume = 4500 + Math.floor(Math.random() * 1000);      // ~5000 kg pesado
        break;
      case 4: // Jueves: Carrera regenerativa o Zona 2 base
        runningVolume = Math.round((8 + Math.random() * 3) * 10) / 10;  // 8-11 km
        strengthVolume = 0;
        break;
      case 5: // Viernes: Fuerza (Tirón/Espalda) + Core
        runningVolume = 0;
        strengthVolume = 3800 + Math.floor(Math.random() * 500);       // ~4000 kg
        break;
      case 6: // Sábado: El plato fuerte - Tirada Larga de Running (Long Run)
        runningVolume = Math.round((16 + Math.random() * 6) * 10) / 10; // 16-22 km
        strengthVolume = 0;
        break;
      case 0: // Domingo: Descanso total completo (Opcional caminata/movilidad)
        runningVolume = 0;
        strengthVolume = 0;
        break;
    }

    metricsToInsert.push({
      date: currentDate,
      runningVolume,
      strengthVolume,
    });
  }

  // Insertamos todo en bloque usando un createMany
  await prisma.workoutMetric.createMany({
    data: metricsToInsert,
  });

  console.log(`✅ ¡Éxito! Se han inyectado ${metricsToInsert.length} días de entrenamiento.`);
}

main()
  .catch((e) => {
    console.error("❌ Error ejecutando el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });