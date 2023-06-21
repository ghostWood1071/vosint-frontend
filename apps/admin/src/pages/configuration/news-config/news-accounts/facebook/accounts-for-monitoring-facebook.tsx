import {
  CACHE_KEYS,
  useAdminMonitor,
  useFBSetting,
  usePostAccountMonitor,
  useProxyConfig,
} from "@/pages/configuration/config.loader";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, PageHeader, message } from "antd";
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
  let titleFilter = searchParams.get("username") ?? "";
  const { data: facebookData } = useAdminMonitor({
    type_data: "Facebook",
    username: titleFilter,
  });

  const { data: accountMonitor } = useFBSetting({
    social_name: "",
    type_data: "All",
  });
  const { data: listProxy } = useProxyConfig({
    text_search: searchParams.get("text_search") ?? "",
  });
  const onSearch = (valueFilter: string) => {
    searchParams.set("username", valueFilter);
    setSearchParams(searchParams);
  };

  const { Search } = Input;

  const queryClient = useQueryClient();
  return (
    <>
      <PageHeader
        title="Danh sách cấu hình Facebook "
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
          data={facebookData ?? []}
          listProxy={listProxy}
          accountMonitor={accountMonitor}
          loading={isLoading}
        />
      </PageHeader>
      <Modal
        title="Thêm mới cấu hình Facebook"
        open={isCreateOpen}
        onCancel={handleCancelCreate}
        onOk={handleOkCreate}
        destroyOnClose
        maskClosable={false}
        closeIcon={true}
        width={800}
      >
        <SettingCreateForm
          listProxy={listProxy}
          accountMonitor={accountMonitor}
          valueTarget
          valueActive={"add"}
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

    mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.InfoAccountMonitorFB]);
        message.success({
          content: "Thành công!",
          key: CACHE_KEYS.InfoAccountMonitorFB,
        });
      },
      onError: () => {
        message.error({
          content: "Tài khoản đã tồn tại!",
          key: CACHE_KEYS.InfoAccountMonitorFB,
        });
      },
    });
    setIsCreateOpen(false);
    form.resetFields();
  }
};
