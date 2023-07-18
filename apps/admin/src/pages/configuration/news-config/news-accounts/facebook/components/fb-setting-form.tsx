import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, FormInstance, Input, Select, Upload } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import React, { useEffect } from "react";

interface Props {
  listProxy: any;
  accountMonitor: any;
  valueTarget: any;
  valueActive: any;
  fileList: any[];
  setFileList: (value: any[]) => void;
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
  listProxy,
  accountMonitor,
  valueTarget,
  valueActive,
  form,
  fileList,
  setFileList,
  onFinish,
}) => {
  const validateMessages = {
    required: "Nhập ${label}",
  };

  const onChange: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const initialValues =
    valueActive === "edit"
      ? {
          ...valueTarget,
          users_follow: valueTarget?.users_follow?.map((i: any) => i.follow_id),
          list_proxy: valueTarget?.list_proxy?.map((i: any) => i.proxy_id),
        }
      : null;
  useEffect(() => {
    form.setFieldsValue(initialValues);
    const listItemCookieUrl = valueTarget?.cookie_url?.split("/");
    setFileList(
      valueActive === "edit"
        ? [
            {
              uid: "-1",
              name: listItemCookieUrl?.[listItemCookieUrl?.length - 1],
              response: '{"status": "success"}',
              status: "done",
              url: valueTarget.cookie_url,
            },
          ]
        : [],
    );
  }, []);
  const initialaccountMonitor = accountMonitor?.result;
  const initialListProxy = listProxy?.data;
  return (
    <>
      <Form
        onFinish={onFinish}
        id="user-create"
        form={form}
        validateMessages={validateMessages}
        {...formItemLayoutWithOutLabel}
      >
        <Form.Item
          name="username"
          label="Tên"
          rules={[
            {
              required: fileList.length < 1,
            },
            {
              whitespace: true,
              message: "Không được để khoảng trắng",
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
              required: fileList.length < 1,
            },
            {
              whitespace: true,
              message: "Không được để khoảng trắng",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="social" label="Mạng xã hội">
          <Select defaultValue={"Facebook"} options={[{ value: "Facebook", label: "Facebook" }]} />
        </Form.Item>
        <Form.Item name="list_proxy" label="Proxy: ">
          <Select
            mode="multiple"
            placeholder="Chọn proxy"
            options={
              initialListProxy?.map((item: any) => ({
                label: item.name,
                value: item._id,
              })) ?? []
            }
          />
        </Form.Item>
        <Form.Item label={"Cookie"}>
          <Upload
            listType="text"
            accept={".json"}
            fileList={valueTarget?.cookie_url !== undefined ? fileList : undefined}
            maxCount={1}
            beforeUpload={() => false}
            onChange={onChange}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="users_follow"
          label="Các tài khoản được giám sát: "
          labelCol={{
            span: 6.5,
          }}
        >
          <Select
            mode="multiple"
            placeholder="Chọn tài khoản"
            options={
              initialaccountMonitor?.map((item: any) => ({
                label: item.social_name,
                value: item._id,
              })) ?? []
            }
          />
        </Form.Item>
      </Form>
    </>
  );
};
