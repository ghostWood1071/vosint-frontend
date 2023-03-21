import { Form, FormInstance, Input, Select } from "antd";
import React from "react";

interface Props {
  valueTarget: any;
  value: any;
  form: FormInstance<any>;
  onFinish: (values: any) => void;
}

export const SettingCreateForm: React.FC<Props> = ({ valueTarget, value, form, onFinish }) => {
  const validateMessages = {
    required: "Nhập ${label}",
  };
  const initialValues = value === "edit" ? valueTarget : null;
  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      id="user-create"
      form={form}
      labelAlign="left"
      requiredMark={false}
      initialValues={initialValues ?? {}}
      validateMessages={validateMessages}
      preserve={false}
    >
      <Form.Item
        name="social_name"
        label="Tên"
        rules={[
          {
            required: true,
          },
          {
            whitespace: true,
            message: "Không được để khoảng trắng",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="social_media" label="Mạng xã hội">
        <Select defaultValue={"Twitter"} options={[{ value: "Twitter", label: "Twitter" }]} />
      </Form.Item>

      <Form.Item
        name="account_link"
        label="Account Link"
        rules={[
          {
            required: true,
          },
          {
            type: "url",
            message: "Account Link không hợp lệ",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="avatar_url"
        label="Url Avatar"
        rules={[
          {
            required: true,
          },
          {
            type: "url",
            message: "Url Avatar không hợp lệ",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="profile"
        label="Profile"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};
