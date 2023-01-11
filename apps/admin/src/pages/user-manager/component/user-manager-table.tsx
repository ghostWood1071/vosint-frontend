import {
  ExclamationCircleOutlined,
  FormOutlined,
  KeyOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Image,
  Modal,
  Row,
  Space,
  Table,
  TableColumnsType,
  Typography,
} from "antd";
import React from "react";

interface Props {
  data: any;
  loading: boolean;
}

export const UserManagerTable: React.FC<Props> = ({ data, loading }) => {
  const columns: TableColumnsType<any> = [
    {
      title: "Danh sách người dùng",
      dataIndex: "name",
      render: (name: string) => {
        return (
          <Space>
            <Avatar />
            <Typography.Text>{name}</Typography.Text>
          </Space>
        );
      },
    },
    {
      title: "Tên tài khoản",
      dataIndex: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Quyền",
      dataIndex: "role",
    },
    {
      title: "Hoạt động",
      align: "center",
      render: (_, record) => {
        return (
          <Space>
            <Button icon={<FormOutlined />} />
            <Button icon={<KeyOutlined />} />
            <Button icon={<UserDeleteOutlined />} danger onClick={handleDelete} />
          </Space>
        );

        function handleDelete() {
          showConfirmDeleteUser(record);
        }
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

  function showConfirmDeleteUser(record: any) {
    Modal.warning({
      icon: <ExclamationCircleOutlined />,
      title: "Xác nhận xoá người dùng",
      okCancel: true,
      content: (
        <Row>
          <Col span={10}>
            <Image width={96} src="https://via.placeholder.com/96" preview={false} />
          </Col>
          <Col span={14}>
            <Space direction="vertical">
              <Typography.Text>{record.name}</Typography.Text>
              <Typography.Text>{record.role}</Typography.Text>
              <Typography.Text>{record.email}</Typography.Text>
            </Space>
          </Col>
        </Row>
      ),
    });
  }
};
