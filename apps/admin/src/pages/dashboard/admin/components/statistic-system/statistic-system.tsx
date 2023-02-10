import React from "react";

import { Progress } from "../chart/progress-chart/progress";
import styles from "./statistic-system.module.less";

interface StatisticSystemProps {}

export const StatisticSystem: React.FC<StatisticSystemProps> = () => {
  return (
    <div className={styles.mainBody}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>Giám sát hệ thống</div>
      </div>
      <div className={styles.content}>
        <div className={styles.containerChart}>
          <Progress
            percent={0.7}
            color="l(340) 0:#8FFF00 1:#04AA5A"
            heightProgress={200}
            widthProgress={200}
          />
          <div className={styles.titleText}>CPU</div>
        </div>
        <div className={styles.containerChart}>
          <Progress
            percent={0.65}
            color="l(340) 0:#D267FF 1:#A436D2"
            heightProgress={200}
            widthProgress={200}
          />
          <div className={styles.titleText}>RAM</div>
        </div>
        <div className={styles.containerChart}>
          <Progress
            percent={0.5}
            color="l(340) 0:#00D1FF 1:#005AB0"
            heightProgress={200}
            widthProgress={200}
          />
          <div className={styles.titleText}>Ổ CỨNG</div>
        </div>
      </div>
    </div>
  );
};
