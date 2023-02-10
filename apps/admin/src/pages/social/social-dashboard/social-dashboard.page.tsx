import { Col, Row } from "antd";
import React from "react";

import { Card } from "./dashboard-component/Card/card";
import { CompareManySource } from "./dashboard-component/compare-many-source";
import { StatisticSource } from "./dashboard-component/statistic-source";

export const SocialDashboard = () => {
  const dataLine = [
    {
      type: "Facebook",
      data: [
        { name: "Like", day: "Mon", value: 300000 },
        { name: "Like", day: "Tue", value: 400000 },
        { name: "Like", day: "Wed", value: 100000 },
        { name: "Like", day: "Thu", value: 500000 },
        { name: "Like", day: "Fri", value: 700000 },
        { name: "Like", day: "Sat", value: 900000 },
        { name: "Like", day: "Sun", value: 300000 },
        { name: "Share", day: "Mon", value: 200000 },
        { name: "Share", day: "Tue", value: 800000 },
        { name: "Share", day: "Wed", value: 600000 },
        { name: "Share", day: "Thu", value: 200000 },
        { name: "Share", day: "Fri", value: 300000 },
        { name: "Share", day: "Sat", value: 100000 },
        { name: "Share", day: "Sun", value: 600000 },
        { name: "Comment", day: "Mon", value: 500000 },
        { name: "Comment", day: "Tue", value: 100000 },
        { name: "Comment", day: "Wed", value: 600000 },
        { name: "Comment", day: "Thu", value: 200000 },
        { name: "Comment", day: "Fri", value: 500000 },
        { name: "Comment", day: "Sat", value: 720000 },
        { name: "Comment", day: "Sun", value: 120000 },
      ],
    },
    {
      type: "Twitter",
      data: [
        { name: "Like", day: "Mon", value: 300000 },
        { name: "Like", day: "Tue", value: 400000 },
        { name: "Like", day: "Wed", value: 100000 },
        { name: "Like", day: "Thu", value: 500000 },
        { name: "Like", day: "Fri", value: 700000 },
        { name: "Like", day: "Sat", value: 900000 },
        { name: "Like", day: "Sun", value: 300000 },
        { name: "Share", day: "Mon", value: 200000 },
        { name: "Share", day: "Tue", value: 800000 },
        { name: "Share", day: "Wed", value: 600000 },
        { name: "Share", day: "Thu", value: 200000 },
        { name: "Share", day: "Fri", value: 300000 },
        { name: "Share", day: "Sat", value: 100000 },
        { name: "Share", day: "Sun", value: 600000 },
        { name: "Comment", day: "Mon", value: 500000 },
        { name: "Comment", day: "Tue", value: 100000 },
        { name: "Comment", day: "Wed", value: 600000 },
        { name: "Comment", day: "Thu", value: 200000 },
        { name: "Comment", day: "Fri", value: 500000 },
        { name: "Comment", day: "Sat", value: 720000 },
        { name: "Comment", day: "Sun", value: 120000 },
      ],
    },
    {
      type: "Tiktok",
      data: [
        { name: "Like", day: "Mon", value: 300000 },
        { name: "Like", day: "Tue", value: 400000 },
        { name: "Like", day: "Wed", value: 100000 },
        { name: "Like", day: "Thu", value: 500000 },
        { name: "Like", day: "Fri", value: 700000 },
        { name: "Like", day: "Sat", value: 900000 },
        { name: "Like", day: "Sun", value: 300000 },
        { name: "Share", day: "Mon", value: 200000 },
        { name: "Share", day: "Tue", value: 800000 },
        { name: "Share", day: "Wed", value: 600000 },
        { name: "Share", day: "Thu", value: 200000 },
        { name: "Share", day: "Fri", value: 300000 },
        { name: "Share", day: "Sat", value: 100000 },
        { name: "Share", day: "Sun", value: 600000 },
        { name: "Comment", day: "Mon", value: 500000 },
        { name: "Comment", day: "Tue", value: 100000 },
        { name: "Comment", day: "Wed", value: 600000 },
        { name: "Comment", day: "Thu", value: 200000 },
        { name: "Comment", day: "Fri", value: 500000 },
        { name: "Comment", day: "Sat", value: 720000 },
        { name: "Comment", day: "Sun", value: 120000 },
      ],
    },
  ];

  const dataCircle = [
    {
      type: "Facebook",
      data: [
        {
          type: "Đối tượng 1",
          value: 27,
        },
        {
          type: "Đối tượng 2",
          value: 25,
        },
        {
          type: "Đối tượng 3 ",
          value: 18,
        },
        {
          type: "Đối tượng 4",
          value: 27,
        },
        {
          type: "Đối tượng 5",
          value: 25,
        },
      ],
    },
    {
      type: "Twitter",
      data: [
        {
          type: "Đối tượng 1",
          value: 37,
        },
        {
          type: "Đối tượng 2",
          value: 10,
        },
        {
          type: "Đối tượng 3 ",
          value: 8,
        },
        {
          type: "Đối tượng 4",
          value: 27,
        },
        {
          type: "Đối tượng 5",
          value: 20,
        },
      ],
    },
    {
      type: "Tiktok",
      data: [
        {
          type: "Đối tượng 1",
          value: 12,
        },
        {
          type: "Đối tượng 2",
          value: 30,
        },
        {
          type: "Đối tượng 3 ",
          value: 8,
        },
        {
          type: "Đối tượng 4",
          value: 27,
        },
        {
          type: "Đối tượng 5",
          value: 15,
        },
      ],
    },
  ];

  const dataCardFacebook = [
    {
      type: "Tích cực",
      value: 200,
    },
    {
      type: "Trung tính",
      value: 115,
    },
    {
      type: "Tiêu cực",
      value: 100,
    },
  ];
  const dataCardTwitter = [
    {
      type: "Tích cực",
      value: 300,
    },
    {
      type: "Trung tính",
      value: 120,
    },
    {
      type: "Tiêu cực",
      value: 80,
    },
  ];
  const dataCardTiktok = [
    {
      type: "Tích cực",
      value: 200,
    },
    {
      type: "Trung tính",
      value: 115,
    },
    {
      type: "Tiêu cực",
      value: 100,
    },
  ];

  const dataColumn2 = [
    {
      type: "Facebook",
      data: [
        { user: "Đối tượng 1", type: "Tích cực", value: 25 },
        { user: "Đối tượng 1", type: "Tiêu cực", value: 10 },
        { user: "Đối tượng 2", type: "Tích cực", value: 30 },
        { user: "Đối tượng 2", type: "Tiêu cực", value: 40 },
        { user: "Đối tượng 3", type: "Tích cực", value: 10 },
        { user: "Đối tượng 3", type: "Tiêu cực", value: 60 },
        { user: "Đối tượng 4", type: "Tích cực", value: 15 },
        { user: "Đối tượng 4", type: "Tiêu cực", value: 2 },
        { user: "Đối tượng 5", type: "Tích cực", value: 36 },
        { user: "Đối tượng 5", type: "Tiêu cực", value: 10 },
      ],
    },
    {
      type: "Twitter",
      data: [
        { user: "Đối tượng 1", type: "Tích cực", value: 25 },
        { user: "Đối tượng 1", type: "Tiêu cực", value: 20 },
        { user: "Đối tượng 2", type: "Tích cực", value: 30 },
        { user: "Đối tượng 2", type: "Tiêu cực", value: 50 },
        { user: "Đối tượng 3", type: "Tích cực", value: 10 },
        { user: "Đối tượng 3", type: "Tiêu cực", value: 10 },
        { user: "Đối tượng 4", type: "Tích cực", value: 15 },
        { user: "Đối tượng 4", type: "Tiêu cực", value: 2 },
        { user: "Đối tượng 5", type: "Tích cực", value: 36 },
        { user: "Đối tượng 5", type: "Tiêu cực", value: 10 },
      ],
    },
    {
      type: "Tiktok",
      data: [
        { user: "Đối tượng 1", type: "Tích cực", value: 25 },
        { user: "Đối tượng 1", type: "Tiêu cực", value: 10 },
        { user: "Đối tượng 2", type: "Tích cực", value: 10 },
        { user: "Đối tượng 2", type: "Tiêu cực", value: 5 },
        { user: "Đối tượng 3", type: "Tích cực", value: 35 },
        { user: "Đối tượng 3", type: "Tiêu cực", value: 20 },
        { user: "Đối tượng 4", type: "Tích cực", value: 15 },
        { user: "Đối tượng 4", type: "Tiêu cực", value: 2 },
        { user: "Đối tượng 5", type: "Tích cực", value: 36 },
        { user: "Đối tượng 5", type: "Tiêu cực", value: 10 },
      ],
    },
  ];

  return (
    <Row gutter={[16, 20]}>
      <Col xl={8} xs={24}>
        <Card titleSource="Facebook" data={dataCardFacebook} />
      </Col>
      <Col xl={8} xs={24}>
        <Card titleSource="Twitter" data={dataCardTwitter} />
      </Col>
      <Col xl={8} xs={24}>
        <Card titleSource="Tiktok" data={dataCardTiktok} />
      </Col>
      <Col xs={24} xl={12}>
        <StatisticSource data={dataLine} />
      </Col>
      <Col xs={24} xl={12}>
        <CompareManySource data={dataCircle} />
      </Col>
    </Row>
  );
};
