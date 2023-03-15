import { Form, FormInstance, Input, Select, SelectProps } from "antd";
import React from "react";

interface Props {
  accountMonitor: any;
  valueTarget: any;
  value: any;
  form: FormInstance<any>;
  onFinish: (values: any) => void;
}
const handleChange = (value: string | string[]) => {
  console.log(value);
};
export const SettingCreateForm: React.FC<Props> = ({
  accountMonitor,
  valueTarget,
  value,
  form,
  onFinish,
}) => {
  const validateMessages = {
    required: "Nhập ${label}",
  };
  const initialValues = value === "edit" ? valueTarget : null;
  const initialaccountMonitor = accountMonitor.result;
  return (
    <>
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
          name="username"
          label="Tên"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="social" label="Mạng xã hội">
          <Select defaultValue={"Facebook"} options={[{ value: "Facebook", label: "Facebook" }]} />
        </Form.Item>
        <Form.Item
          name="users_follow"
          label="Các tài khoản được giám sát: "
          labelCol={{
            span: 10,
          }}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn tài khoản"
            defaultValue={[]}
            onChange={handleChange}
            options={
              initialaccountMonitor.map((item: any) => ({
                label: item.social_name,
                value: item.social_name,
              })) ?? []
            }
          />
        </Form.Item>
      </Form>
    </>
  );
};
