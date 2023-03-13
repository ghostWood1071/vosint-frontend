import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Form, Modal, PageHeader } from "antd";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { usePostTTSetting, useTTSetting } from "../../config.loader";
import { SettingCreateForm } from "./components/tiktok-setting-form";
import { TTSettingTable } from "./components/tiktok-setting-table";

export const TiktokConfig: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: tiktokData } = useTTSetting({
    page_number: searchParams.get("page") ?? 1,
    page_size: searchParams.get("limit") ?? 10,
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form] = Form.useForm();
  const { mutate, isLoading } = usePostTTSetting();
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
        <TTSettingTable data={tiktokData?.result ?? []} loading={isLoading} />
      </PageHeader>
      <Modal
        title="Thêm mới cấu hình Tiktok"
        open={isCreateOpen}
        onCancel={handleCancelCreate}
        onOk={handleOkCreate}
        destroyOnClose
      >
        <SettingCreateForm
          valueTarget
          value={"add"}
          form={form ?? []}
          onFinish={handleFinishCreate}
        />
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
    values.social_media = "Tiktok";
    values.social_type = "Object";
    mutate(values);
    setIsCreateOpen(false);
    form.resetFields();
  }
};
