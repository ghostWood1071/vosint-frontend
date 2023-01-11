import React from "react";
import { Button, Card, Col, List, Pagination, Row, Space } from "antd";
import VirtualList from "rc-virtual-list";
import styles from "./pipeline-history.module.less";
import data from "./data.json";
import { EyeOutlined } from "@ant-design/icons";
import { PipelineNewIcon } from "@/assets/svg";
import { useTranslation } from "react-i18next";

interface Props {}

export const PipelineHistory: React.FC<Props> = () => {
  const { t } = useTranslation("translation", { keyPrefix: "pipeline" });

  return (
    <Row gutter={22}>
      <Col span={9}>
        <Card title={t("time")} className={styles.time}>
          <Space direction="vertical" className={styles.space}>
            {new Array(10).fill(null).map((_, index) => (
              <Button key={index} type="primary" block>
                {index}
              </Button>
            ))}
            <Pagination defaultCurrent={1} total={50} />
          </Space>
        </Card>
      </Col>
      <Col span={15}>
        <Card title={t("links_information")}>
          <List>
            <VirtualList
              data={data.detail}
              height={550}
              itemHeight={35}
              itemKey={({ start_time, url }) => start_time + url}
            >
              {(item: typeof data.detail[0]) => (
                <List.Item actions={[<EyeOutlined />]} key={item.start_time + item.url}>
                  <Space>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      {item.url}
                    </a>
                    <PipelineNewIcon />
                  </Space>
                </List.Item>
              )}
            </VirtualList>
          </List>
        </Card>
      </Col>
    </Row>
  );
};
