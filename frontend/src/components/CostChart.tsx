/**
 * Componente de gráfico de custo acumulado ao longo do tempo.
 * Utiliza Recharts para renderizar um LineChart com as 3 opções de custo,
 * com suporte a dark mode, tooltip customizado e eixo X com intervalos inteligentes.
 */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartDataPoint } from "../hooks/useChartData";
import { formatCurrency } from "../utils/format";

interface CostChartProps {
  data: ChartDataPoint[];
  tickInterval: number;
  /** Quando true, renderiza com dimensões fixas para captura de PDF (sem ResponsiveContainer). */
  staticMode?: boolean;
}

const LINES = [
  { dataKey: "aluguel", label: "Aluguel", color: "#6366f1", colorDark: "#818cf8" },
  { dataKey: "aVista", label: "Compra à Vista", color: "#f97316", colorDark: "#fb923c" },
  { dataKey: "financiamento", label: "Financiamento", color: "#14b8a6", colorDark: "#2dd4bf" },
] as const;

function isDarkMode(): boolean {
  return document.documentElement.classList.contains("dark");
}

function getLineColor(line: (typeof LINES)[number]): string {
  return isDarkMode() ? line.colorDark : line.color;
}

/** Formata valores grandes de forma compacta para o eixo Y (ex: R$ 50k). */
function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(0)}k`;
  return `R$ ${value}`;
}

/** Tooltip customizado com estilo compatível com o design system. */
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey?: string; name?: string; value?: number; color?: string }>; label?: number }) {
  if (!active || !payload?.length) return null;

  const dark = isDarkMode();

  return (
    <div
      className="rounded-lg border px-4 py-3 shadow-lg"
      style={{
        background: dark ? "#1e293b" : "#ffffff",
        borderColor: dark ? "#334155" : "#e5e7eb",
      }}
    >
      <p
        className="text-xs font-semibold mb-2"
        style={{ color: dark ? "#e2e8f0" : "#111827" }}
      >
        Mês {label}
      </p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-2 text-xs">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: entry.color }}
            />
            <span style={{ color: dark ? "#94a3b8" : "#6b7280" }}>
              {entry.name}:
            </span>
            <span
              className="font-medium ml-auto"
              style={{ color: dark ? "#e2e8f0" : "#111827" }}
            >
              {formatCurrency(entry.value as number)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CostChart({ data, tickInterval, staticMode = false }: CostChartProps) {
  if (!data.length) return null;

  const dark = isDarkMode();

  const gridColor = dark ? "#1e293b" : "#f1f5f9";
  const tickColor = dark ? "#94a3b8" : "#6b7280";
  const legendColor = dark ? "#cbd5e1" : "#374151";

  const chart = (
    <LineChart data={data} margin={{ top: 8, right: 12, left: 8, bottom: 4 }}>
      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
      <XAxis
        dataKey="month"
        interval={tickInterval - 1}
        tickFormatter={(v: number) => `${v}`}
        tick={{ fontSize: 11, fill: tickColor }}
        axisLine={{ stroke: gridColor }}
        tickLine={false}
        label={{
          value: "Meses",
          position: "insideBottomRight",
          offset: -4,
          style: { fontSize: 10, fill: tickColor },
        }}
      />
      <YAxis
        tickFormatter={formatCompactCurrency}
        tick={{ fontSize: 11, fill: tickColor }}
        axisLine={false}
        tickLine={false}
        width={68}
      />
      <Tooltip content={<ChartTooltip />} />
      <Legend
        verticalAlign="top"
        height={36}
        iconType="circle"
        iconSize={8}
        formatter={(value: string) => (
          <span style={{ color: legendColor, fontSize: "12px" }}>{value}</span>
        )}
      />
      {LINES.map((line) => (
        <Line
          key={line.dataKey}
          type="monotone"
          dataKey={line.dataKey}
          name={line.label}
          stroke={staticMode ? line.color : getLineColor(line)}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      ))}
    </LineChart>
  );

  if (staticMode) {
    return (
      <div style={{ width: 700, height: 280 }}>
        <LineChart
          data={data}
          width={700}
          height={280}
          margin={{ top: 8, right: 12, left: 8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="month"
            interval={tickInterval - 1}
            tickFormatter={(v: number) => `${v}`}
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={{ stroke: "#f1f5f9" }}
            tickLine={false}
            label={{
              value: "Meses",
              position: "insideBottomRight",
              offset: -4,
              style: { fontSize: 9, fill: "#6b7280" },
            }}
          />
          <YAxis
            tickFormatter={formatCompactCurrency}
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            width={64}
          />
          <Legend
            verticalAlign="top"
            height={32}
            iconType="circle"
            iconSize={7}
            formatter={(value: string) => (
              <span style={{ color: "#374151", fontSize: "11px" }}>{value}</span>
            )}
          />
          {LINES.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.label}
              stroke={line.color}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      {chart}
    </ResponsiveContainer>
  );
}
