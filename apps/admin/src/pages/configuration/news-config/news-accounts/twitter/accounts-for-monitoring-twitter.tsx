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

import { SettingCreateForm } from "./components/tw-setting-form";
import { SettingTable } from "./components/tw-setting-table";

export const AccountForMonitoringTwitter: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { mutate, isLoading } = usePostAccountMonitor();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form] = Form.useForm();
  const { data: twitterData } = useAdminMonitor({
    skip: searchParams.get("skip") ?? 0,
    limit: searchParams.get("limit") ?? 10,
    type_data: "Twitter",
  });
  const { data: accountMonitor } = useAccountMonitor({
    page_number: searchParams.get("page") ?? 1,
    page_size: searchParams.get("limit") ?? 20,
    type_data: "Twitter",
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
        <SettingTable data={twitterData?.result ?? []} loading={isLoading} />
      </PageHeader>
      <Modal
        title="Thêm mới cấu hình Twitter"
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
    values.social = "Twitter";
    mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.InfoAccountMonitorTW]);
      },
      onError: () => {},
    });
    setIsCreateOpen(false);
    form.resetFields();
  }
};
