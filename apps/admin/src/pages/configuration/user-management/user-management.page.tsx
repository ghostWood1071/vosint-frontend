import { PlusSquareOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, PageHeader, Select } from "antd";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { UserManagerForm, UserManagerTable } from "./components";
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUserManager,
} from "./user-management.loader";

export const UserManagerList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { data, isLoading } = useUserManager({
    skip: searchParams.get("page_number") ?? "1",
    limit: searchParams.get("page_size") ?? "10",
  });
  const [isOpen, setIsOpen] = useState<"create" | "update" | null>(null);
  const [form] = Form.useForm();

  const { mutate: mutateCreate, isLoading: isCreating } = useCreateUser({
    onSuccess: () => {
      setIsOpen(null);
      form.resetFields();
    },
  });

  const { mutate: mutateUpdate, isLoading: isUpdating } = useUpdateUser({
    onSuccess: () => {
      setIsOpen(null);
      form.resetFields();
    },
  });

  const { mutate: mutateDelete } = useDeleteUser({});

  return (
    <>
      <PageHeader
        title="Danh sách người dùng"
        extra={[
          <Input placeholder="Tìm kiếm" suffix={<SearchOutlined />} key="input" />,
          <Select
            key="select"
            defaultValue="all"
            options={[
              {
                value: "all",
                label: "Tất cả người dùng",
              },
            ]}
          />,
          <Button
            key="button"
            icon={<PlusSquareOutlined />}
            type="primary"
            onClick={handleShowCreate}
          >
            Thêm người dùng
          </Button>,
        ]}
      >
        <UserManagerTable
          dataSource={data?.result}
          isLoading={isLoading}
          totalRecord={data?.total_record}
          onUpdate={handleShowUpdate}
          onDelete={handleDelete}
        />
      </PageHeader>
      <Modal
        title="Thêm người dùng"
        open={!!isOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        confirmLoading={isCreating || isUpdating}
        destroyOnClose
      >
        <UserManagerForm form={form} onFinish={handleFinish} />
      </Modal>
    </>
  );

  function handleShowCreate() {
    setIsOpen("create");
  }

  function handleShowUpdate(values: any) {
    form.setFieldsValue(values);
    setIsOpen("update");
  }

  function handleCancel() {
    setIsOpen(null);
    form.resetFields();
  }

  function handleOk() {
    form.submit();
  }

  function handleFinish({ _id, ...values }: any) {
    delete values.confirm_password;
    if (isOpen === "create") {
      return mutateCreate(values);
    }

    if (isOpen === "update") {
      return mutateUpdate({
        _id,
        values,
      });
    }
  }

  function handleDelete(id: string) {
    return mutateDelete(id);
  }
};
