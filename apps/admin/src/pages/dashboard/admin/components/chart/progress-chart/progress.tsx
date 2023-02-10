import { RingProgress, RingProgressConfig } from "@ant-design/plots";
import React from "react";

interface ProgressProps {
  heightProgress: number;
  widthProgress: number;
  color: string;
  percent: number;
}

export const Progress: React.FC<ProgressProps> = ({
  heightProgress,
  widthProgress,
  color,
  percent,
}) => {
  const config: RingProgressConfig = {
    height: heightProgress,
    width: widthProgress,
    autoFit: false,
    percent: percent,
    color: color,
    statistic: {
      content: {
        style: {
          fontSize: "40px",
          color: "#224170",
        },
      },
    },
    tooltip: {
      title: "hello",
    },
    radius: 0,
  };
  return <RingProgress {...config} />;
};
