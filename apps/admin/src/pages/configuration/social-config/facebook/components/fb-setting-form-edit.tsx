import { Form, FormInstance, Input, Select } from "antd";
import React from "react";

interface Props {
  form: FormInstance<any>;
  onFinish: (values: any) => void;
}

export const SettingEditForm: React.FC<Props> = ({ form, onFinish }) => {
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
        name="name"
        label="Tên"
        rules={[
          {
            required: true,
            message: "Please input your name!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="id"
        label="ID"
        rules={[
          {
            required: true,
            message: "Please input your name!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="date"
        label="Ngày tạo"
        rules={[
          {
            required: true,
            message: "Please input your name!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="role" label="Kiểu tài khoản">
        <Select
          options={[
            { value: "leader", label: "Facebook" },
            { value: "expert", label: "Twitter" },
            { value: "admin", label: "Tiktok" },
          ]}
        />
      </Form.Item>
    </Form>
  );
};
