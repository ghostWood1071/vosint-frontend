import { ColumnTopChart } from "@/pages/dashboard/components/column-top-chart/column-top-chart";
import { HotNews } from "@/pages/dashboard/components/hot-news/hot-news";
import { useNewsCountryToday, useNewsHoursToday } from "@/services/dashboard.loader";
import { Col, Row } from "antd";
import React from "react";

import styles from "./chart-layout.module.less";
import { LineChart } from "./line-chart";

interface ChartLayoutProps {
  dataSwiper: any[];
  dataColumnChart: any[];
}

export const ChartLayout: React.FC<ChartLayoutProps> = ({ dataSwiper, dataColumnChart }) => {
  const { data: dataCountryToday } = useNewsCountryToday();
  const { data: dataHoursToday } = useNewsHoursToday();

  return (
    <div className={styles.mainContainer}>
      <Row className={styles.row1}>
        <Col className={styles.column1Row1} xs={24} xl={13}>
          <div className={styles.columnChartContainer}>
            <ColumnTopChart data={dataCountryToday ?? []} />
          </div>
        </Col>
        <Col className={styles.column2Row1} xs={24} xl={11}>
          <div className={styles.lineChartContainer}>
            <LineChart data={dataHoursToday ?? []} />
          </div>
        </Col>
      </Row>
      <Row className={styles.row2}>
        <Col className={styles.columnRow2} span={24}>
          <div className={styles.swiperContainer}>
            <HotNews />
          </div>
        </Col>
      </Row>
    </div>
  );
};
