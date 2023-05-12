import { removeWhitespaceInStartAndEndOfString } from "@/utils/tool-validate-string";
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
  const [keyTabs, setKeyTabs] = useState<string>("1");
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
          date_created: moment(choosedEvent.date_created, dateFormat),
        }
      : {};

  const [form] = Form.useForm<Record<string, any>>();

  const columnsEventTable: TableColumnsType<any> = [
    {
      key: "event_name",
      title: "Tên sự kiện",
      align: "left",
      dataIndex: "event_name",
    },
    {
      key: "khach_the",
      title: "Khách thể",
      align: "left",
      dataIndex: "khach_the",
    },
    {
      key: "chu_the",
      title: "Chủ thể",
      align: "left",
      dataIndex: "chu_the",
    },
    {
      key: "date_created",
      title: "Ngày sự kiện",
      align: "left",
      width: 180,
      dataIndex: "date_created",
    },
    {
      key: "button",
      title: "",
      width: 50,
      align: "center",
      render: (item) => {
        return (
          <Space>
            <Tooltip title={"Xoá"}>
              <DeleteOutlined
                onClick={() => handleDeleteItemList(item)}
                className={styles.delete}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];
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

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Thêm sự kiện mới`,
      children: (
        <div className={styles.addNewEventContainer}>
          <Form
            initialValues={{
              event_name: "",
              event_content: "",
              khach_the: "",
              chu_the: "",
            }}
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
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
            <Form.Item
              validateTrigger={["onChange", "onBlur"]}
              label="Khách thể"
              name={"khach_the"}
            >
              <Input />
            </Form.Item>
            <Form.Item validateTrigger={["onChange", "onBlur"]} label="Chủ thể" name={"chu_the"}>
              <Input />
            </Form.Item>
            <Form.Item
              validateTrigger={["onChange", "onBlur"]}
              label="Ngày sự kiện"
              name={"date_created"}
              rules={[
                { type: "object" as const, required: true, message: "Hãy nhập vào thời gian!" },
              ]}
            >
              <DatePicker format={"DD/MM/YYYY"} />
            </Form.Item>
            <Form.Item validateTrigger={["onChange", "onBlur"]} label="Danh sách tin" name={"news"}>
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
                  <Button
                    disabled={valueNewsSelect?.value !== "" ? false : true}
                    type="primary"
                    className={styles.addButton}
                    onClick={addNews}
                  >
                    Thêm
                  </Button>
                </div>
              </div>
              {listNewsAdd.length > 0 && (
                <Table
                  columns={columnsNewsTable}
                  dataSource={listNewsAdd}
                  rowKey="_id"
                  pagination={false}
                  size="small"
                />
              )}
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: "2",
      label: `Thêm sự kiện đã tồn tại`,
      children: (
        <div className={styles.addExistEventContainer}>
          <div className={styles.addExistEventHeader}>
            <div className={styles.leftAddExistNewsContainer}>
              <Select
                showSearch
                className={styles.newsEventSelect}
                value={valueEventSelect}
                placeholder={"Nhập tên sự kiện"}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={handleSearchEvent}
                onChange={handleChangeEvent}
                notFoundContent={null}
              >
                {(dataAllEventNews?.data || []).map((d: any) => {
                  return <Select.Option value={d._id}>{d.event_name}</Select.Option>;
                })}
              </Select>
            </div>
            <div className={styles.rightAddExistNewsContainer}>
              <Button
                disabled={valueEventSelect?.value !== "" ? false : true}
                type="primary"
                className={styles.addButton}
                onClick={addEventToTable}
              >
                Thêm
              </Button>
            </div>
          </div>
          {listEvent.length > 0 ? (
            <Table
              columns={columnsEventTable}
              dataSource={listEvent}
              rowKey="id"
              pagination={false}
            />
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={(typeModal === "add" ? "Thêm" : "Sửa") + " sự kiện"}
      open={isOpen}
      destroyOnClose
      confirmLoading={confirmLoading}
      onOk={
        typeModal === "edit"
          ? handleClickEdit
          : keyTabs === "1"
          ? handleAddOneEvent
          : handleAddManyEvent
      }
      onCancel={handleCancel}
      width={800}
      getContainer="#modal-mount"
      closable={false}
      maskClosable={false}
    >
      {typeModal === "add" ? (
        <div className={styles.addEventContainer}>
          <Tabs onChange={onChangeTabs} defaultActiveKey="1" items={items} />
        </div>
      ) : (
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
            rules={[
              { type: "object" as const, required: true, message: "Hãy nhập vào thời gian!" },
            ]}
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
      )}
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
  function onChangeTabs(key: string) {
    setKeyTabs(key);
  }

  function handleSearchNews(value: any) {
    setSearchParams({
      text_search_news: value.trim(),
    });
  }
  function handleChangeNewsSelect(newValue: SelectCustomProps) {
    setValueNewsSelect(newValue);
  }

  function addEventToTable() {
    const itemEvent = dataAllEventNews.data.find((e: any) => e._id === valueEventSelect);
    if (itemEvent === undefined) {
      openNotification("top", "invalid");
      return;
    }
    const check = listEvent.findIndex((e: any) => e._id === itemEvent._id);
    if (check === -1) {
      setListEvent([
        ...listEvent,
        {
          _id: itemEvent._id,
          event_name: itemEvent.event_name,
          date_created: itemEvent.date_created,
        },
      ]);
      setValueEventSelect({ value: "", label: "" });
    } else {
      openNotification("top", "exited");
    }
  }
  function handleAddOneEvent() {
    form
      .validateFields()
      .then((values) => {
        values.date_created = values.date_created.format("DD/MM/YYYY");
        values["system_created"] = false;
        values["new_list"] = listNewsAdd.map((e) => e._id);
        const data = removeWhitespaceInStartAndEndOfString(values);
        functionAddOneEvent(data);
      })
      .catch();
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

  function handleAddManyEvent() {
    const allEventAdd = listEvent.map((e) => e._id);
    functionAddManyEvent(allEventAdd);
  }
};
