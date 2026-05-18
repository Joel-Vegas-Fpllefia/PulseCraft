"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function AnalyticsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Si no hay rango en la URL, por defecto marcamos los 7 días
  const currentRange = searchParams.get("range") || "7d";

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    // Empujamos el parámetro a la URL (?range=30d) de forma limpia
    router.push(`/?range=${value}`);
  };

  return (
    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-sm text-zinc-300">
      <label htmlFor="range-select" className="text-zinc-500 font-medium">Rango:</label>
      <select
        id="range-select"
        value={currentRange}
        onChange={handleRangeChange}
        className="bg-transparent border-none text-zinc-200 outline-none cursor-pointer font-medium pr-1"
      >
        <option value="7d" className="bg-zinc-900 text-zinc-200">Últimos 7 días</option>
        <option value="30d" className="bg-zinc-900 text-zinc-200">Últimos 30 días</option>
      </select>
    </div>
  );
}