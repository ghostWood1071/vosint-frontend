import { DownNewsIcon, UpNewsIcon } from "@/assets/svg";
import { generateExternalLink } from "@/utils/href";
import {
  BellTwoTone,
  MinusCircleTwoTone,
  ShoppingCartOutlined,
  StarTwoTone,
} from "@ant-design/icons";
import { message, Space, Table, TableColumnsType, Tooltip, Typography } from "antd";
import React from "react";
import { useOrganizationsStore } from "../organizations.store";

interface Props {
  dataSource?: any[];
}

export const OrganizationsTable: React.FC<Props> = ({ dataSource }) => {
  const setSelected = useOrganizationsStore((state) => state.setSelected);
  const setShow = useOrganizationsStore((state) => state.setShow);

  const columns: TableColumnsType<any> = [
    {
      key: "isUp",
      dataIndex: "isUp",
      width: 50,
      render: (isUp) => (isUp ? <UpNewsIcon /> : <DownNewsIcon />),
    },
    {
      key: "title",
      dataIndex: "title",
      ellipsis: true,
      width: 500,
      render: (title, { id }) => <Typography.Link>{title}</Typography.Link>,
    },
    {
      key: "title",
      dataIndex: "id",
      render: (_, record) => {
        function handleClickShop() {
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
      dataIndex: "url",
      render: (url) => (
        <a href={generateExternalLink(url)} target="_blank" rel="noreferrer">
          {url}
        </a>
      ),
    },
    {
      key: "date",
      dataIndex: "date",
    },
    {
      key: "id",
      dataIndex: "id",
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
      setSelected(selected);
    },
    getCheckboxProps: (record: any) => ({
      disabled: false,
      name: record.title,
    }),
  };

  return (
    <Table
      rowKey="id"
      showHeader={false}
      pagination={{
        position: ["topCenter"],
      }}
      columns={columns}
      dataSource={dataSource}
      rowSelection={rowSelection}
    />
  );
};
