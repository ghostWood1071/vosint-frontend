import styles from "@/pages/configuration/social-config/facebook/components/fb-setting.module.less";
import { generateImage } from "@/utils/image";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Modal, Space, Table, TableColumnsType, Tooltip, Typography } from "antd";
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
      title: "Tên tài khoản",
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
              <Tooltip title={"Cập nhật người dùng"}>
                <EditOutlined onClick={handleClickUpdate} className={styles.edit} />
              </Tooltip>
            )}
            <Tooltip title={"Xoá người dùng"}>
              <DeleteOutlined onClick={handleDelete} className={styles.delete} />
            </Tooltip>
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
      size="small"
      loading={isLoading}
      pagination={{
        position: ["bottomCenter"],
        total: totalRecord,
        current: page ? +page : 1,
        onChange: handlePaginationChange,
        pageSize: pageSize ? +pageSize : 10,
        showSizeChanger: true,
      }}
    />
  );

  function showConfirmDeleteUser(record: any) {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: `Bạn có chắc muốn xoá "${record.full_name}" không?`,
      okText: "Xoá",
      cancelText: "Huỷ",
      onOk: () => onDelete?.(record._id),
    });
  }

  function handlePaginationChange(page: number, pageSize: number) {
    searchParams.set("page_number", page + "");
    searchParams.set("page_size", pageSize + "");
    setSearchParams(searchParams);
  }
};
