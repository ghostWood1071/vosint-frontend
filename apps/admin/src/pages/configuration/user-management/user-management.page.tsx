import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, PageHeader, Select, message } from "antd";
import { trim } from "lodash";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { useSearchParams } from "react-router-dom";

import { UserManagerForm, UserManagerTable } from "./components";
import {
  CACHE_KEYS,
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUserManager,
} from "./user-management.loader";

export const UserManagerList: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isLoading } = useUserManager({
    skip: searchParams.get("page_number") ?? "1",
    limit: searchParams.get("page_size") ?? "10",
    name: searchParams.get("name") ?? "",
    role: searchParams.get("role") ?? "",
  });
  const [isOpen, setIsOpen] = useState<"create" | "update" | null>(null);
  const [form] = Form.useForm();

  const { mutate: mutateCreate, isLoading: isCreating } = useCreateUser({
    onSuccess: () => {
      message.success("Thêm người dùng thành công");
      setIsOpen(null);
    },
  });

  const { mutate: mutateUpdate, isLoading: isUpdating } = useUpdateUser({
    onSuccess: () => {
      message.success("Cập nhật người dùng thành công");
      setIsOpen(null);
      queryClient.invalidateQueries([CACHE_KEYS.LIST]);
    },
  });

  const { mutate: mutateDelete } = useDeleteUser({});

  return (
    <>
      <PageHeader
        title="Danh sách người dùng"
        extra={[
          <Input.Search
            placeholder="Tìm kiếm theo họ tên, username người dùng"
            key="input"
            onSearch={handleSearch}
          />,
          <Select
            key="select"
            defaultValue=""
            options={[
              {
                value: "",
                label: "Tất cả người dùng",
              },
              {
                value: "admin",
                label: "Admin",
              },
              {
                value: "leader",
                label: "Lãnh đạo",
              },
              {
                value: "expert",
                label: "Chuyên viên",
              },
            ]}
            onChange={handleSearchRole}
            style={{ width: 200 }}
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
        title={isOpen === "create" ? "Thêm người dùng" : "Cập nhật người dùng"}
        open={!!isOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        confirmLoading={isCreating || isUpdating}
        destroyOnClose
        maskClosable={false}
      >
        <UserManagerForm form={form} onFinish={handleFinish} isUpdate={isOpen === "update"} />
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

  function handleSearch(value: string) {
    searchParams.delete("page_number");
    searchParams.delete("page_size");
    searchParams.set("name", trim(value));
    setSearchParams(searchParams);
  }

  function handleSearchRole(value: string) {
    searchParams.set("role", value);
    searchParams.delete("page_number");
    searchParams.delete("page_size");
    setSearchParams(searchParams);
  }
};
