import { registerTodayWorkout } from "../services/get-analytics";

interface QuickLogProps {
  todayData: {
    runningVolume: number;
    strengthVolume: number;
  };
}

export function QuickLog({ todayData }: QuickLogProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Estado de Hoy */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-zinc-100 tracking-tight">Entrenamiento de Hoy</h3>
          <p className="text-sm text-zinc-400">Lo que llevas acumulado en las últimas 24 horas.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/60">
            <span className="text-xs text-zinc-500 block font-medium uppercase">Carrera</span>
            <span className="text-2xl font-extrabold text-green-500">{todayData.runningVolume} km</span>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/60">
            <span className="text-xs text-zinc-500 block font-medium uppercase">Fuerza</span>
            <span className="text-2xl font-extrabold text-blue-500">
              {new Intl.NumberFormat("es-ES").format(todayData.strengthVolume)} kg
            </span>
          </div>
        </div>
        <p className="text-xs text-zinc-600">Se sincroniza automáticamente con el gráfico general.</p>
      </div>

      {/* Formulario con Server Action */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6">
        <h3 className="text-lg font-bold text-zinc-100 tracking-tight mb-1">Registrar Sesión</h3>
        <p className="text-sm text-zinc-400 mb-4">Introduce los volúmenes de tu entrenamiento híbrido.</p>
        
        <form action={registerTodayWorkout} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="running" className="text-xs font-semibold text-zinc-400">Distancia (km)</label>
              <input
                id="running"
                name="running"
                type="number"
                step="0.1"
                placeholder="ej: 10.5"
                defaultValue={todayData.runningVolume || ""}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-green-500 placeholder:text-zinc-650"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="strength" className="text-xs font-semibold text-zinc-400">Tonelaje Total (kg)</label>
              <input
                id="strength"
                name="strength"
                type="number"
                placeholder="ej: 3400"
                defaultValue={todayData.strengthVolume || ""}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 placeholder:text-zinc-650"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold text-sm py-2.5 px-4 rounded-lg transition-colors mt-2"
          >
            Guardar Entrenamiento
          </button>
        </form>
      </div>
    </div>
  );
}