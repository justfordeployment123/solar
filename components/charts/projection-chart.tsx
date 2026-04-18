"use client";

import ReactECharts from 'echarts-for-react';
import { YearlyCashflow } from "@/types/calculator";
import { useMemo } from 'react';
import { graphic } from 'echarts';

interface ProjectionChartProps {
  data: YearlyCashflow[];
}

export function ProjectionChart({ data }: ProjectionChartProps) {
  const option = useMemo(() => {
    if (!data || data.length === 0) return {};

    const years = data.map(d => `Year ${d.year}`);
    const cashflows = data.map(d => d.cashflow);
    const cumulatives = data.map(d => d.cumulative);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross', label: { backgroundColor: '#565656' } },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#dfdfdf',
        textStyle: { color: '#363636' },
        borderRadius: 16,
        padding: [16, 20],
        extraCssText: 'box-: 0 8px 32px rgba(0,0,0,0.08); backdrop-filter: blur(12px);',
        formatter: function (params: any) {
          let str = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].name}</div>`;
          params.forEach((param: any) => {
            str += `
              <div style="display: flex; justify-content: space-between; gap: 24px; margin-bottom: 4px;">
                <span style="color: #565656;">
                  <span style="display:inline-block;margin-right:4px;border-radius:50%;width:10px;height:10px;background-color:${param.color};"></span>
                  ${param.seriesName}
                </span>
                <span style="font-weight: 600;">€${param.value.toFixed(2)}</span>
              </div>
            `;
          });
          return str;
        }
      },
      legend: {
        data: ['Annual Cashflow', 'Cumulative Cashflow'],
        bottom: 0,
        textStyle: { color: '#565656', fontFamily: 'var(--font-opensans)' },
        itemGap: 24
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%',
        top: '8%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: years,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#565656', margin: 16, fontFamily: 'var(--font-opensans)' }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Annual (€)',
          position: 'left',
          splitLine: { lineStyle: { type: 'dashed', color: '#dfdfdf' } },
          axisLabel: { color: '#565656', formatter: '€{value}' }
        },
        {
          type: 'value',
          name: 'Cumulative (€)',
          position: 'right',
          splitLine: { show: false },
          axisLabel: { color: '#565656', formatter: '€{value}' }
        }
      ],
      series: [
        {
          name: 'Annual Cashflow',
          type: 'bar',
          data: cashflows,
          itemStyle: {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#dfdfdf' }, // Apple Green
              { offset: 1, color: '#dfdfdf44' }
            ]),
            borderRadius: [6, 6, 0, 0]
          },
          barMaxWidth: 30,
          animationEasing: 'elasticOut',
          animationDelay: function (idx: number) { return idx * 100; }
        },
        {
          name: 'Cumulative Cashflow',
          type: 'line',
          yAxisIndex: 1,
          data: cumulatives,
          smooth: true,
          symbolSize: 8,
          symbol: 'circle',
          itemStyle: { color: '#e12029', borderWidth: 3, borderColor: '#ffffff' }, // Apple Blue
          lineStyle: { width: 4, shadowColor: 'rgba(225, 32, 41, 0.4)', shadowBlur: 14, shadowOffsetY: 6 },
          z: 10,
          animationEasing: 'elasticOut',
          animationDelay: function (idx: number) { return idx * 100 + 400; }
        }
      ]
    };
  }, [data]);

  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-[350px] text-[#565656] font-medium">No projection data available</div>;
  }

  return (
    <ReactECharts 
      option={option} 
      style={{ height: '400px', width: '100%' }} 
      className=" "
    />
  );
}
