import {
  CACHE_KEYS,
  useAdminMonitor,
  useFBSetting,
  usePostAccountMonitor,
  useProxyConfig,
} from "@/pages/configuration/config.loader";
import { PlusSquareOutlined } from "@ant-design/icons";
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
    skip: searchParams.get("skip") ?? 0,
    limit: searchParams.get("limit") ?? 10,
    type_data: "Facebook",
    username: titleFilter,
  });
  const [usersSelect, setUsersSelect] = useState([]);
  const [proxysSelect, setProxysSelect] = useState([]);

  const { data: accountMonitor } = useFBSetting({
    social_name: "",
    type_data: "All",
  });
  const { data: listProxy } = useProxyConfig({
    skip: searchParams.get("page_number") ?? 1,
    limit: searchParams.get("page_size") ?? 10,
    text_search: searchParams.get("text_search") ?? "",
  });
  const onSearch = (valueFilter: string) => {
    searchParams.set("username", valueFilter);
    setSearchParams(searchParams);
  };
  const [valueSearch, setValueSearch] = useState("");

  const { Search } = Input;

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
        <h3>Danh sách các tài khoản Facebook</h3>

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
    values.social = "Facebook";
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
