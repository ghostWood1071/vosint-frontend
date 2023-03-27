import styles from "@/pages/configuration/social-config/facebook/components/fb-setting.module.less";
import { PlusSquareOutlined } from "@ant-design/icons";
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
    page_number: searchParams.get("page") ?? 1,
    page_size: searchParams.get("limit") ?? 10,
    social_name: titleFilter,
    type_data: "Object",
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form] = Form.useForm();
  const [valueSearch, setValueSearch] = useState("");
  const { mutate, isLoading } = usePostTTSetting();
  const { Search } = Input;
  const onSearch = (valueFilter: string) => {
    searchParams.set("social_name", valueFilter);
    setSearchParams(searchParams);
  };
  const [adminSelect, setAdminSelect] = useState([]);

  const { data: adminData } = useAdminMonitor({
    skip: searchParams.get("skip") ?? 0,
    limit: searchParams.get("limit") ?? 10,
    type_data: "Tiktok",
  });

  return (
    <>
      <PageHeader
        title="Danh sách cấu hình Tiktok "
        extra={[
          <Search
            placeholder="Tìm kiếm"
            value={valueSearch}
            onSearch={onSearch}
            className={styles.search}
            onChange={(e) => setValueSearch(e.target.value)}
            style={{ width: 300 }}
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
        <TTSettingTable adminData={adminData} data={tiktokData?.result ?? []} loading={isLoading} />
      </PageHeader>
      <Modal
        title="Thêm mới cấu hình Tiktok"
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
    values.social_media = "Tiktok";
    values.social_type = "Object";
    values.followed_by = adminSelect.map((item: any) => ({
      followed_id: item.value,
      username: item.label,
    }));
    mutate(values);
    setIsCreateOpen(false);
    form.resetFields();
  }
};
