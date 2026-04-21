"use client";

import ReactECharts from 'echarts-for-react';
import { RevenueStreams } from "@/types/calculator";
import { useMemo } from 'react';

interface RevenuePieProps {
  data: RevenueStreams;
}

const COLORS = ["#e12029", "#363636", "#565656", "#dfdfdf", "#868686", "#1d1d1d"];

export function RevenuePie({ data }: RevenuePieProps) {
  const chartData = [
    { name: "Eigenverbrauch", value: data.selfConsumption },
    { name: "PRL", value: data.prl },
    { name: "SRL/aFRR", value: data.srlAfrr },
    { name: "EPEX Arbitrage", value: data.epexArbitrage },
    { name: "Peak Shaving", value: data.peakShaving },
    { name: "VPP", value: data.vppParticipation },
  ].filter(item => item.value > 0);

  const option = useMemo(() => {
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: €{c} ({d}%)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#dfdfdf',
        textStyle: { color: '#363636' },
        borderRadius: 16,
        padding: [12, 16],
        extraCssText: 'box-: 0 4px 24px rgba(0,0,0,0.06); backdrop-filter: blur(8px);'
      },
      legend: {
        bottom: '0%',
        left: 'center',
        itemWidth: 12,
        itemHeight: 12,
        textStyle: {
          color: '#565656',
          fontFamily: 'var(--font-opensans)'
        }
      },
      series: [
        {
          name: 'Einnahmequellen',
          type: 'pie',
          radius: ['50%', '80%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold',
              color: '#363636'
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.15)'
            }
          },
          labelLine: {
            show: false
          },
          data: chartData.map((d, i) => ({
            ...d,
            itemStyle: {
              color: COLORS[i % COLORS.length]
            }
          }))
        }
      ]
    };
  }, [chartData]);

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-full text-[#565656] font-medium">Keine Einnahmedaten verfügbar</div>;
  }

  return (
    <ReactECharts 
      option={option} 
      style={{ height: '350px', width: '100%' }} 
      opts={{ renderer: 'svg' }}
      className=" "
    />
  );
}
