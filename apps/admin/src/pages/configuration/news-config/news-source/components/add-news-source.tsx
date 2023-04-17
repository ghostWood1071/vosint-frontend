import { Form, Input, Modal, Select } from "antd";
import React from "react";

import styles from "./add-news-source.module.less";

interface Props {
  type: string;
  confirmLoading?: boolean;
  isOpen: boolean;
  setIsOpen: (value: any) => void;
  choosedNewsSource: any;
  functionAdd: (value: any) => void;
  functionEdit: (value: any) => void;
  functionDelete: (value: any) => void;
}

const formItemLayoutWithOutLabel = {
  labelCol: { span: 5 },
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 0 },
  },
};

export const AddNewsSourceComponent: React.FC<Props> = ({
  type,
  confirmLoading,
  isOpen,
  setIsOpen,
  choosedNewsSource,
  functionAdd,
  functionDelete,
  functionEdit,
}) => {
  const initialValues = type === "edit" ? choosedNewsSource : null;

  const [form] = Form.useForm<Record<string, any>>();

  function handleDelete() {
    functionDelete({ _id: choosedNewsSource._id });
    setIsOpen(false);
  }
  function handleCancel() {
    setIsOpen(false);
  }
  async function handleAdd() {
    form
      .validateFields()
      .then((values) => {
        functionAdd(values);
      })
      .catch();
  }

  async function handleEdit() {
    form
      .validateFields()
      .then((values) => {
        functionEdit({ ...initialValues, ...values });
      })
      .catch();
  }

  if (type === "delete") {
    return (
      <Modal
        title={"Xoá nguồn tin"}
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
          <div className={styles.leftDeleteBody}>Tên nguồn tin:</div>
          <div className={styles.rightDeleteBody}>{choosedNewsSource.name}</div>
        </div>
      </Modal>
    );
  }
  if (type === "add" || type === "edit") {
    return (
      <Modal
        title={(type === "add" ? "Thêm mới " : "Sửa ") + "nguồn tin"}
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
            label={"Tên nguồn tin"}
            name={"name"}
            validateTrigger={["onChange", "onBlur"]}
            rules={[
              {
                required: true,
                message: "Hãy nhập vào tên nguồn tin!",
                whitespace: true,
                pattern: new RegExp("[A-Za-z]{1}"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            validateTrigger={["onChange", "onBlur"]}
            label="Tên miền"
            name={"host_name"}
            rules={[
              {
                required: true,
                message: "Hãy nhập vào tên miền(VD: google.com)!",
                whitespace: true,
                pattern: new RegExp("^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\\.)+[A-Za-z]{2,6}$"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            validateTrigger={["onChange", "onBlur"]}
            label="Ngôn ngữ"
            name={"language"}
            rules={[
              {
                required: true,
                message: "Hãy nhập vào ngôn ngữ!",
                whitespace: true,
              },
            ]}
          >
            <Select>
              <Select.Option value="vi">Tiếng Việt</Select.Option>
              <Select.Option value="en">Tiếng Anh</Select.Option>
              <Select.Option value="cn">Tiếng Trung</Select.Option>
              <Select.Option value="ru">Tiếng Nga</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            validateTrigger={["onChange", "onBlur"]}
            label="Quốc gia xuất bản"
            name={"publishing_country"}
            rules={[
              {
                required: true,
                message: "Hãy nhập vào quốc gia xuất bản!",
                whitespace: true,
                pattern: new RegExp("[A-Za-z]{1}"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            validateTrigger={["onChange", "onBlur"]}
            label="Loại nguồn"
            name={"source_type"}
            rules={[
              {
                required: true,
                message: "Hãy nhập vào loại nguồn!",
                whitespace: true,
              },
            ]}
          >
            <Select>
              <Select.Option value="Báo điện tử">Báo điện tử</Select.Option>
              <Select.Option value="Báo chính thống">Báo chính thống</Select.Option>
              <Select.Option value="Blog cá nhân">Blog cá nhân</Select.Option>
              <Select.Option value="Báo phản động">Báo phản động</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  return null;
};
