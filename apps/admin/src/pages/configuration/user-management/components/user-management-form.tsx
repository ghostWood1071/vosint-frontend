import { Form, FormInstance, Input, Select } from "antd";
import React from "react";

interface Props {
  form: FormInstance<any>;
  onFinish: (values: any) => void;
  isUpdate?: boolean;
}

export const UserManagerForm: React.FC<Props> = ({ form, onFinish, isUpdate }) => {
  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      id="user-create"
      form={form}
      labelAlign="left"
      initialValues={{
        role: "leader",
      }}
    >
      <Form.Item name="role" label="Loại tài khoản">
        <Select
          options={[
            { value: "leader", label: "Lãnh đạo" },
            { value: "expert", label: "Chuyên viên" },
            { value: "admin", label: "Admin" },
          ]}
        />
      </Form.Item>
      <Form.Item
        name="username"
        label="Tên tài khoản"
        rules={[
          {
            required: true,
            whitespace: true,
            message: "Hãy nhập tên tài khoản!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="full_name"
        label="Họ tên"
        rules={[
          {
            required: true,
            whitespace: true,
            message: "Hãy nhập họ và tên!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="Mật khẩu"
        rules={[
          {
            required: !isUpdate,
            message: "Hãy nhập mật khẩu!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="confirm_password"
        label="Nhập lại mật khẩu"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: !isUpdate,
            message: "Hãy nhập lại mật khẩu!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Hai mật khẩu bạn nhập không trùng khớp!"));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item name="_id" hidden></Form.Item>
    </Form>
  );
};
