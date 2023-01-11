import React from "react";
import { Pie, PieConfig } from "@ant-design/plots";

interface DonutProps {
  data: any[];
}

export const DonutChart: React.FC<DonutProps> = ({ data }) => {
  const config: PieConfig = {
    appendPadding: 0,
    data,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-50%",
      style: {
        textAlign: "center",
      },
      autoRotate: false,
      content: "{value}",
    },
    color: ["#00A94E", "l(270) 0:#006EF8 1:#69ACFF", "l(270) 0:#FF6666 1:#FF0000"],
    statistic: {
      title: false,
      content: {
        offsetY: 0,
        style: {
          fontSize: "40px",
        },
      },
    },
    legend: {
      position: "bottom",
      layout: "horizontal",
      flipPage: false,
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
  };
  return <Pie {...config} />;
};
