import { Form, Input, Modal } from "antd";
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
  const initialValues = type === "edit" ? choosedProxy : null;

  const [form] = Form.useForm<Record<string, any>>();

  function handleDelete() {
    functionDelete({ _id: choosedProxy._id });
    setIsOpen(false);
  }
  function handleCancel() {
    setIsOpen(false);
  }
  async function handleAdd() {
    var data = form.getFieldsValue();
    if (data.note === undefined) {
      data.note = "";
    }
    if (data.name === undefined || data.name === "") {
      form.submit();
      return;
    }
    if (data.ip_address === undefined || data.ip_address === "") {
      form.submit();
      return;
    }
    if (data.port === undefined || data.port === "") {
      form.submit();
      return;
    }
    const result = { ...data };
    functionAdd(result);
    setIsOpen(false);
  }

  async function handleEdit() {
    const data = form.getFieldsValue();
    if (data.note === undefined) {
      data.note = "";
    }
    if (data.name === undefined || data.name === "") {
      form.submit();
      return;
    }
    if (data.ip_address === undefined || data.ip_address === "") {
      form.submit();
      return;
    }
    if (data.port === undefined || data.port === "") {
      form.submit();
      return;
    }
    const result = { ...initialValues, ...data };
    functionEdit(result);
    setIsOpen(false);
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
            rules={[{ required: true, message: "Hãy nhập vào tên proxy!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            validateTrigger={["onChange", "onBlur"]}
            label="Địa chỉ IP"
            name={"ip_address"}
            rules={[{ required: true, message: "Hãy nhập vào địa chỉ IP!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            validateTrigger={["onChange", "onBlur"]}
            label="Cổng (port)"
            name={"port"}
            rules={[{ required: true, message: "Hãy nhập vào tên cổng!" }]}
          >
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
