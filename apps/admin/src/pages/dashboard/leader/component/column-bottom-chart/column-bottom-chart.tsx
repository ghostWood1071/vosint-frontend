import { BackgroundWorld } from "@/assets/svg";
import { Column, ColumnConfig } from "@ant-design/plots";
import React from "react";

import styles from "./column-bottom-chart.module.less";

interface ColumnBottomChartProps {
  data: any[];
}

export const ColumnBottomChart: React.FC<ColumnBottomChartProps> = ({ data }) => {
  const itemMax: any = data.reduce((a: any, b: any) => (a.value > b.value ? a : b));
  const brandColor = "#BDC4D0";
  const config: ColumnConfig = {
    data,
    xField: "type",
    yField: "value",
    seriesField: "",
    color: ({ type }: any): any => {
      if (type !== itemMax.type) {
        return brandColor;
      }
    },

    columnWidthRatio: 0.5,
    columnStyle: ({ type }): any => {
      if (type === itemMax.type) {
        return {
          fill: "l(190)  1:#00D1FF 0:#005AB0 0.6:#00D1FF",
          fillOpacity: 0.85,

          lineWidth: 1,

          shadowColor: "#00D1FF",
          shadowBlur: 0,
          cursor: "pointer",
        };
      }
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };
  return (
    <div className={styles.mainBody}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>Tin theo quốc gia</div>
        <div className={styles.rightHeader}>Top 5</div>
      </div>
      <div className={styles.chart}>
        <BackgroundWorld className={styles.background} />
        <Column className={styles.columnChart} {...config} />
      </div>
    </div>
  );
};
