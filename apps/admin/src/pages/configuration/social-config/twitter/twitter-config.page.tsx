import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Form, Modal, PageHeader } from "antd";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { usePostTWSetting, useTWSetting } from "../../config.loader";
import { SettingCreateForm } from "../twitter/components/twitter-setting-form";
import { TwSettingTable } from "./components/twitter-setting-table";

export const TwitterConfig: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: twitterData } = useTWSetting({
    page_number: searchParams.get("page") ?? 1,
    page_size: searchParams.get("limit") ?? 10,
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form] = Form.useForm();
  const { mutate, isLoading } = usePostTWSetting();
  return (
    <>
      <PageHeader
        extra={[
          <Button
            key="button"
            icon={<PlusSquareOutlined />}
            type="primary"
            onClick={handleShowCreate}
          >
            Thêm
          </Button>,
        ]}
      >
        <TwSettingTable data={twitterData ?? []} loading={isLoading} />
      </PageHeader>
      <Modal
        title="Thêm mới cấu hình Mạng xã hội"
        open={isCreateOpen}
        onCancel={handleCancelCreate}
        onOk={handleOkCreate}
        destroyOnClose
      >
        <SettingCreateForm form={form} onFinish={handleFinishCreate} />
      </Modal>
    </>
  );
  function handleShowCreate() {
    console.log(twitterData);
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
    values.social_type = "";
    mutate(values);
    setIsCreateOpen(false);
  }
};
