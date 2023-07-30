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
  const pageSize = searchParams.get("page_size_history");

  const columns: TableColumnsType<any> = [
    {
      key: "link",
      dataIndex: "link",
      onCell: (record) => ({
        style: {
          background: record?.log === "error" ? "#a1090a" : "#fafafa",
          color: record.log === "error" ? "#fff" : "#000",
        },
      }),
      width: "50%",
      render: (link: string, record) =>
        record.log !== "error" ? (
          <Typography.Link href={link} target="_blank" rel="noreferrer">
            {link}
          </Typography.Link>
        ) : (
          link
        ),
    },
    {
      key: "link",
      width: "30%",
      onCell: (record) => ({
        style: {
          background: record?.log === "error" ? "#a1090a" : "#fafafa",
          color: record.log === "error" ? "#fff" : "#000",
        },
      }),
      render: (
        _,
        record, //   <Typography.Text type={record.log === "error" ? "danger" : undefined}>
      ) => (record.log === "error" ? `${record?.actione}: ${record?.message_error}` : ""),
      //   </Typography.Text>
    },
    {
      dataIndex: "created_at",
      align: "right",
      onCell: (record) => ({
        style: {
          background: record?.log === "error" ? "#a1090a" : "#fafafa",
          color: record.log === "error" ? "#fff" : "#000",
        },
      }),
    },
  ];

  return (
    <div>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data?.result ?? []}
        rowKey="_created_at"
        showHeader={false}
        size={"small"}
        pagination={{
          position: ["bottomCenter"],
          onChange: handlePaginationChange,
          current: page ? +page : 1,
          total: data?.total_record,
          showSizeChanger: true,
          defaultPageSize: pageSize ? +pageSize : 10,
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
