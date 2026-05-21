import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import useStore from "../../store/useStore";

function RecognitionTrendChart({ height = 260 }) {
  const data = useStore((s) => s.engagementMonthly);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="posts"
          name="Posts"
          stroke="#6366f1"
          strokeWidth={2.5}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="recognitions"
          name="Recognitions"
          stroke="#f97316"
          strokeWidth={2.5}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default RecognitionTrendChart;
