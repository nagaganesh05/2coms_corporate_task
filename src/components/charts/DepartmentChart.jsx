import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import useStore from "../../store/useStore";

const COLORS = [
  "#4f46e5", // brand
  "#8b5cf6",
  "#ec4899",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
];

function DepartmentChart({ height = 280 }) {
  const data = useStore((s) => s.departmentDistribution);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          stroke="none"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "white",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            fontSize: 12,
          }}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          wrapperStyle={{ fontSize: 12 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default DepartmentChart;
