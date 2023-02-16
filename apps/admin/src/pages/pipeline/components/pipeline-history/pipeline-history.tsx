import { PipelineNewIcon } from "@/assets/svg";
import { Card, Col, List, Row, Space } from "antd";
import VirtualList from "rc-virtual-list";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  data: any;
  isLoading: boolean;
}

export const PipelineHistory: React.FC<Props> = ({ data, isLoading }) => {
  const { t } = useTranslation("translation", { keyPrefix: "pipeline" });

  if (isLoading) {
    return null;
  }

  return (
    <Row gutter={22}>
      <Col span={24}>
        <Card title={t("links_information")}>
          <List>
            <VirtualList
              data={data.result}
              height={550}
              itemHeight={35}
              itemKey={({ start_time, url }) => start_time + url}
            >
              {(item: (typeof data.detail)[0]) => (
                <List.Item key={item.start_time + item.url}>
                  <Space>
                    <a href={item.link} target="_blank" rel="noreferrer">
                      {item.link}
                    </a>
                    {item.log !== "completed" && <PipelineNewIcon />}
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
