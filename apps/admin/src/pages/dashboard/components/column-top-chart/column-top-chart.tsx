import { Column, ColumnConfig } from "@ant-design/plots";
import React from "react";

import styles from "./column-top-chart.module.less";

interface ColumnTopChartProps {
  data: Object[];
}

export const ColumnTopChart: React.FC<ColumnTopChartProps> = ({ data }) => {
  const config: ColumnConfig = {
    data,
    xField: "date",
    yField: "value",
    seriesField: "",

    columnWidthRatio: 0.5,
    columnStyle: {
      fill: "l(190)  1:#8FFF00 0:#04AA5A",
      fillOpacity: 0.85,
      cursor: "pointer",
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
      </div>
      <div className={styles.chart}>
        <Column className={styles.columnChart} {...config} />
      </div>
    </div>
  );
};
