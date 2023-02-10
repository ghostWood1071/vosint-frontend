import React from "react";

import { Donut } from "../chart/circle-chart/donut";
import styles from "./statistic-bad-source.module.less";

interface StatisticBadSourceProps {
  data: any[];
}

export const StatisticBadSource: React.FC<StatisticBadSourceProps> = ({ data }) => {
  return (
    <div className={styles.mainBody}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>Thống kê nguồn tin hỏng</div>
      </div>
      <div className={styles.chart}>
        <Donut data={data} />
      </div>
    </div>
  );
};
