import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import useStore from "../../store/useStore";

function EngagementChart({ height = 260 }) {
  const data = useStore((s) => s.engagementMonthly);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="engagement" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            background: "white",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            fontSize: 12,
          }}
          formatter={(v) => [`${v}%`, "Engagement"]}
        />
        <Area
          type="monotone"
          dataKey="engagement"
          stroke="#4f46e5"
          strokeWidth={2.5}
          fill="url(#engagement)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default EngagementChart;
