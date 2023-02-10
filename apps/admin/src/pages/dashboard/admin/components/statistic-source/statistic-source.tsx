import { CircleChart } from "@/pages/app/components/circle-chart/circle-chart";
import React from "react";

import styles from "./statistic-source.module.less";

interface StatisticSourceProps {
  data: any[];
}

export const StatisticSource: React.FC<StatisticSourceProps> = ({ data }) => {
  return (
    <div className={styles.mainBody}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>Thống kê nguồn tin</div>
      </div>
      <div className={styles.chart}>
        <CircleChart data={data} color={["#FF7410", "#02D3A1"]} />
      </div>
    </div>
  );
};
