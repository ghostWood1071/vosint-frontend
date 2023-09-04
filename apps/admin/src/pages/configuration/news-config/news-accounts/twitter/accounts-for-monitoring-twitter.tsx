import {
  CACHE_KEYS,
  useAdminMonitor,
  usePostAccountMonitor,
  useProxyConfig,
  useTWSetting,
} from "@/pages/configuration/config.loader";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, PageHeader, message } from "antd";
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
  let titleFilter = searchParams.get("username") ?? "";
  const { data: twitterData } = useAdminMonitor({
    type_data: "Twitter",
    username: titleFilter,
  });
  const { data: accountMonitor } = useTWSetting({
    social_name: "",
    type_data: "Object",
  });
  const onSearch = (valueFilter: string) => {
    searchParams.set("username", valueFilter);
    setSearchParams(searchParams);
  };
  const { Search } = Input;
  const { data: listProxy } = useProxyConfig({
    text_search: searchParams.get("text_search") ?? "",
  });
  const [cronExpr, setCronExpr] = React.useState("* * * * *");

  const queryClient = useQueryClient();
  return (
    <>
      <PageHeader
        title="Danh sách cấu hình Twitter"
        extra={[
          <Search placeholder="Tìm kiếm" onSearch={onSearch} />,
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={handleShowCreate}>
            Thêm
          </Button>,
        ]}
      >
        <SettingTable
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          data={twitterData ?? []}
          listProxy={listProxy}
          accountMonitor={accountMonitor}
          loading={isLoading}
        />
      </PageHeader>
      <Modal
        title="Thêm mới cấu hình Twitter"
        open={isCreateOpen}
        onCancel={handleCancelCreate}
        onOk={handleOkCreate}
        destroyOnClose
        maskClosable={false}
        closeIcon={true}
        width={900}
        okText="Thêm"
        cancelText="Thoát"
      >
        <SettingCreateForm
          listProxy={listProxy}
          accountMonitor={accountMonitor}
          valueTarget
          valueActive={"add"}
          cronExpr={cronExpr}
          setCronExpr={setCronExpr}
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
    const values_by_id = values.list_proxy?.map((id: any) =>
      listProxy?.data.find((item: any) => item._id === id),
    );
    values.list_proxy =
      values_by_id?.map((item: any) => ({
        proxy_id: item._id,
        name: item.name,
        ip_address: item.ip_address,
        port: item.port,
      })) ?? [];

    const values_users_by_id = values.users_follow?.map((id: any) =>
      accountMonitor?.result.find((item: any) => item._id === id),
    );
    values.users_follow =
      values_users_by_id?.map((item: any) => ({
        follow_id: item._id,
        social_name: item.social_name,
      })) ?? [];
    values.cron_expr = cronExpr;
    values.enabled = false;
    mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.InfoAccountMonitorTW]);
        message.success({
          content: "Thành công!",
          key: CACHE_KEYS.InfoAccountMonitorTW,
        });
      },
      onError: () => {
        message.error({
          content: "Tài khoản đã tồn tại!",
          key: CACHE_KEYS.InfoAccountMonitorTW,
        });
      },
    });
    setIsCreateOpen(false);
    form.resetFields();
  }
};
