import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Checkbox, Rate, Space, Table, TableColumnsType } from "antd";
import React from "react";

interface Props {
  data: any;
  loading: boolean;
}

export const SourceNewsTable: React.FC<Props> = ({ data, loading }) => {
  const columns: TableColumnsType<any> = [
    {
      title: "Danh sach nguon",
      align: "center",
      dataIndex: "link",
      render: (link: string) => {
        return (
          <a href={link} target="_blank" rel="noreferrer">
            {link}
          </a>
        );
      },
    },
    {
      title: "Danh gia",
      align: "center",
      dataIndex: "rate",
      render: (rate: number) => {
        return <Rate value={rate} />;
      },
    },
    {
      title: "Hien thi",
      align: "center",
      dataIndex: "show",
      render: (show: boolean) => {
        return <Checkbox checked={show} />;
      },
    },
    {
      title: "",
      align: "center",
      render: () => {
        return (
          <Space>
            <Button icon={<EditOutlined />} />
            <Button icon={<DeleteOutlined />} danger />
          </Space>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="_id"
      pagination={{ position: ["bottomCenter"] }}
      loading={loading}
    />
  );
};
