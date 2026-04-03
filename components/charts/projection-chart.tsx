"use client";

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { YearlyCashflow } from "@/types/calculator";

interface ProjectionChartProps {
  data: YearlyCashflow[];
}

export function ProjectionChart({ data }: ProjectionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No projection data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="year"
          label={{ value: "Year", position: "insideBottom", offset: -10 }}
        />
        <YAxis
          width={80}
          yAxisId="left"
          label={{ value: "Cashflow (€)", angle: -90, position: "insideLeft", offset: -10 }}
        />
        <YAxis
          width={80}
          yAxisId="right"
          orientation="right"
          label={{ value: "Cumulative (€)", angle: 90, position: "insideRight", offset: -10 }}
        />
        <Tooltip formatter={(value: any) => `€${Number(value).toFixed(2)}`} />
        <Legend wrapperStyle={{ paddingTop: "20px" }} />
        <Bar yAxisId="left" dataKey="cashflow" fill="#82ca9d" name="Annual Cashflow" radius={[4, 4, 0, 0]} />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="cumulative"
          stroke="#8884d8"
          name="Cumulative Cashflow"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
