import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  {
    name: "Engineering",
    value: 45,
  },
  {
    name: "HR",
    value: 15,
  },
  {
    name: "Marketing",
    value: 20,
  },
  {
    name: "Sales",
    value: 20,
  },
];

const COLORS = ["#2563eb", "#7c3aed", "#14b8a6", "#f97316"];

function DepartmentChart() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Department Distribution</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={100} label>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DepartmentChart;
