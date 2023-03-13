import {
  CACHE_KEYS,
  useMutationDeleteSocial,
  useMutationUpdateSocial,
} from "@/pages/configuration/config.loader";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Space, Switch, Table, TableColumnsType } from "antd";
import React, { useState } from "react";
import { useQueryClient } from "react-query";

import { SettingCreateForm } from "./fb-setting-form";

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
  const { mutate: mutateUpdate } = useMutationUpdateSocial();
  const { mutate: mutateDelete } = useMutationDeleteSocial();

  const columns: TableColumnsType<any> = [
    {
      title: "Tên",
      dataIndex: "social_name",
      render: (name: string) => {
        return <p>{name}</p>;
      },
    },
    {
      title: "Account",
      dataIndex: "social_type",
      render: (id: string) => {
        return <p>{id}</p>;
      },
    },
    {
      title: "Mạng xã hội",
      dataIndex: "social_media",
      render: (date: string) => {
        return <p>{date}</p>;
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
        title="Sửa cấu hình Facebook"
        open={isEditOpen}
        onCancel={handleCancelEdit}
        onOk={handleOkEdit}
        destroyOnClose
      >
        <SettingCreateForm
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
        queryClient.invalidateQueries([CACHE_KEYS.InfoFBSetting]);
      },
      onError: () => {},
    });
    setIsEditOpen(false);
    form.resetFields();
    setIsValueTarget(null);
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
        queryClient.invalidateQueries([CACHE_KEYS.InfoFBSetting]);
      },
      onError: () => {},
    });
    setIsDeleteOpen(false);
  }
};
