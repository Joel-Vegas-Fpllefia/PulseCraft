// src/features/analytics/components/activity-chart.tsx
"use client";

import { 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart
} from "recharts";

interface ActivityChartProps {
  chartData: Array<{
    date: string;
    runningVolume: number;
    strengthVolume: number;
  }>;
}

export function ActivityChart({ chartData }: ActivityChartProps) {
  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 space-y-4">
      <div>
        <h3 className="text-xl font-bold text-zinc-100 tracking-tight">
          Carga de Entrenamiento Cruzado
        </h3>
        <p className="text-sm text-zinc-400">
          Volumen de carrera (km) vs Tonelaje de fuerza (kg) acumulado.
        </p>
      </div>

      <div className="h-[350px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: -10, left: -10, bottom: 0 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#1f1f23" 
              vertical={true}
            />
            
            <XAxis 
              dataKey="date" 
              stroke="#71717a" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />

            {/* Eje Izquierdo: Volumen de Carrera (Línea Verde) */}
            <YAxis 
              yAxisId="left"
              stroke="#22c55e" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dx={-5}
            />

            {/* Eje Derecho: Tonelaje de Fuerza (Barras Azules) */}
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#3b82f6" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dx={5}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#09090b",
                borderColor: "#27272a",
                borderRadius: "8px",
                color: "#f4f4f5",
              }}
              labelClassName="text-zinc-400 font-medium"
            />
            
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              iconSize={8}
              // 🔥 CORRECCIÓN DE TIPADO PARA VERCEL: Cambiado 'pt' por 'paddingTop' con formato string de CSS
              wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }}
            />

            {/* Barras para el volumen del gimnasio */}
            <Bar 
              yAxisId="right"
              dataKey="strengthVolume" 
              name="Fuerza (kg)" 
              fill="#3b82f6" 
              opacity={0.15}
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />

            {/* Línea estilizada para el volumen de running */}
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="runningVolume" 
              name="Carrera (km)" 
              stroke="#22c55e" 
              strokeWidth={3}
              dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}