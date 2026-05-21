import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  {
    name: "Mon",
    activity: 40,
  },
  {
    name: "Tue",
    activity: 65,
  },
  {
    name: "Wed",
    activity: 85,
  },
  {
    name: "Thu",
    activity: 55,
  },
  {
    name: "Fri",
    activity: 95,
  },
];

function ActivityChart() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Weekly Activity</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />

          <Bar dataKey="activity" fill="#2563eb" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ActivityChart;
