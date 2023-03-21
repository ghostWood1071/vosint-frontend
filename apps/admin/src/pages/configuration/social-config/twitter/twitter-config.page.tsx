import styles from "@/pages/configuration/social-config/facebook/components/fb-setting.module.less";
import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, PageHeader } from "antd";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { usePostTWSetting, useTWSetting } from "../../config.loader";
import { SettingCreateForm } from "../twitter/components/twitter-setting-form";
import { TwSettingTable } from "./components/twitter-setting-table";

export const TwitterConfig: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  let titleFilter = searchParams.get("social_name") ?? "";

  const { data: twitterData } = useTWSetting({
    page_number: searchParams.get("page") ?? 1,
    page_size: searchParams.get("limit") ?? 10,
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
  return (
    <>
      <PageHeader
        extra={[
          <Search
            placeholder="Tìm kiếm"
            value={valueSearch}
            onSearch={onSearch}
            className={styles.search}
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
        <TwSettingTable data={twitterData?.result ?? []} loading={isLoading} />
      </PageHeader>
      <Modal
        title="Thêm mới cấu hình Twitter"
        open={isCreateOpen}
        onCancel={handleCancelCreate}
        onOk={handleOkCreate}
        destroyOnClose
      >
        <SettingCreateForm
          valueTarget
          value={"add"}
          form={form ?? []}
          onFinish={handleFinishCreate}
        />
      </Modal>
    </>
  );
  function handleShowCreate() {
    console.log(twitterData);
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
    mutate(values);
    setIsCreateOpen(false);
    form.resetFields();
  }
};
