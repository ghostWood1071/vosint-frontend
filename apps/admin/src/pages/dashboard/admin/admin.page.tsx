import { Col, Row } from "antd";
import React from "react";
import styles from "./admin.module.less";
import { StatisticBadSource } from "./components/statistic-bad-news/statistic-bad-source";
import { StatisticSource } from "./components/statistic-source/statistic-source";
import { StatisticSystem } from "./components/statistic-system/statistic-system";

interface AdminPageProps {}

export const AdminPage: React.FC<AdminPageProps> = () => {
  const dataBadSource = [
    {
      type: "Nguồn hỏng",
      value: 35,
    },
    {
      type: "Nguồn bình thường",
      value: 115,
    },
  ];

  const dataSource = [
    {
      type: "Nguồn tin lâu chưa thu thập",
      value: 35,
    },
    {
      type: "Nguồn tin thu thập thường xuyên",
      value: 115,
    },
  ];

  return (
    <div className={styles.mainComponent}>
      <Row gutter={[16, 16]} className={styles.row1}>
        <Col className={styles.column1Row1} xs={24} xl={15}>
          <div className={styles.columnRow1Level1Body}>
            <StatisticSystem />
          </div>
        </Col>
        <Col className={styles.column2Row1} xs={24} xl={9}>
          <div className={styles.columnRow1Level1Body}>
            <StatisticBadSource data={dataBadSource} />
          </div>
        </Col>
        <Col className={styles.column1Row2} xs={24} xl={15}>
          <Row gutter={[16, 16]} className={styles.rowLevel2}>
            <Col span={13}>
              <Row gutter={[8, 10]}>
                <Col span={24}>
                  <div className={styles.columnRow2Body}></div>
                </Col>
                <Col span={24}>
                  <div className={styles.columnRow2Body}></div>
                </Col>
              </Row>
            </Col>
            <Col span={11}>
              <div className={styles.columnRow1Level2Body}></div>
            </Col>
          </Row>
        </Col>
        <Col className={styles.column2Row2} xs={24} xl={9}>
          <div className={styles.columnRow1Level2Body}>
            <StatisticSource data={dataSource} />
          </div>
        </Col>
      </Row>
    </div>
  );
};
