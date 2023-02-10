import React from "react";

import LineChart from "../../components/line-chart";
import styles from "./statistic.module.less";
import { TopGood } from "./top-good";

interface StatisticProps {
  data: any;
}

export const Statistic: React.FC<StatisticProps> = ({ data }) => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.chartContainer}>
        <div className={styles.header}>
          <div className={styles.leftHeader}>THỐNG KÊ LƯỢT LIKE & SHARE</div>
        </div>
        <div className={styles.chart}>
          <LineChart
            data={data.lineChartData}
            smooth={true}
            color={["#FB896B", "#AD00FF", "#005AB0", "#FF6666"]}
          />
        </div>
      </div>
      <div className={styles.listUserContainer}>
        <TopGood
          title="TOP THÀNH VIÊN HOẠT ĐỘNG TÍCH CỰC"
          data={data.partner}
          titleNumber={"SỐ THÀNH VIÊN"}
          numberOfAllUser={10}
        />
      </div>
    </div>
  );
};
