import { PlusSquareOutlined, SaveOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, PageHeader, Space } from "antd";
import React from "react";

import { SourceNewsTable } from "./news-source-table";
import { useSourceNewsConfigList } from "./news-source.loader";

export const SourceNewsConfigList: React.FC = () => {
  const { data, isLoading } = useSourceNewsConfigList();

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
      <SourceNewsTable data={data} loading={isLoading} />
    </PageHeader>
  );
};
