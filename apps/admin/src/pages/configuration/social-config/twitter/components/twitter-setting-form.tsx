import { Form, FormInstance, Input, Select } from "antd";
import React, { useEffect } from "react";

interface Props {
  setAdminSelect: any;
  adminData: any;
  valueTarget: any;
  value: any;
  form: FormInstance<any>;
  onFinish: (values: any) => void;
}

const formItemLayoutWithOutLabel = {
  labelCol: { span: 4 },
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 0 },
  },
};

export const SettingCreateForm: React.FC<Props> = ({
  setAdminSelect,
  adminData,
  valueTarget,
  value,
  form,
  onFinish,
}) => {
  const validateMessages = {
    required: "Nhập ${label}",
  };
  const initialValues =
    value === "edit"
      ? {
          ...valueTarget,
          followed_by: valueTarget?.followed_by?.map((i: any) => i.followed_id),
        }
      : null;
  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, []);
  const handleChange = (value: string | string[], data: any) => {
    setAdminSelect(data);
  };
  return (
    <Form
      onFinish={onFinish}
      id="user-create"
      form={form}
      validateMessages={validateMessages}
      {...formItemLayoutWithOutLabel}
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
      <Form.Item
        name="followed_by"
        label="Chọn tài khoản giám sát: "
        labelCol={{
          span: 7,
        }}
        rules={[
          {
            required: true,
            message: "Chọn tài khoản giám sát",
          },
        ]}
      >
        <Select
          mode="multiple"
          placeholder="Chọn tài khoản"
          onChange={handleChange}
          options={
            adminData?.result?.map((item: any) => ({
              label: item.username,
              value: item._id,
            })) ?? []
          }
        />
      </Form.Item>
    </Form>
  );
};
