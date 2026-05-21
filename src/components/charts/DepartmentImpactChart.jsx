import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import useStore from "../../store/useStore";

const COLORS = [
  "#4f46e5",
  "#8b5cf6",
  "#ec4899",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#a855f7",
];

function DepartmentImpactChart({ height = 280 }) {
  const data = useStore((s) => s.getDepartmentImpact())
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 20, left: 30, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
        <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          dataKey="name"
          type="category"
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={110}
        />
        <Tooltip
          contentStyle={{
            background: "white",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            fontSize: 12,
          }}
          formatter={(v) => [`${v} updates`, "Impact"]}
        />
        <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={18}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default DepartmentImpactChart;
