"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { RevenueStreams } from "@/types/calculator";

interface RevenuePieProps {
  data: RevenueStreams;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#FF66C4"];

export function RevenuePie({ data }: RevenuePieProps) {
  const chartData = [
    { name: "Self-Consumption", value: data.selfConsumption },
    { name: "PRL", value: data.prl },
    { name: "SRL/aFRR", value: data.srlAfrr },
    { name: "EPEX Arbitrage", value: data.epexArbitrage },
    { name: "Peak Shaving", value: data.peakShaving },
    { name: "VPP Participation", value: data.vppParticipation },
  ].filter(item => item.value > 0);

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No revenue data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: any) => `€${Number(value).toFixed(2)}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
