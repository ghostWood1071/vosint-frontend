import { Line, LineConfig } from "@ant-design/plots";
import React from "react";

import styles from "./line-chart.module.less";

interface LineChartProps {
  data: any[];
}

export const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const config: LineConfig = {
    data,
    padding: "auto",
    xField: "date",
    yField: "value",
    xAxis: {
      tickCount: 5,
    },
  };

  return (
    <div className={styles.mainBody}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>Số lượng dữ liệu thu thập theo thời gian thực</div>
      </div>
      <div className={styles.chart}>
        <Line
          smooth={true}
          lineStyle={{
            lineWidth: 4,
          }}
          color={"#FB896B"}
          className={styles.chart}
          {...config}
        />
      </div>
    </div>
  );
};
