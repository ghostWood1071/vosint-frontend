import { PlusOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, Modal, PageHeader, Select, message } from "antd";
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

  const {
    mutate: mutateCreate,
    isLoading: isCreating,
    error: errorCreate,
    isError: isErrorCreate,
    reset: resetCreate,
  } = useCreateUser({
    onSuccess: () => {
      message.success("Thêm người dùng thành công");
      setIsOpen(null);
      queryClient.invalidateQueries([CACHE_KEYS.LIST]);
      form.resetFields();
    },
    onError: (err) => {
      if (err.response?.data.detail === "User already exist") {
        message.error("Người dùng đã tồn tại");
      } else {
        message.error("Thêm người dùng thất bại");
      }
    },
  });

  const {
    mutate: mutateUpdate,
    isLoading: isUpdating,
    isError: isErrorUpdate,
    error: errorUpdate,
    reset: resetUpdate,
  } = useUpdateUser({
    onSuccess: () => {
      message.success("Sửa người dùng thành công");
      setIsOpen(null);
      queryClient.invalidateQueries([CACHE_KEYS.LIST]);
      form.resetFields();
    },
    onError: () => {
      message.error("Sửa người dùng thất bại");
    },
  });

  const { mutate: mutateDelete } = useDeleteUser({
    onSuccess: () => {
      message.success("Xóa người dùng thành công");
      queryClient.invalidateQueries([CACHE_KEYS.LIST]);
    },
    onError: () => {
      message.error("Xóa người dùng thất bại");
    },
  });

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
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={handleShowCreate}>
            Thêm
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
        title={isOpen === "create" ? "Thêm người dùng" : "Sửa người dùng"}
        open={!!isOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        confirmLoading={isCreating || isUpdating}
        destroyOnClose
        maskClosable={false}
        closeIcon={true}
        width={800}
      >
        {(isErrorCreate || isErrorUpdate) && (
          <Alert
            message={errorCreate?.response?.data.detail || errorUpdate?.response?.data.detail}
            style={{ marginBottom: 10 }}
            type="error"
          />
        )}
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
    resetCreate();
    resetUpdate();
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
