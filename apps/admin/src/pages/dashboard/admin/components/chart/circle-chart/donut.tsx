import React from "react";
import { Pie, PieConfig } from "@ant-design/plots";

interface DonutProps {
  data: any[];
}

export const Donut: React.FC<DonutProps> = ({ data }) => {
  const config: PieConfig = {
    appendPadding: 0,
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
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
    color: ["l(270) 0:#FF6666 1:#FF0000", "l(270) 0:#006EF8 1:#69ACFF"],
    statistic: {
      content: {
        offsetY: 4,
        style: {
          fontSize: "40px",
        },
      },
    },
    legend: {
      position: "bottom",
      layout: "vertical",
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
