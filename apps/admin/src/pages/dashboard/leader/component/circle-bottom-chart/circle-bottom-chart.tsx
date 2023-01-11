import React from "react";
import styles from "./circle-bottom.module.less";
import { CircleChart } from "@/pages/app/components/circle-chart/circle-chart";

interface CircleBottomChartProps {
  data: any[];
}

export const CircleBottomChart: React.FC<CircleBottomChartProps> = ({ data }) => {
  return (
    <div className={styles.mainBody}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>Tin theo chủ đề</div>
        <div className={styles.rightHeader}>Top 5</div>
      </div>
      <div className={styles.chart}>
        <CircleChart data={data} />
      </div>
    </div>
  );
};
