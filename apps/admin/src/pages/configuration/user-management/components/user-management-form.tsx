import { Form, FormInstance, Input, Select } from "antd";
import React from "react";

interface Props {
  form: FormInstance<any>;
  onFinish: (values: any) => void;
  isUpdate?: boolean;
}

const formItemLayoutWithOutLabel = {
  labelCol: { span: 5 },
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 0 },
  },
};

export const UserManagerForm: React.FC<Props> = ({ form, onFinish, isUpdate }) => {
  return (
    <Form
      onFinish={onFinish}
      id="user-create"
      form={form}
      initialValues={{
        role: "leader",
      }}
      {...formItemLayoutWithOutLabel}
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
          {
            max: 20,
            message: "Mật khẩu không được quá 20 ký tự!",
          },
          {
            min: 8,
            message: "Mật khẩu phải có ít nhất 8 ký tự!",
          },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/,
            message: "Mật khẩu phải có ít nhất 1 kí tự đặc biệt, 1 chữ hoa, 1 chữ thường và 1 số!",
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
          {
            max: 20,
            message: "Mật khẩu không được quá 20 ký tự!",
          },
          {
            min: 8,
            message: "Mật khẩu phải có ít nhất 8 ký tự!",
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
