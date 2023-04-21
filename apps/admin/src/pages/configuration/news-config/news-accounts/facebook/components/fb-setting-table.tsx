import {
  CACHE_KEYS,
  useMutationDeleteAccountMonitor,
  useMutationUpdateAccountMonitor,
} from "@/pages/configuration/config.loader";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Form, Modal, Popover, Space, Table, TableColumnsType, Tag, Tooltip, message } from "antd";
import React, { useState } from "react";
import { useQueryClient } from "react-query";

import { SettingCreateForm } from "./fb-setting-form";
import styles from "./fb-setting.module.less";

interface Props {
  searchParams: any;
  setSearchParams: any;
  data: any;
  listProxy: any;
  accountMonitor: any;
  loading: boolean;
}

export const SettingTable: React.FC<Props> = ({ data, listProxy, accountMonitor, loading }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isIdTarget, setIsIdTarget] = useState("");
  const [isValueTarget, setIsValueTarget] = useState<any>();

  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const { mutate: mutateUpdate } = useMutationUpdateAccountMonitor();
  const { mutate: mutateDelete } = useMutationDeleteAccountMonitor();
  const columns: TableColumnsType<any> = [
    {
      title: "Tài khoản",
      dataIndex: "username",
      render: (name: string) => {
        return <p>{name}</p>;
      },
    },
    {
      title: "Mật khẩu",
      dataIndex: "password",
      render: (date: string) => {
        return <p>{date}</p>;
      },
    },
    {
      title: "Danh sách các proxy",
      dataIndex: "list_proxy",
      render: (list_users: any, data: any) => {
        return list_users?.map((item: any) => (
          <Popover
            content={
              <div>
                <p>IP : {item.name}</p>
                <p>Cổng : {item.name}</p>
              </div>
            }
            title="Thông tin proxy"
          >
            <Tag className={styles.tag}>{item.name}</Tag>
          </Popover>
        ));
      },
    },
    {
      title: "Danh sách các tài khoản được giảm sát",
      dataIndex: "users_follow",
      render: (list_users: any) => {
        return list_users?.map((item: any) => (
          <Space size={[0, 8]} wrap>
            <Tag>{item.social_name}</Tag>
          </Space>
        ));
      },
    },

    {
      title: "",
      align: "center",
      dataIndex: "_id",
      render: (_id: string, values) => {
        return (
          <Space className={styles.spaceStyle}>
            <Tooltip title={"Sửa "}>
              <EditOutlined onClick={handleEdit} className={styles.edit} />
            </Tooltip>
            <Tooltip title={"Xoá "}>
              <DeleteOutlined onClick={handleDelete} className={styles.delete} />
            </Tooltip>
          </Space>
        );
        function handleEdit() {
          handleShowEdit(_id, values);
        }
        function handleDelete() {
          handleShowDelete(_id);
        }
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data?.result}
        rowKey="name"
        pagination={{ position: ["bottomCenter"] }}
        loading={loading}
      />
      <Modal
        title="Sửa cấu hình Facebook"
        open={isEditOpen}
        onCancel={handleCancelEdit}
        onOk={handleOkEdit}
        destroyOnClose
      >
        <SettingCreateForm
          listProxy={listProxy}
          accountMonitor={accountMonitor}
          valueTarget={isValueTarget}
          valueActive={"edit"}
          form={form}
          onFinish={handleFinishEdit}
        />
      </Modal>
      <Modal
        title="Xác nhận xóa tài khoản"
        open={isDeleteOpen}
        onCancel={handleCancelDelete}
        onOk={handleOkDelete}
        destroyOnClose
      ></Modal>
    </>
  );
  function handleShowEdit(value: any, values: any) {
    setIsEditOpen(true);
    setIsValueTarget(values);
    setIsIdTarget(value);
  }

  function handleCancelEdit() {
    setIsEditOpen(false);
    form.resetFields();
  }

  function handleOkEdit() {
    form.submit();
  }

  function handleFinishEdit(values: any) {
    values.id = isIdTarget;
    const values_users_by_id = values.users_follow?.map((id: any) =>
      accountMonitor?.result.find((item: any) => item._id === id),
    );
    values.users_follow =
      values_users_by_id?.map((item: any) => ({
        follow_id: item._id,
        social_name: item.social_name,
      })) ?? [];

    const values_by_id = values.list_proxy?.map((id: any) =>
      listProxy?.data.find((item: any) => item._id === id),
    );
    values.list_proxy =
      values_by_id?.map((item: any) => ({
        proxy_id: item._id,
        name: item.name,
        ip_address: item.ip_address,
        port: item.port,
      })) ?? [];
    mutateUpdate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.InfoAccountMonitorFB]);
        message.success({
          content: "Cập nhật thành công!",
          key: CACHE_KEYS.InfoAccountMonitorFB,
        });
      },
      onError: () => {
        message.error({
          content: "Trùng tên !",
          key: CACHE_KEYS.InfoAccountMonitorFB,
        });
      },
    });
    setIsEditOpen(false);
    form.resetFields();
  }

  function handleShowDelete(value: any) {
    setIsIdTarget(value);
    setIsDeleteOpen(true);
  }

  function handleCancelDelete() {
    setIsDeleteOpen(false);
  }

  function handleOkDelete() {
    mutateDelete(isIdTarget, {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.InfoAccountMonitorFB]);
        message.success({
          content: "Xoá thành công!",
          key: CACHE_KEYS.InfoAccountMonitorFB,
        });
      },
      onError: () => {},
    });
    setIsDeleteOpen(false);
  }
};
