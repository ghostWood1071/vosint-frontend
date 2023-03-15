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

import { SettingCreateForm } from "./components/tt-setting-form";
import { SettingTable } from "./components/tt-setting-table";

export const AccountForMonitoringTiktok: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { mutate, isLoading } = usePostAccountMonitor();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form] = Form.useForm();
  const { data: tiktokData } = useAdminMonitor({
    skip: searchParams.get("skip") ?? 0,
    limit: searchParams.get("limit") ?? 10,
    type_data: "Tiktok",
  });
  const { data: accountMonitor } = useAccountMonitor({
    page_number: searchParams.get("page") ?? 1,
    page_size: searchParams.get("limit") ?? 20,
    type_data: "Tiktok",
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
        <SettingTable data={tiktokData?.result ?? []} loading={isLoading} />
      </PageHeader>
      <Modal
        title="Thêm mới cấu hình Tiktok"
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
    values.social = "Tiktok";
    mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.InfoAccountMonitorTT]);
      },
      onError: () => {},
    });
    setIsCreateOpen(false);
    form.resetFields();
  }
};
