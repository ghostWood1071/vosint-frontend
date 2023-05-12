import { removeWhitespaceInStartAndEndOfString } from "@/utils/tool-validate-string";
import { DeleteOutlined } from "@ant-design/icons";
import { DatePicker, Form, Input, Modal, Table, TableColumnsType, Tooltip } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import styles from "./edit-event.module.less";

const dateFormat = "DD/MM/YYYY";

const formItemLayoutWithOutLabel = {
  labelCol: { span: 4 },
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 0 },
  },
};

interface ModalEditProps {
  confirmLoading?: boolean;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  choosedEvent: any;
  functionEdit: (value: any) => void;
  typeModal: string;
  functionDelete: (value: string) => void;
}

export const EditEventModal: React.FC<ModalEditProps> = ({
  confirmLoading,
  isOpen,
  setIsOpen,
  choosedEvent,
  functionEdit,
  typeModal,
  functionDelete,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listEvent, setListEvent] = useState<any[]>([]);

  const initialValues =
    typeModal === "edit"
      ? {
          ...choosedEvent,
          date_created: moment(choosedEvent.date_created, dateFormat),
        }
      : {};

  const [form] = Form.useForm<Record<string, any>>();

  const columnsNewsTable: TableColumnsType<any> = [
    {
      title: "Tiêu đề tin",
      align: "left",
      dataIndex: "data:title",
    },
    {
      title: "",
      width: 50,
      align: "center",
      render: (element) => {
        return (
          <Tooltip title={"Xoá"}>
            <DeleteOutlined
              onClick={() => handleDeleteItemList(element)}
              className={styles.delete}
            />
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Modal
      title={"Sửa sự kiện"}
      open={isOpen}
      destroyOnClose
      confirmLoading={confirmLoading}
      onOk={handleClickEdit}
      onCancel={handleCancel}
      width={800}
      okText={"Sửa"}
      getContainer="#modal-mount"
      closable={false}
      maskClosable={false}
    >
      <Form
        initialValues={initialValues}
        form={form}
        {...formItemLayoutWithOutLabel}
        preserve={false}
      >
        <Form.Item
          label={"Tên sự kiện"}
          name={"event_name"}
          validateTrigger={["onChange", "onBlur"]}
          rules={[
            {
              required: true,
              message: "Hãy nhập vào tên sự kiện!",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          validateTrigger={["onChange", "onBlur"]}
          label="Nội dung sự kiện"
          name={"event_content"}
        >
          <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} />
        </Form.Item>
        <Form.Item validateTrigger={["onChange", "onBlur"]} label="Khách thể" name={"khach_the"}>
          <Input />
        </Form.Item>
        <Form.Item validateTrigger={["onChange", "onBlur"]} label="Chủ thể" name={"chu_the"}>
          <Input />
        </Form.Item>
        <Form.Item
          validateTrigger={["onChange", "onBlur"]}
          label="Ngày sự kiện"
          name={"date_created"}
          rules={[{ type: "object" as const, required: true, message: "Hãy nhập vào thời gian!" }]}
        >
          <DatePicker format={"DD/MM/YYYY"} />
        </Form.Item>
        {/* <Form.Item validateTrigger={["onChange", "onBlur"]} label="Danh sách tin" name={"news"}>
          <Table
            columns={columnsNewsTable}
            dataSource={listNewsAdd}
            rowKey="_id"
            pagination={false}
          />
        </Form.Item> */}
      </Form>
    </Modal>
  );

  function handleCancel() {
    setIsOpen(false);
  }

  function handleClickEdit() {
    form
      .validateFields()
      .then((values) => {
        values.date_created = values.date_created.format("DD/MM/YYYY");
        const data = removeWhitespaceInStartAndEndOfString(values);
        functionEdit({
          ...initialValues,
          ...data,
        });
      })
      .catch();
  }
  function addNews() {}

  function handleSearchNews(value: any) {
    setSearchParams({
      text_search_news: value.trim(),
    });
  }
  function handleDeleteItemList(value: any) {
    const result = listEvent.filter((e: any) => e._id !== value._id);
    setListEvent(result);
  }
};
