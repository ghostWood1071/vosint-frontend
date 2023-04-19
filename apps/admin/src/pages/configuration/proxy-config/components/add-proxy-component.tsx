import { Form, Input, InputNumber, Modal } from "antd";
import React from "react";

import styles from "./add-proxy-component.module.less";

interface Props {
  type: string;
  confirmLoading?: boolean;
  isOpen: boolean;
  setIsOpen: (value: any) => void;
  choosedProxy: any;
  functionAdd: (value: any) => void;
  functionEdit: (value: any) => void;
  functionDelete: (value: any) => void;
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
  functionDelete,
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

  function handleDelete() {
    functionDelete({ _id: choosedProxy._id });
    setIsOpen(false);
  }
  function handleCancel() {
    setIsOpen(false);
  }
  async function handleAdd() {
    form
      .validateFields()
      .then((values) => {
        if (typeof values["username"] === "string") {
          values["username"] = values["username"].trim();
        }
        if (typeof values["name"] === "string") {
          values["name"] = values["name"].trim();
        }
        if (typeof values["password"] === "string") {
          values["password"] = values["password"].trim();
        }
        functionAdd(values);
      })
      .catch();
  }

  async function handleEdit() {
    form
      .validateFields()
      .then((values) => {
        if (typeof values["username"] === "string") {
          values["username"] = values["username"].trim();
        }
        if (typeof values["name"] === "string") {
          values["name"] = values["name"].trim();
        }
        if (typeof values["password"] === "string") {
          values["password"] = values["password"].trim();
        }
        functionEdit({ ...initialValues, ...values });
      })
      .catch();
  }

  if (type === "delete") {
    return (
      <Modal
        title={"Xoá proxy"}
        open={isOpen}
        destroyOnClose
        confirmLoading={confirmLoading}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText={"Xoá"}
        closable={false}
        maskClosable={false}
      >
        <div className={styles.deleteBodyContainer}>
          <div className={styles.leftDeleteBody}>Tên proxy:</div>
          <div className={styles.rightDeleteBody}>{choosedProxy.name}</div>
        </div>
      </Modal>
    );
  }
  if (type === "add" || type === "edit") {
    return (
      <Modal
        title={(type === "add" ? "Thêm mới " : "Sửa ") + "proxy"}
        open={isOpen}
        destroyOnClose
        confirmLoading={confirmLoading}
        onOk={type === "add" ? handleAdd : handleEdit}
        onCancel={handleCancel}
        width={800}
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
          <Form.Item validateTrigger={["onChange", "onBlur"]} label="Username" name={"username"}>
            <Input />
          </Form.Item>
          <Form.Item validateTrigger={["onChange", "onBlur"]} label="Password" name={"password"}>
            <Input />
          </Form.Item>
          <Form.Item validateTrigger={["onChange", "onBlur"]} label="Ghi chú" name={"note"}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  return null;
};
