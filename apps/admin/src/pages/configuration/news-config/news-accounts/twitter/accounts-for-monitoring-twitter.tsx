import {
  CACHE_KEYS,
  useAdminMonitor,
  usePostAccountMonitor,
  useProxyConfig,
  useTWSetting,
} from "@/pages/configuration/config.loader";
import { PlusSquareOutlined } from "@ant-design/icons";
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
    skip: searchParams.get("skip") ?? 0,
    limit: searchParams.get("limit") ?? 10,
    type_data: "Twitter",
    username: titleFilter,
  });
  const { data: accountMonitor } = useTWSetting({
    page_number: searchParams.get("page") ?? 1,
    page_size: searchParams.get("limit") ?? 10,
    social_name: "",
    type_data: "Object",
  });
  const onSearch = (valueFilter: string) => {
    searchParams.set("username", valueFilter);
    setSearchParams(searchParams);
  };
  const { Search } = Input;
  const [valueSearch, setValueSearch] = useState("");
  const { data: listProxy } = useProxyConfig({
    skip: searchParams.get("page_number") ?? 1,
    limit: searchParams.get("page_size") ?? 10,
    text_search: searchParams.get("text_search") ?? "",
  });
  const [usersSelect, setUsersSelect] = useState([]);
  const [proxysSelect, setProxysSelect] = useState([]);

  const queryClient = useQueryClient();
  return (
    <>
      <PageHeader
        extra={[
          <Search
            placeholder="Tìm kiếm"
            value={valueSearch}
            onSearch={onSearch}
            onChange={(e) => setValueSearch(e.target.value)}
          />,
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
        <h3>Danh sách các tài khoản Twitter</h3>

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
          setUsersSelect={setUsersSelect}
          setProxysSelect={setProxysSelect}
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
    values.social = "Twitter";
    values.list_proxy = proxysSelect?.map((item: any) => ({
      proxy_id: item.value,
      name: item.label,
    }));
    values.users_follow = usersSelect?.map((item: any) => ({
      follow_id: item.value,
      social_name: item.label,
    }));
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
