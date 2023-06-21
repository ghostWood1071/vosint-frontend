import { removeWhitespaceInStartAndEndOfString } from "@/utils/tool-validate-string";
import { Form, Input, InputNumber, Modal } from "antd";
import React from "react";

interface Props {
  type: string;
  confirmLoading?: boolean;
  isOpen: boolean;
  setIsOpen: (value: any) => void;
  choosedProxy: any;
  functionAdd: (value: any) => void;
  functionEdit: (value: any) => void;
}

const formItemLayoutWithOutLabel = {
  labelCol: { span: 4 },
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 0 },
  },
};

export const AddProxyComponent: React.FC<Props> = ({
  type,
  confirmLoading,
  isOpen,
  setIsOpen,
  choosedProxy,
  functionAdd,
  functionEdit,
}) => {
  const initialValues =
    type === "edit"
      ? { ...choosedProxy, port: Number(choosedProxy.port) }
      : {
          name: "",
          ip_address: "",
          port: "",
          note: "",
          username: "",
          password: "",
        };
  const [form] = Form.useForm<Record<string, any>>();

  function handleCancel() {
    setIsOpen(false);
  }
  async function handleAdd() {
    form
      .validateFields()
      .then((values) => {
        const data = removeWhitespaceInStartAndEndOfString(values);

        functionAdd(data);
      })
      .catch();
  }

  async function handleEdit() {
    form
      .validateFields()
      .then((values) => {
        const data = removeWhitespaceInStartAndEndOfString(values);
        functionEdit({ ...initialValues, ...data });
      })
      .catch();
  }

  return (
    <Modal
      title={(type === "add" ? "Thêm mới " : "Sửa ") + "proxy"}
      open={isOpen}
      destroyOnClose
      confirmLoading={confirmLoading}
      onOk={type === "add" ? handleAdd : handleEdit}
      onCancel={handleCancel}
      width={700}
      closable={false}
      maskClosable={false}
    >
      <Form
        initialValues={initialValues ?? {}}
        form={form}
        {...formItemLayoutWithOutLabel}
        preserve={false}
      >
        <Form.Item
          label={"Tên proxy"}
          name={"name"}
          validateTrigger={["onChange", "onBlur"]}
          rules={[
            {
              required: true,
              message: "Hãy nhập vào tên proxy!",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          validateTrigger={["onChange", "onBlur"]}
          label="Địa chỉ IP"
          name={"ip_address"}
          rules={[
            {
              required: true,
              message: "Hãy nhập vào địa chỉ IP!(VD: 192.168.1.1)",
              pattern: new RegExp(
                "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])[.]){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$",
              ),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          validateTrigger={["onChange", "onBlur"]}
          label="Cổng (port)"
          name={"port"}
          validateFirst={true}
          rules={[
            {
              required: true,
              message: "Hãy nhập vào tên cổng(từ 1-65535)!",
              whitespace: true,
              min: 1,
              max: 65535,
              type: "number",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          validateTrigger={["onChange", "onBlur"]}
          rules={[
            {
              required: true,
              message: "Hãy nhập vào tên đăng nhập!",
              whitespace: true,
            },
          ]}
          label="Tên đăng nhập"
          name={"username"}
        >
          <Input />
        </Form.Item>
        <Form.Item
          validateTrigger={["onChange", "onBlur"]}
          rules={[
            {
              required: true,
              message: "Hãy nhập vào mật khẩu!",
              whitespace: true,
            },
          ]}
          label="Mật khẩu"
          name={"password"}
        >
          <Input />
        </Form.Item>
        <Form.Item validateTrigger={["onChange", "onBlur"]} label="Ghi chú" name={"note"}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
