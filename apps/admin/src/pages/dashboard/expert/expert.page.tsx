import { Col, Row } from "antd";
import React from "react";

import { Card } from "./components/card/card";
import { ChartLayout } from "./components/chart/chart-layout";
import styles from "./expert.module.less";

interface ExpertPageProps {}

export const ExpertPage: React.FC<ExpertPageProps> = () => {
  const dataSwiper = [
    {
      id: "s001",
      title: "Galaxy",
      imageUrl:
        "https://image.shutterstock.com/image-photo/sunrise-near-pond-birches-on-600w-1912241467.jpg",
    },
    {
      id: "s001",
      title: "Galaxy",
      imageUrl:
        "https://image.shutterstock.com/image-photo/sunrise-near-pond-birches-on-600w-1912241467.jpg",
    },
    {
      id: "s002",
      title: "Galaxy",
      imageUrl:
        "https://image.shutterstock.com/image-photo/sunrise-near-pond-birches-on-600w-1912241467.jpg",
    },
    {
      id: "s003",
      title: "Galaxy",
      imageUrl:
        "https://image.shutterstock.com/image-photo/sunrise-near-pond-birches-on-600w-1912241467.jpg",
    },
    {
      id: "s004",
      title: "Galaxy",
      imageUrl:
        "https://image.shutterstock.com/image-photo/sunrise-near-pond-birches-on-600w-1912241467.jpg",
    },
    {
      id: "s005",
      title: "Galaxy",
      imageUrl:
        "https://image.shutterstock.com/image-photo/sunrise-near-pond-birches-on-600w-1912241467.jpg",
    },
    {
      id: "s006",
      title: "Galaxy",
      imageUrl:
        "https://image.shutterstock.com/image-photo/sunrise-near-pond-birches-on-600w-1912241467.jpg",
    },
    {
      id: "s007",
      title: "Galaxy",
      imageUrl:
        "https://image.shutterstock.com/image-photo/sunrise-near-pond-birches-on-600w-1912241467.jpg",
    },
    {
      id: "s008",
      title: "Galaxy",
      imageUrl:
        "https://image.shutterstock.com/image-photo/sunrise-near-pond-birches-on-600w-1912241467.jpg",
    },
    {
      id: "s009",
      title: "Galaxy",
      imageUrl:
        "https://image.shutterstock.com/image-photo/sunrise-near-pond-birches-on-600w-1912241467.jpg",
    },
    {
      id: "s010",
      title: "Galaxy",
      imageUrl:
        "https://image.shutterstock.com/image-photo/sunrise-near-pond-birches-on-600w-1912241467.jpg",
    },
  ];

  const dataColumn = [
    {
      type: "10/06/2022",
      value: 700,
    },
    {
      type: "11/06/2022",
      value: 1000,
    },
    {
      type: "12/06/2022",
      value: 300,
    },
    {
      type: "13/06/2022",
      value: 500,
    },
    {
      type: "14/06/2022",
      value: 1100,
    },
    {
      type: "15/06/2022",
      value: 150,
    },
    {
      type: "16/06/2022",
      value: 300,
    },
  ];

  return (
    <div className={styles.mainComponent}>
      <Row className={styles.row}>
        <Col xs={24} xl={6}>
          <Card />
        </Col>
        <Col xs={24} xl={18}>
          <ChartLayout dataSwiper={dataSwiper} dataColumnChart={dataColumn} />
        </Col>
      </Row>
    </div>
  );
};
