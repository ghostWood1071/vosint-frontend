import { PlusSquareOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, PageHeader, Select } from "antd";
import React, { useState } from "react";
import { UserManagerForm, UserManagerTable } from "../component";
import { useUserManager } from "../user-manager.loader";

export const UserManagerList: React.FC = () => {
  const { data, isLoading } = useUserManager();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form] = Form.useForm();

  return (
    <>
      <PageHeader
        title="Danh sách người dùng"
        extra={[
          <Input placeholder="Tìm hiểu" suffix={<SearchOutlined />} key="input" />,
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
        <UserManagerTable data={data} loading={isLoading} />
      </PageHeader>
      <Modal
        title="Thêm người dùng"
        open={isCreateOpen}
        onCancel={handleCancelCreate}
        onOk={handleOkCreate}
        destroyOnClose
      >
        <UserManagerForm form={form} onFinish={handleFinishCreate} />
      </Modal>
    </>
  );

  function handleShowCreate() {
    setIsCreateOpen(true);
  }

  function handleCancelCreate() {
    setIsCreateOpen(false);
    form.resetFields();
  }

  function handleOkCreate() {
    form.submit();
  }

  function handleFinishCreate(values: any) {
    console.log(values);
  }
};
