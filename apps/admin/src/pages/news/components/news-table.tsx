// import { DownNewsIcon, UpNewsIcon } from "@/assets/svg";
import { generateExternalLink } from "@/utils/href";
import {
  BellTwoTone,
  ExclamationCircleOutlined,
  MinusCircleTwoTone,
  ShoppingCartOutlined,
  StarTwoTone,
} from "@ant-design/icons";
import { Modal, Space, Table, TableColumnsType, Tooltip, Typography, message } from "antd";
import { truncate } from "lodash";
import qs from "query-string";
import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import shallow from "zustand/shallow";

import { useNewsStore } from "../news.store";

interface Props {
  dataSource?: any[];
  total_record: number;
  isLoading?: boolean;
  isDeleting?: boolean;
  onDelete?: (id: string) => void;
}

export const NewsTable: React.FC<Props> = ({
  dataSource,
  total_record,
  isLoading,
  isDeleting,
  onDelete,
}) => {
  const { setNewsIds, setShow } = useNewsStore(
    (state) => ({
      setNewsIds: state.setNewsIds,
      setShow: state.setShow,
    }),
    shallow,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page_number");
  const pageSize = searchParams.get("page_size");
  const location = useLocation();

  const columns: TableColumnsType<any> = [
    // {
    //   key: "isUp",
    //   dataIndex: "isUp",
    //   width: 50,
    //   render: (isUp) => (isUp ? <UpNewsIcon /> : <DownNewsIcon />),
    // },
    {
      key: "data:title",
      dataIndex: "data:title",
      ellipsis: true,
      width: "30%",
      render: (title, { id }) => <Typography.Link>{title}</Typography.Link>,
    },
    {
      key: "title",
      dataIndex: "_id",
      align: "center",
      render: (_, record) => {
        function handleClickShop() {
          setNewsIds([record._id]);
          setShow(true);
        }

        function handleClickBell() {
          record.isBell ? message.warning("Xoá thành công") : message.success("Thêm thành công");
        }

        function handleClickStar() {
          record.isStar ? message.warning("Xoá thành công") : message.success("Thêm thành công");
        }

        return (
          <Space>
            <Tooltip title="Thêm vào giỏ tin">
              <ShoppingCartOutlined onClick={handleClickShop} />
            </Tooltip>
            <Tooltip title={record.isBell ? "Xoá khỏi tin quan trọng" : "Thêm vào tin quan trọng"}>
              <BellTwoTone
                twoToneColor={record.isBell ? "#00A94E" : "#A6A6A6"}
                onClick={handleClickBell}
              />
            </Tooltip>
            <Tooltip
              title={record.isStar ? "Xoá khỏi tin được đánh dấu" : "Thêm vào tin được đánh dấu"}
            >
              <StarTwoTone
                twoToneColor={record.isStar ? "#FFCA10" : "#A6A6A6"}
                onClick={handleClickStar}
              />
            </Tooltip>
          </Space>
        );
      },
    },
    {
      key: "url",
      dataIndex: "data:url",
      render: (url) => (
        <a href={generateExternalLink(url)} target="_blank" rel="noreferrer">
          {truncate(url, { length: 30 })}
        </a>
      ),
    },
    {
      key: "date",
      dataIndex: "data:time",
    },
  ];

  if (onDelete) {
    columns.push({
      key: "id",
      dataIndex: "_id",
      align: "center",
      render: (id, record) => {
        return (
          <MinusCircleTwoTone
            twoToneColor="#ff1207"
            title="Xoá bản tin khỏi giỏ"
            onClick={handleRemove}
          />
        );

        function handleRemove() {
          Modal.confirm({
            title: "Bạn có muốn xoá bản tin này?",
            icon: <ExclamationCircleOutlined />,
            content: `Titls: ${record["data:title"]}`,
            onOk() {
              return onDelete?.(id);
            },
            onCancel() {},
          });
        }
      },
    });
  }

  const rowSelection = {
    onChange: (selected: any) => {
      setNewsIds(selected);
    },
    getCheckboxProps: (record: any) => ({
      disabled: false,
      name: record.title,
    }),
  };

  return (
    <Table
      rowKey="_id"
      showHeader={false}
      pagination={{
        position: ["bottomCenter"],
        total: total_record,
        current: page ? +page : 1,
        onChange: handlePaginationChange,
        pageSize: pageSize ? +pageSize : 10,
      }}
      columns={columns}
      dataSource={dataSource}
      rowSelection={rowSelection}
      loading={isLoading}
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
