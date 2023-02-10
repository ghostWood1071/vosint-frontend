import { Pie, PieConfig } from "@ant-design/plots";
import React from "react";

interface CircleChartProps {
  data: any[];
  color?: any[];
}

export const CircleChart: React.FC<CircleChartProps> = ({ data, color }) => {
  const config: PieConfig = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: {
      type: "outer",
      content: "{name}",
    },
    interactions: [
      {
        type: "pie-legend-active",
      },
      {
        type: "element-active",
      },
    ],
    color,
    legend: {
      position: "bottom",
      layout: "horizontal",
      flipPage: false,
    },
  };
  return <Pie {...config} />;
};
