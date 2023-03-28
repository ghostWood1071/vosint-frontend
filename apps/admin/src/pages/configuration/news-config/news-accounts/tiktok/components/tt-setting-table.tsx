import {
  CACHE_KEYS,
  useMutationDeleteAccountMonitor,
  useMutationUpdateAccountMonitor,
  useProxyConfig,
  useTTSetting,
} from "@/pages/configuration/config.loader";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Space, Table, TableColumnsType, Tag, message } from "antd";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { useSearchParams } from "react-router-dom";

import { SettingCreateForm } from "./tt-setting-form";

interface Props {
  data: any;
  loading: boolean;
}

export const SettingTable: React.FC<Props> = ({ data, loading }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isIdTarget, setIsIdTarget] = useState("");
  const [isValueTarget, setIsValueTarget] = useState<any>();
  const [proxysSelect, setProxysSelect] = useState([]);
  const [usersSelect, setUsersSelect] = useState([]);
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const { mutate: mutateUpdate } = useMutationUpdateAccountMonitor();
  const { mutate: mutateDelete } = useMutationDeleteAccountMonitor();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: accountMonitor } = useTTSetting({
    page_number: searchParams.get("page") ?? 1,
    page_size: searchParams.get("limit") ?? 10,
    social_name: "",
    type_data: "Object",
  });
  const { data: listProxy } = useProxyConfig({
    skip: searchParams.get("page_number") ?? 1,
    limit: searchParams.get("page_size") ?? 10,
    text_search: searchParams.get("text_search") ?? "",
  });
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
        return list_users?.map((item: any) => <Tag>{item.name}</Tag>);
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
      align: "right",
      dataIndex: "_id",
      render: (_id: string, values) => {
        return (
          <Space>
            <Button icon={<EditOutlined />} onClick={() => handleShowEdit(_id, values)} />
            <Button icon={<DeleteOutlined />} danger onClick={() => handleShowDelete(_id)} />
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="name"
        pagination={{ position: ["bottomCenter"] }}
        loading={loading}
      />
      <Modal
        title="Sửa cấu hình Tiktok"
        open={isEditOpen}
        onCancel={handleCancelEdit}
        onOk={handleOkEdit}
        destroyOnClose
      >
        <SettingCreateForm
          setProxysSelect={setProxysSelect}
          setUsersSelect={setUsersSelect}
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
    values.list_proxy = proxysSelect.map((item: any) => ({
      proxy_id: item.value,
      name: item.label,
    }));
    values.users_follow = usersSelect.map((item: any) => ({
      follow_id: item.value,
      social_name: item.label,
    }));
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
