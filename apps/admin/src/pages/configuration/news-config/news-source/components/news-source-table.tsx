import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Space, Table, TableColumnsType, Tooltip } from "antd";
import qs from "query-string";
import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import styles from "./news-source-table.module.less";

interface Props {
  data: any;
  loading: boolean;
  total_record: number;
  handleClickEdit: (value: any) => void;
  handleClickDelete: (value: any) => void;
}

export const SourceNewsTable: React.FC<Props> = ({
  data,
  loading,
  handleClickDelete,
  handleClickEdit,
  total_record,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page_number");
  const pageSize = searchParams.get("page_size");
  const location = useLocation();
  const columns: TableColumnsType<any> = [
    {
      title: "Tên nguồn tin",
      align: "left",
      dataIndex: "name",
      // render: (link: string) => {
      //   return (
      //     <a href={link} target="_blank" rel="noreferrer">
      //       {link}
      //     </a>
      //   );
      // },
    },
    {
      title: "Tên miền",
      align: "left",
      dataIndex: "host_name",
    },
    {
      title: "Ngôn ngữ",
      align: "left",
      dataIndex: "language",
    },
    {
      title: "Quốc gia xuất bản",
      align: "left",
      dataIndex: "publishing_country",
    },
    {
      title: "Loại nguồn",
      align: "left",
      dataIndex: "source_type",
    },
    {
      title: "",
      align: "center",
      render: (item) => {
        return (
          <Space>
            <Tooltip title={"Sửa nguồn tin"}>
              <EditOutlined onClick={() => handleClickEdit(item)} className={styles.edit} />
            </Tooltip>
            <Tooltip title={"Xoá nguồn tin"}>
              <DeleteOutlined onClick={() => handleClickDelete(item)} className={styles.delete} />
            </Tooltip>
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
      pagination={{
        position: ["bottomCenter"],
        total: total_record,
        current: page ? +page : 1,
        onChange: handlePaginationChange,
        pageSize: pageSize ? +pageSize : 10,
        size: "default",
      }}
      loading={loading}
    />
  );

  function handlePaginationChange(page: number, pageSize: number) {
    setSearchParams(
      qs.stringify({
        ...qs.parse(location.search),
        page_number: page + "",
        page_size: pageSize + "",
      }),
    );
  }
};
