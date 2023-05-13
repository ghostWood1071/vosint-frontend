import { Table, TableColumnsType, Typography } from "antd";
import React from "react";
import { useSearchParams } from "react-router-dom";

interface Props {
  data: any;
  isLoading: boolean;
}

export const PipelineHistory: React.FC<Props> = ({ data, isLoading }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page_number_history");

  const columns: TableColumnsType<any> = [
    {
      key: "link",
      dataIndex: "link",
      render: (link: string) => (
        <Typography.Link href={link} target="_blank" rel="noreferrer">
          {link}
        </Typography.Link>
      ),
    },
    {
      dataIndex: "created_at",
    },
  ];

  return (
    <div>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data?.result ?? []}
        rowKey="_created_at"
        pagination={{
          position: ["bottomCenter"],
          onChange: handlePaginationChange,
          current: page ? +page : 1,
          total: data?.totalRecord,
          showSizeChanger: true,
        }}
      />
    </div>
  );

  function handlePaginationChange(page: number, pageSize: number) {
    searchParams.set("page_number_history", page + "");
    searchParams.set("page_size_history", pageSize + "");
    setSearchParams(searchParams);
  }
};
