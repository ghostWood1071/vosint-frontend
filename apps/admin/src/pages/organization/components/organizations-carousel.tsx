import ImportantButton from "@/components/important-button/important-button";
import { BellTwoTone, ShoppingTwoTone, StarTwoTone } from "@ant-design/icons";
import { Col, Image, Row, Space, Typography } from "antd";
import React from "react";

import styles from "./organizations-carousel.module.less";

interface Props {
  data: PropsCard[];
}

export const OrganizationsCarousel: React.FC<Props> = ({ data }) => {
  const [data1, data2, data3, data4] = data;

  return (
    <>
      <Row>
        <Col span={8}>{data1 && <OrganizationsCard {...data1} />}</Col>
        <Col span={8}>{data2 && <OrganizationsCard {...data2} />}</Col>
        <Col span={8}>
          <Row className={styles.row}>
            <Col>{data3 && <OrganizationsCardTiny {...data3} />}</Col>
            <Col>{data4 && <OrganizationsCardTiny {...data4} />}</Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

interface PropsCard {
  title: string;
  description: string;
  url: string;
  id: string;
}

const OrganizationsCard: React.FC<PropsCard> = ({ title, description, url }) => {
  return (
    <div className={styles.card}>
      <Row>
        <Col span={24}>
          <Image src="/images/placeholder.jpg" alt={title} />
        </Col>
        <Col span={24} className={styles.description}>
          <Space direction="vertical">
            <Typography.Title level={5}>{title}</Typography.Title>
            <Typography.Paragraph
              ellipsis={{
                rows: 5,
              }}
            >
              {description}
            </Typography.Paragraph>
            <Row justify="space-between">
              <Col>
                <a href={url} target="_blank" rel="noreferrer">
                  {url}
                </a>
              </Col>
              <Col>
                <Space>
                  <ShoppingTwoTone twoToneColor="gray" />
                  {/* <BellTwoTone twoToneColor="gray" /> */}
                  <ImportantButton item={{ isBell: false }} />
                  <StarTwoTone twoToneColor="gray" />
                </Space>
              </Col>
            </Row>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

const OrganizationsCardTiny: React.FC<PropsCard> = ({ title, description, url }) => {
  return (
    <Row justify="space-between" className={styles["card-tiny"]}>
      <Col>
        <Row align="middle" gutter={8}>
          <Col span={10}>
            <Image src="/images/placeholder.jpg" />
          </Col>
          <Col span={14}>
            <Space direction="vertical">
              <Typography.Paragraph ellipsis={{ rows: 2 }} strong>
                {title}
              </Typography.Paragraph>
              <Typography.Paragraph ellipsis={{ rows: 4 }}>{description}</Typography.Paragraph>
            </Space>
          </Col>
        </Row>
      </Col>

      <Col>
        <Row justify="space-between" align="middle">
          <Col>
            <a href={url} target="_blank" rel="noreferrer">
              {url}
            </a>
          </Col>
          <Col>
            <Space>
              <ShoppingTwoTone twoToneColor="gray" />
              {/* <BellTwoTone twoToneColor="gray" /> */}
              <ImportantButton item={{ isBell: false }} />
              <StarTwoTone twoToneColor="gray" />
            </Space>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
