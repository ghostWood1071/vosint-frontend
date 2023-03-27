import { Form, FormInstance, Input, Select } from "antd";
import React from "react";

interface Props {
  setAdminSelect: any;
  adminData: any;
  type: any;
  valueTarget: any;
  value: any;
  form: FormInstance<any>;
  onFinish: (values: any) => void;
}

export const SettingCreateForm: React.FC<Props> = ({
  setAdminSelect,
  adminData,
  type,
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
          followed_by: valueTarget.followed_by.map((i: any) => ({
            label: i.username,
            value: i.followed_id,
          })),
        }
      : null;
  const handleChange = (value: string | string[], data: any) => {
    setAdminSelect(data);
  };
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
        <Select defaultValue={"Facebook"} options={[{ value: "Facebook", label: "Facebook" }]} />
      </Form.Item>
      <Form.Item name="social_type" label="Kiểu tài khoản">
        <Select
          defaultValue={type}
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
          span: 10,
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
            adminData.result.map((item: any) => ({
              label: item.username,
              value: item._id,
            })) ?? []
          }
        />
      </Form.Item>
    </Form>
  );
};
