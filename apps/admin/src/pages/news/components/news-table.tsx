// import { DownNewsIcon, UpNewsIcon } from "@/assets/svg";
import { generateExternalLink } from "@/utils/href";
import {
  BellTwoTone,
  MinusCircleTwoTone,
  ShoppingCartOutlined,
  StarTwoTone,
} from "@ant-design/icons";
import { Space, Table, TableColumnsType, Tooltip, Typography, message } from "antd";
import qs from "query-string";
import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import shallow from "zustand/shallow";

import { useNewsStore } from "../news.store";

interface Props {
  dataSource?: any[];
  total_record: number;
}

export const NewsTable: React.FC<Props> = ({ dataSource, total_record }) => {
  const { setNewsIds, setShow } = useNewsStore(
    (state) => ({
      setNewsIds: state.setNewsIds,
      setShow: state.setShow,
    }),
    shallow,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page_number");
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
      width: 500,
      render: (title, { id }) => <Typography.Link>{title}</Typography.Link>,
    },
    {
      key: "title",
      dataIndex: "_id",
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
      width: 500,
      render: (url) => (
        <a href={generateExternalLink(url)} target="_blank" rel="noreferrer">
          {url}
        </a>
      ),
    },
    {
      key: "date",
      dataIndex: "data:time",
    },
    {
      key: "id",
      dataIndex: "_id",
      render: (id) => {
        return (
          <Tooltip title="Xoá bản tin">
            <MinusCircleTwoTone onClick={handleRemove} twoToneColor="#ff1207" />
          </Tooltip>
        );

        function handleRemove() {
          console.debug("debug--id", id);
        }
      },
    },
  ];

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
      }}
      columns={columns}
      dataSource={dataSource}
      rowSelection={rowSelection}
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
