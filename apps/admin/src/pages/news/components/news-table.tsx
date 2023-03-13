// import { DownNewsIcon, UpNewsIcon } from "@/assets/svg";
import { ETreeTag } from "@/components/tree/tree.store";
import {
  BellTwoTone,
  ExclamationCircleOutlined,
  MinusCircleTwoTone,
  ShoppingCartOutlined,
  StarTwoTone,
} from "@ant-design/icons";
import { Modal, Space, Table, TableColumnsType, Tooltip, Typography } from "antd";
import { truncate } from "lodash";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { shallow } from "zustand/shallow";

import { useNewsStore } from "../news.store";

interface Props {
  dataSource?: any[];
  total_record: number;
  isLoading?: boolean;
  type?: "edit";
  onDelete?: (id: string, tag?: ETreeTag) => void;
  onAdd?: (id: string, tag: ETreeTag) => void;
}

export const NewsTable: React.FC<Props> = ({
  dataSource,
  total_record,
  isLoading,
  type,
  onDelete,
  onAdd,
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
      title: "Tiêu đề",
      render: (title, { _id }) => {
        return <Typography.Link onClick={handleChange}>{title}</Typography.Link>;

        function handleChange() {
          searchParams.set("newsId", _id);
          setSearchParams(searchParams);
        }
      },
    },
    {
      title: "Hành động",
      key: "title",
      dataIndex: "_id",
      align: "center",
      render: (_, record) => {
        function handleClickShop() {
          setNewsIds([record._id]);
          setShow(true);
        }

        function handleClickBell() {
          record.isBell
            ? onDelete?.(record._id, ETreeTag.QUAN_TRONG)
            : onAdd?.(record._id, ETreeTag.QUAN_TRONG);
        }

        function handleClickStar() {
          record.isStar
            ? onDelete?.(record._id, ETreeTag.DANH_DAU)
            : onAdd?.(record._id, ETreeTag.DANH_DAU);
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
      title: "Url",
      key: "url",
      dataIndex: "data:url",
      render: (url) => (
        <Typography.Link href={url} target="_blank" rel="noreferrer">
          {truncate(url, { length: 30 })}
        </Typography.Link>
      ),
    },
    {
      title: "Thời gian",
      key: "date",
      dataIndex: "data:time",
    },
  ];

  if (type === "edit") {
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
            content: `${record["data:title"]}`,
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
      // showHeader={false}
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
    searchParams.set("page_number", page + "");
    searchParams.set("page_size", pageSize + "");
    setSearchParams(searchParams);
  }
};
