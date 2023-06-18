import { removeWhitespaceInStartAndEndOfString } from "@/utils/tool-validate-string";
import { Checkbox, Form, Input, Modal, Select } from "antd";
import React from "react";

interface Props {
  type: string;
  confirmLoading?: boolean;
  isOpen: boolean;
  setIsOpen: (value: any) => void;
  choosedNewsSource: any;
  functionAdd: (value: any) => void;
  functionEdit: (value: any) => void;
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
  functionEdit,
}) => {
  const initialValues = type === "edit" ? choosedNewsSource : null;

  const [form] = Form.useForm<Record<string, any>>();

  function handleCancel() {
    setIsOpen(false);
  }
  async function handleAdd() {
    form
      .validateFields()
      .then((values) => {
        const data = removeWhitespaceInStartAndEndOfString(values);
        if (data.event_detect === undefined) {
          data.event_detect = false;
        }
        functionAdd(data);
      })
      .catch();
  }

  async function handleEdit() {
    form
      .validateFields()
      .then((values) => {
        const data = removeWhitespaceInStartAndEndOfString(values);
        if (data.event_detect === undefined) {
          data.event_detect = false;
        }
        functionEdit({ ...initialValues, ...data });
      })
      .catch();
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
          <Form.Item label="Phát hiện sự kiện" name={"event_detect"} valuePropName="checked">
            <Checkbox></Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  return null;
};
