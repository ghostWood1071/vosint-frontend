import {
  CACHE_KEYS,
  useMutationDeleteSocial,
  useMutationUpdateTWSocial,
} from "@/pages/configuration/config.loader";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Space, Table, TableColumnsType } from "antd";
import React, { useState } from "react";
import { useQueryClient } from "react-query";

import { SettingCreateForm } from "./twitter-setting-form";

interface Props {
  data: any;
  loading: boolean;
}

export const TwSettingTable: React.FC<Props> = ({ data, loading }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [choosedAccount, setChoosedAccount] = useState(Object);
  const [isIdTarget, setIsIdTarget] = useState("");
  const queryClient = useQueryClient();
  const { mutate: mutateUpdate } = useMutationUpdateTWSocial();
  const { mutate: mutateDelete } = useMutationDeleteSocial();
  const [form] = Form.useForm();
  const [isValueTarget, setIsValueTarget] = useState<any>();

  const columns: TableColumnsType<any> = [
    {
      title: "Tên",
      dataIndex: "social_name",
      render: (name: string) => {
        return <p>{name}</p>;
      },
    },
    {
      title: "ID",
      dataIndex: "_id",
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
      render: (_id: any, values) => {
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
        title="Sửa cấu hình Twitter"
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

  function handleFinishEdit(values: any) {
    values.id = isIdTarget;
    values.social_type = "";

    mutateUpdate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.InfoTWSetting]);
      },
      onError: () => {},
    });
    setIsEditOpen(false);
  }
  function handleShowEdit(value: any, values: any) {
    setIsIdTarget(value);
    setIsValueTarget(values);
    setIsEditOpen(true);
  }

  function handleCancelEdit() {
    setIsEditOpen(false);
    form.resetFields();
  }

  function handleOkEdit() {
    form.submit();
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
        queryClient.invalidateQueries([CACHE_KEYS.InfoTWSetting]);
      },
      onError: () => {},
    });
    setIsDeleteOpen(false);
  }
};
