import { VI_LOCALE } from "@/locales/cron";
import { Form, FormInstance, Input, Select } from "antd";
import React, { useEffect } from "react";
import { Cron } from "react-js-cron";
import "react-js-cron/dist/styles.css";

interface Props {
  listProxy: any;
  accountMonitor: any;
  valueTarget: any;
  valueActive: any;
  cronExpr: string;
  setCronExpr: (value: string) => void;
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
  onFinish,
  cronExpr,
  setCronExpr,
}) => {
  const validateMessages = {
    required: "Nhập ${label}",
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
    setCronExpr(valueActive === "edit" ? valueTarget?.cron_expr ?? "* * * * *" : "* * * * *");
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
        <Form.Item
          name="password"
          label="Password"
          dependencies={["cookie"]}
          rules={[
            ({ getFieldValue }) => {
              if (getFieldValue("cookie")?.trim() === "" || getFieldValue("cookie") === undefined) {
                return {
                  required: true,
                };
              }
              return {
                required: false,
              };
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
          <Select defaultValue={"Twitter"} options={[{ value: "Twitter", label: "Twitter" }]} />
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
        <Form.Item name={"cookie"} label={"Cookie"}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Lịch chạy">
          <Cron
            allowedPeriods={["week", "day", "hour", "minute", "reboot"]}
            value={cronExpr}
            setValue={setCronExpr}
            locale={VI_LOCALE}
            clearButtonProps={{ type: "default", disabled: !(/\d/.test(cronExpr)) && true }}

          />
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
