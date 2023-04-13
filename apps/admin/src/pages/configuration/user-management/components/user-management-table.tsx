import { generateImage } from "@/utils/image";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
  KeyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Col, Modal, Row, Space, Table, TableColumnsType, Typography } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

interface Props {
  dataSource?: any[];
  totalRecord: number;
  isLoading?: boolean;
  onUpdate?: (values: any) => void;
  onDelete?: (_id: string) => void;
}

export const UserManagerTable: React.FC<Props> = ({
  dataSource,
  isLoading,
  totalRecord,
  onUpdate,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page_number");
  const pageSize = searchParams.get("page_size");

  const columns: TableColumnsType<any> = [
    {
      title: "Họ và tên",
      dataIndex: "full_name",
      render: (name: string, record) => {
        return (
          <Space>
            <Avatar
              src={record?.avatar_url ? generateImage(record.avatar_url) : <UserOutlined />}
              style={{ backgroundColor: "#cccccc" }}
            />
            <Typography.Text>{name}</Typography.Text>
          </Space>
        );
      },
    },
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Quyền",
      dataIndex: "role",
      render: (role) => t(role),
    },
    {
      title: "Hoạt động",
      dataIndex: "_id",
      align: "center",
      render: (_, record) => {
        return (
          <Space>
            {onUpdate && (
              <Button
                icon={<FormOutlined />}
                onClick={handleClickUpdate}
                title="Sửa người dùng"
                type="text"
              />
            )}
            <Button icon={<KeyOutlined />} type="text" />
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={handleDelete}
              title="Xoá người dùng"
              type="text"
            />
          </Space>
        );

        function handleDelete() {
          showConfirmDeleteUser(record);
        }

        function handleClickUpdate() {
          onUpdate?.({ ...record, isUpdate: true });
        }
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey="_id"
      loading={isLoading}
      pagination={{
        position: ["bottomCenter"],
        total: totalRecord,
        current: page ? +page : 1,
        onChange: handlePaginationChange,
        pageSize: pageSize ? +pageSize : 10,
      }}
    />
  );

  function showConfirmDeleteUser(record: any) {
    Modal.warning({
      icon: <ExclamationCircleOutlined />,
      title: "Xác nhận xoá người dùng",
      okCancel: true,
      onOk: () => onDelete?.(record._id),
      content: (
        <Row align="middle">
          <Col span={10}>
            <Avatar
              shape="square"
              size={96}
              src={record?.avatar_url ? generateImage(record.avatar_url) : <UserOutlined />}
              style={{ backgroundColor: "#cccccc" }}
            />
          </Col>
          <Col span={14}>
            <Space direction="vertical">
              <Typography.Text>{record.full_name}</Typography.Text>
              <Typography.Text>{record.username}</Typography.Text>
              <Typography.Text>{record.role}</Typography.Text>
            </Space>
          </Col>
        </Row>
      ),
    });
  }

  function handlePaginationChange(page: number, pageSize: number) {
    searchParams.set("page_number", page + "");
    searchParams.set("page_size", pageSize + "");
    setSearchParams(searchParams);
  }
};
