import styles from "@/pages/configuration/social-config/facebook/components/fb-setting.module.less";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, PageHeader } from "antd";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useAdminMonitor, usePostTTSetting, useTTSetting } from "../../config.loader";
import { SettingCreateForm } from "./components/tiktok-setting-form";
import { TTSettingTable } from "./components/tiktok-setting-table";

export const TiktokConfig: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  let titleFilter = searchParams.get("social_name") ?? "";

  const { data: tiktokData } = useTTSetting({
    page: searchParams.get("page") ?? 1,
    limit: searchParams.get("limit") ?? 10,
    social_name: titleFilter,
    type_data: "Object",
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form] = Form.useForm();
  const { mutate, isLoading } = usePostTTSetting();
  const { Search } = Input;
  const onSearch = (valueFilter: string) => {
    searchParams.set("social_name", valueFilter);
    setSearchParams(searchParams);
  };
  const [adminSelect, setAdminSelect] = useState([]);

  const { data: adminData } = useAdminMonitor({
    type_data: "Tiktok",
  });

  return (
    <>
      <PageHeader
        title="Danh sách cấu hình Tiktok "
        extra={[
          <Search placeholder="Tìm kiếm" onSearch={onSearch} className={styles.search} />,
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={handleShowCreate}>
            Thêm
          </Button>,
        ]}
      >
        <TTSettingTable
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          adminData={adminData}
          data={tiktokData ?? []}
          loading={isLoading}
        />
      </PageHeader>
      <Modal
        title="Thêm mới cấu hình Tiktok"
        open={isCreateOpen}
        onCancel={handleCancelCreate}
        onOk={handleOkCreate}
        destroyOnClose
        maskClosable={false}
        closeIcon={true}
        width={800}
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
    values.social_media = "Tiktok";
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
