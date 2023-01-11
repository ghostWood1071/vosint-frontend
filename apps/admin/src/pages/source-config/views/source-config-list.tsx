import { PlusSquareOutlined, SaveOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, PageHeader, Space } from "antd";
import React from "react";
import { SourceConfigTable } from "../components";
import { useSourceConfig } from "../source-config.loader";

export const SourceConfigList: React.FC = () => {
  const { data, isLoading } = useSourceConfig();

  return (
    <PageHeader
      title={
        <Space>
          <Button icon={<PlusSquareOutlined />} type="primary">
            Thêm nguồn
          </Button>
          <Button disabled>Chọn link</Button>
          <Input suffix={<SearchOutlined />} />
        </Space>
      }
      extra={[
        <Button key="save" icon={<SaveOutlined />} type="primary">
          Save
        </Button>,
      ]}
    >
      <SourceConfigTable data={data} loading={isLoading} />
    </PageHeader>
  );
};
