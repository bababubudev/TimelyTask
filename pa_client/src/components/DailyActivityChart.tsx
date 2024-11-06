import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface DailyActivityChartProps {
  data: { date: string; activeTime: string }[];
}

function DailyActivityChart({ data }: DailyActivityChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" label={{ value: "Date", position: "insideBottomRight", offset: -5 }} />
        <YAxis label={{ value: "Active Time (minutes)", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Bar dataKey="activeTime" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default DailyActivityChart;