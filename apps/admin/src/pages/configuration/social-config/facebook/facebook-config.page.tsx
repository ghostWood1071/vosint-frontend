import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Form, Modal, PageHeader, Segmented } from "antd";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useFBSetting, usePostFBSetting } from "../../config.loader";
import { SettingCreateForm } from "./components/fb-setting-form";
import { SettingTable } from "./components/fb-setting-table";

export const FacebookConfig: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { mutate, isLoading } = usePostFBSetting();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form] = Form.useForm();
  const [value, setValue] = useState<string | number>("Fanpage");
  const { data: facebookData } = useFBSetting({
    page_number: searchParams.get("page") ?? 1,
    page_size: searchParams.get("limit") ?? 20,
    type_data: value,
  });

  return (
    <>
      <Segmented
        options={["Fanpage", "Group", "Object"]}
        value={value}
        onChange={handleAccountType}
      />
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
  function handleAccountType(values: any) {
    setValue(values);
  }

  function handleCancelCreate() {
    setIsCreateOpen(false);
    form.resetFields();
  }

  function handleOkCreate() {
    form.submit();
  }

  function handleFinishCreate(values: any) {
    values.social_media = "Facebook";
    values.social_type = value;
    mutate({ action: "add", ...values });
    setIsCreateOpen(false);
    form.resetFields();
  }
};
