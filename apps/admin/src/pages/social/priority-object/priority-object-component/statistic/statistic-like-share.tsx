import LineChart from "@/pages/social/components/line-chart";
import React from "react";

import styles from "./statistic-like-share.module.less";

interface StatisticLikeShareProps {
  data: any[];
}

export const StatisticLikeShare: React.FC<StatisticLikeShareProps> = ({ data }) => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>THỐNG KÊ LƯỢT LIKE & SHARE</div>
      </div>
      <div className={styles.chart}>
        <LineChart
          data={data}
          smooth={true}
          lineWidth={3}
          point={false}
          color={["#FB896B", "#AD00FF", "#005AB0", "#FF6666"]}
        />
      </div>
    </div>
  );
};
