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
import qs from "query-string";
import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page_number");
  const pageSize = searchParams.get("page_size");
  const location = useLocation();

  const columns: TableColumnsType<any> = [
    {
      title: "Danh sách người dùng",
      dataIndex: "full_name",
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
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Quyền",
      dataIndex: "role",
    },
    {
      title: "Hoạt động",
      dataIndex: "_id",
      align: "center",
      render: (_, record) => {
        return (
          <Space>
            {onUpdate && <Button icon={<FormOutlined />} onClick={handleClickUpdate} />}
            <Button icon={<KeyOutlined />} />
            <Button icon={<UserDeleteOutlined />} danger onClick={handleDelete} />
          </Space>
        );

        function handleDelete() {
          showConfirmDeleteUser(record);
        }

        function handleClickUpdate() {
          onUpdate?.(record);
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
