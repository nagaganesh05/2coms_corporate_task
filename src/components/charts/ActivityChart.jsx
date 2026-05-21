import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import useStore from "../../store/useStore";

function ActivityChart({ height = 260 }) {
  const data = useStore((s) => s.engagementMonthly).map((d) => ({
    name: d.month,
    posts: d.posts,
    recognitions: d.recognitions,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            background: "white",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            fontSize: 12,
          }}
        />
        <Bar dataKey="posts" fill="#6366f1" radius={[8, 8, 0, 0]} />
        <Bar dataKey="recognitions" fill="#f97316" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ActivityChart;
