import { Form, FormInstance, Input, Select } from "antd";
import React from "react";

interface Props {
  form: FormInstance<any>;
  onFinish: (values: any) => void;
}

export const UserManagerForm: React.FC<Props> = ({ form, onFinish }) => {
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
            message: "Please input your username!",
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
            message: "Please input your name!",
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
            message: "Please input your password!",
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
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("The two passwords that you entered do not match!"));
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
