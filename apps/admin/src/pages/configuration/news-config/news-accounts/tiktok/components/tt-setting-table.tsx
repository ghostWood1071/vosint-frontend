import {
  CACHE_KEYS,
  useAccountMonitor,
  useMutationDeleteAccountMonitor,
  useMutationUpdateAccountMonitor,
} from "@/pages/configuration/config.loader";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, List, Modal, Space, Switch, Table, TableColumnsType } from "antd";
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
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const { mutate: mutateUpdate } = useMutationUpdateAccountMonitor();
  const { mutate: mutateDelete } = useMutationDeleteAccountMonitor();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: accountMonitor } = useAccountMonitor({
    page_number: searchParams.get("page") ?? 1,
    page_size: searchParams.get("limit") ?? 20,
    type_data: "Tiktok",
  });
  const columns: TableColumnsType<any> = [
    {
      title: "Tên",
      dataIndex: "username",
      render: (name: string) => {
        return <p>{name}</p>;
      },
    },
    {
      title: "Password",
      dataIndex: "password",
      render: (date: string) => {
        return <p>{date}</p>;
      },
    },
    {
      title: "Account",
      dataIndex: "social",
      render: (id: string) => {
        return <p>{id}</p>;
      },
    },
    {
      title: "Danh sách các tài khoản được giảm sát",
      dataIndex: "users_follow",
      render: (list_users: any) => {
        return (
          <List
            size="small"
            bordered
            dataSource={list_users}
            renderItem={(item: any) => <List.Item>{item}</List.Item>}
          />
        );
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
          accountMonitor={accountMonitor}
          valueTarget={isValueTarget}
          value={"edit"}
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
    mutateUpdate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.InfoAccountMonitorFB]);
      },
      onError: () => {},
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
      },
      onError: () => {},
    });
    setIsDeleteOpen(false);
  }
};
