import React from "react";
import { Line, LineConfig } from "@ant-design/plots";

interface LineChartProps {
  data: any[];
  smooth: boolean;
  point?: boolean;
  lineWidth?: number;
  color?: any[];
}

const LineChart: React.FC<LineChartProps> = ({ data, smooth, point, lineWidth, color }) => {
  const config: LineConfig = {
    data,
    xField: "day",
    yField: "value",
    seriesField: "name",
    smooth: smooth,
    yAxis: {
      label: {
        formatter: (v: any) => `${(v / 1).toFixed(0)}`,
      },
    },
    lineStyle: {
      lineWidth: lineWidth,
    },
    color,
    legend: {
      position: "top-right",
      layout: "horizontal",
      flipPage: false,
    },
    animation: {
      appear: {
        duration: 5000,
      },
    },
    point: point
      ? {
          shape: () => {
            return "circle";
          },
          size: () => {
            return 5;
          },
        }
      : {
          size: () => {
            return 0;
          },
        },
  };

  return <Line {...config} />;
};

export default LineChart;
