import {
  CACHE_KEYS,
  useAccountMonitor,
  useAdminMonitor,
  usePostAccountMonitor,
} from "@/pages/configuration/config.loader";
import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Form, Modal, PageHeader } from "antd";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { useSearchParams } from "react-router-dom";

import { SettingCreateForm } from "./components/fb-setting-form";
import { SettingTable } from "./components/fb-setting-table";

export const AccountForMonitoringFacebook: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { mutate, isLoading } = usePostAccountMonitor();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form] = Form.useForm();
  const { data: facebookData } = useAdminMonitor({
    skip: searchParams.get("skip") ?? 0,
    limit: searchParams.get("limit") ?? 10,
    type_data: "Facebook",
  });
  const { data: accountMonitor } = useAccountMonitor({
    page_number: searchParams.get("page") ?? 1,
    page_size: searchParams.get("limit") ?? 20,
    type_data: "Facebook",
  });
  const queryClient = useQueryClient();
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
        <SettingTable data={facebookData?.result ?? []} loading={isLoading} />
      </PageHeader>
      <Modal
        title="Thêm mới cấu hình Facebook"
        open={isCreateOpen}
        onCancel={handleCancelCreate}
        onOk={handleOkCreate}
        destroyOnClose
      >
        <SettingCreateForm
          accountMonitor={accountMonitor}
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
    values.social = "Facebook";
    mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.InfoAccountMonitorFB]);
      },
      onError: () => {},
    });
    setIsCreateOpen(false);
    form.resetFields();
  }
};
