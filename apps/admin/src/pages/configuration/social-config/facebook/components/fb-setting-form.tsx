import { Form, FormInstance, Input, Select } from "antd";
import React from "react";

interface Props {
  form: FormInstance<any>;
  onFinish: (values: any) => void;
}

export const SettingCreateForm: React.FC<Props> = ({ form, onFinish }) => {
  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      id="user-create"
      form={form}
      labelAlign="left"
      requiredMark={false}
      initialValues={{
        role: "leader",
      }}
    >
      <Form.Item
        name="social_name"
        label="Tên"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="social_media" label="Mạng xã hội">
        <Select options={[{ value: "Facebook", label: "Facebook" }]} />
      </Form.Item>
      <Form.Item name="social_type" label="Kiểu tài khoản">
        <Select
          options={[
            { value: "Object", label: "Object" },
            { value: "Fanpage", label: "Fanpage" },
            { value: "Group", label: "Group" },
          ]}
        />
      </Form.Item>
      <Form.Item
        name="account_link"
        label="Account Link"
        rules={[
          {
            required: true,
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
