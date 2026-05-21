import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", value: 20 },
  { month: "Feb", value: 40 },
  { month: "Mar", value: 70 },
  { month: "Apr", value: 90 },
];

function EngagementChart() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Engagement Analytics</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line dataKey="value" stroke="#2563eb" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EngagementChart;
