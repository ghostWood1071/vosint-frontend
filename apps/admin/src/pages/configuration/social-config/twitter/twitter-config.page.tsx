import styles from "@/pages/configuration/social-config/facebook/components/fb-setting.module.less";
import { PlusOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, PageHeader } from "antd";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useAdminMonitor, usePostTWSetting, useTWSetting } from "../../config.loader";
import { SettingCreateForm } from "../twitter/components/twitter-setting-form";
import { TwSettingTable } from "./components/twitter-setting-table";

export const TwitterConfig: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  let titleFilter = searchParams.get("social_name") ?? "";

  const { data: twitterData } = useTWSetting({
    page: searchParams.get("page") ?? 1,
    limit: searchParams.get("limit") ?? 10,
    social_name: titleFilter,
    type_data: "Object",
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form] = Form.useForm();
  const [valueSearch, setValueSearch] = useState("");

  const { mutate, isLoading } = usePostTWSetting();
  const { Search } = Input;
  const onSearch = (valueFilter: string) => {
    searchParams.set("social_name", valueFilter);
    setSearchParams(searchParams);
  };
  const [adminSelect, setAdminSelect] = useState([]);

  const { data: adminData } = useAdminMonitor({
    type_data: "Twitter",
  });
  return (
    <>
      <PageHeader
        title="Danh sách cấu hình Twitter "
        extra={[
          <Search
            placeholder="Tìm kiếm"
            value={valueSearch}
            onSearch={onSearch}
            className={styles.search}
            onChange={(e) => setValueSearch(e.target.value)}
            style={{ width: 300 }}
          />,
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={handleShowCreate}>
            Thêm
          </Button>,
        ]}
      >
        <TwSettingTable
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          adminData={adminData}
          data={twitterData ?? []}
          loading={isLoading}
        />
      </PageHeader>
      <Modal
        title="Thêm mới cấu hình Twitter"
        open={isCreateOpen}
        onCancel={handleCancelCreate}
        onOk={handleOkCreate}
        destroyOnClose
      >
        <SettingCreateForm
          setAdminSelect={setAdminSelect}
          adminData={adminData}
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
    values.social_media = "Twitter";
    values.social_type = "Object";
    values.followed_by = adminSelect?.map((item: any) => ({
      followed_id: item.value,
      username: item.label,
    }));

    mutate(values);
    setIsCreateOpen(false);
    form.resetFields();
  }
};
