import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, PageHeader, Segmented } from "antd";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useAdminMonitor, useFBSetting, usePostFBSetting } from "../../config.loader";
import styles from "../facebook/components/fb-setting.module.less";
import { SettingCreateForm } from "./components/fb-setting-form";
import { SettingTable } from "./components/fb-setting-table";

export const FacebookConfig: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { mutate, isLoading } = usePostFBSetting();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form] = Form.useForm();
  const [value, setValue] = useState<string | number>("Fanpage");
  const [valueSearch, setValueSearch] = useState("");
  const [adminSelect, setAdminSelect] = useState([]);

  let titleFilter = searchParams.get("social_name") ?? "";
  const { data: facebookData } = useFBSetting({
    social_name: titleFilter,
    type_data: value,
  });
  const { data: adminData } = useAdminMonitor({
    skip: searchParams.get("skip") ?? 0,
    limit: searchParams.get("limit") ?? 10,
    type_data: "Facebook",
  });

  const { Search } = Input;

  const onSearch = (valueFilter: string) => {
    searchParams.set("social_name", valueFilter);
    setSearchParams(searchParams);
  };
  return (
    <>
      <PageHeader
        title="Danh sách cấu hình Facebook "
        extra={[
          <Segmented
            options={["Fanpage", "Group", "Object"]}
            value={value}
            onChange={handleAccountType}
            className={styles.segmented}
          />,
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
        <SettingTable adminData={adminData} data={facebookData?.result ?? []} loading={isLoading} />
      </PageHeader>

      <Modal
        title="Thêm mới cấu hình Facebook"
        open={isCreateOpen}
        onCancel={handleCancelCreate}
        onOk={handleOkCreate}
        destroyOnClose
      >
        <SettingCreateForm
          setAdminSelect={setAdminSelect}
          adminData={adminData}
          type={value}
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
    searchParams.set("social_name", "");
    setSearchParams(searchParams);
    setValueSearch("");
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
    values.followed_by = adminSelect?.map((item: any) => ({
      followed_id: item.value,
      username: item.label,
    }));
    mutate({ action: "add", ...values });
    setIsCreateOpen(false);
    form.resetFields();
  }
};
