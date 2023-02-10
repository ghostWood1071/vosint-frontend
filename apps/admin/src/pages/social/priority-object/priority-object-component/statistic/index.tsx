import { Col, Row } from "antd";
import React from "react";

import { CardStatistic } from "./card-statistic";
import { StatisticLikeShare } from "./statistic-like-share";
import { TopGoodUser } from "./top-good-user";

interface StatisticProps {
  objectChoosed: any;
}

export const Statistic: React.FC<StatisticProps> = ({ objectChoosed }) => {
  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <StatisticLikeShare data={objectChoosed.likeAndShare} />
      </Col>
      <Col xs={24} xl={16}>
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <CardStatistic title="Tổng số bài" number={1000} color={"#00A3FF"} />
          </Col>
          <Col span={12}>
            <CardStatistic title="Lượng tương tác" number={10000} color={"#AD00FF"} />
          </Col>
          <Col span={12}>
            <CardStatistic title="Bài đăng tích cực" number={5000} color={"#17B660"} />
          </Col>
          <Col span={12}>
            <CardStatistic title="Bài đăng tiêu cực" number={100} color={"#E32F2F"} />
          </Col>
        </Row>
      </Col>
      <Col xs={24} xl={8}>
        {objectChoosed.type === "group" ? (
          <TopGoodUser
            title="TOP THÀNH VIÊN HOẠT ĐỘNG TÍCH CỰC"
            data={objectChoosed.partner}
            titleNumber={"SỐ THÀNH VIÊN"}
            numberOfAllUser={10}
          />
        ) : (
          <TopGoodUser
            title="TOP THÀNH VIÊN HOẠT ĐỘNG TÍCH CỰC"
            data={objectChoosed.friends}
            titleNumber={"SỐ BẠN BÈ"}
            numberOfAllUser={20}
          />
        )}
      </Col>
    </Row>
  );
};
