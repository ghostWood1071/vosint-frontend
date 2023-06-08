import {
  convertTimeToShowInUI,
  removeWhitespaceInStartAndEndOfString,
} from "@/utils/tool-validate-string";
import { DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  TableColumnsType,
  Tabs,
  TabsProps,
  Tooltip,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useAllEventNewsList } from "../news.loader";
import styles from "./add-mindmap.module.less";

dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";

const formItemLayoutWithOutLabel = {
  labelCol: { span: 4 },
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 0 },
  },
};

interface SelectCustomProps {
  value: string;
  label: string;
}

interface ModalEditProps {
  confirmLoading?: boolean;
  isOpen: boolean;
  setIsOpen: (value: any) => void;
  choosedEvent: any;
  functionEdit: (value: any) => void;
  typeModal: string;
  functionDelete: (value: any) => void;
  newsItem: any;
  functionAddOneEvent: (value: any) => void;
  functionAddManyEvent: (value: any) => void;
}

export const AddMindmap: React.FC<ModalEditProps> = ({
  confirmLoading,
  isOpen,
  setIsOpen,
  choosedEvent,
  functionEdit,
  typeModal,
  functionDelete,
  newsItem,
  functionAddOneEvent,
  functionAddManyEvent,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [valueEventSelect, setValueEventSelect] = useState<SelectCustomProps>({
    value: "",
    label: "",
  });
  const [valueNewsSelect, setValueNewsSelect] = useState<SelectCustomProps>({
    value: "",
    label: "",
  });
  const [listEvent, setListEvent] = useState<any[]>([]);
  const [listNewsAdd, setListNewsAdd] = useState<any[]>([
    { _id: newsItem._id, "data:title": newsItem["data:title"], "data:url": newsItem["data:url"] },
  ]);
  const { data: dataAllEventNews } = useAllEventNewsList({
    event_name: searchParams.get("text_search_event") ?? "",
    skip: 1,
    limit: 50,
    id_new: newsItem._id,
  });

  const initialValues =
    typeModal === "edit"
      ? {
          ...choosedEvent,
          date_created: moment(convertTimeToShowInUI(choosedEvent.date_created), dateFormat),
        }
      : {};

  const [form] = Form.useForm<Record<string, any>>();

  const columnsNewsTable: TableColumnsType<any> = [
    {
      title: "Tiêu đề tin",
      align: "left",
      key: "title",
      // dataIndex: "data:title",
      render: (element) => {
        return (
          <Typography.Link href={element["data:url"]} target="_blank" rel="noreferrer">
            {element["data:title"]}
          </Typography.Link>
        );
      },
    },
    {
      title: "",
      width: 50,
      align: "center",
      key: "button",
      render: (element) => {
        return (
          <Space>
            <Tooltip title={"Xoá"}>
              <DeleteOutlined
                onClick={() => handleDeleteNewsAddItem(element._id)}
                className={styles.delete}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <Modal
      title={(typeModal === "add" ? "Thêm" : "Sửa") + " sự kiện"}
      open={isOpen}
      destroyOnClose
      confirmLoading={confirmLoading}
      onOk={handleClickEdit}
      onCancel={handleCancel}
      width={800}
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
            <div className={styles.addExistEventHeader}>
              <div className={styles.leftAddExistNewsContainer}>
                <Select
                  showSearch
                  className={styles.newsEventSelect}
                  value={valueNewsSelect}
                  placeholder={"Nhập tiêu đề tin"}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onSearch={handleSearchNews}
                  onChange={handleChangeNewsSelect}
                  notFoundContent={null}
                  // options={(dataNews?.data || []).map((d: any) => ({
                  //   value: d._id,
                  //   label: d.event_name,
                  // }))}
                />
              </div>
              <div className={styles.rightAddExistNewsContainer}>
                <Button type="primary" className={styles.addButton} onClick={addNews}>
                  Thêm
                </Button>
              </div>
            </div>
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

  function openNotification(placement: any, type: any) {
    if (type === "invalid") {
      message.error({
        content: "Sự kiện không tồn tại.",
      });
    }
    if (type === "exited") {
      message.error({
        content: "Sự kiện đã được thêm vào danh sách.",
      });
    }
  }

  function handleSearchNews(value: any) {
    setSearchParams({
      text_search_news: value.trim(),
    });
  }
  function handleChangeNewsSelect(newValue: SelectCustomProps) {
    setValueNewsSelect(newValue);
  }

  function handleDeleteItemList(value: any) {
    const result = listEvent.filter((e: any) => e._id !== value._id);
    setListEvent(result);
  }

  function handleDeleteNewsAddItem(id: string) {
    const result = listNewsAdd.filter((e: any) => e._id !== id);
    setListNewsAdd(result);
  }

  function handleSearchEvent(value: any) {
    setSearchParams({
      text_search_event: value.trim(),
    });
  }

  function handleChangeEvent(newValue: SelectCustomProps) {
    setValueEventSelect(newValue);
  }
};
