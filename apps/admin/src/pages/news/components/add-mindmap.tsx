import { filterEmptyString } from "@/utils/api";
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
  const [valueEventSelect, setValueEventSelect] = useState<any>({});
  const [valueNewsSelect, setValueNewsSelect] = useState<any>({});
  const [listEvent, setListEvent] = useState<any[]>([]);
  const [keyTabs, setKeyTabs] = useState<string>("1");
  const [listNewsAdd, setListNewsAdd] = useState<any[]>([
    { _id: newsItem._id, "data:title": newsItem["data:title"] },
  ]);
  const { data: dataAllEventNews } = useAllEventNewsList({
    event_name: searchParams.get("text_search_event") ?? "",
    skip: "1",
    limit: "20",
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
      title: "Tên sự kiện",
      align: "left",
      dataIndex: "event_name",
      //   render: (value) => (
      //     <div
      //       dangerouslySetInnerHTML={{
      //         __html: generateHTMLFromJSON(value, eventEditor),
      //       }}
      //     />
      //   ),
    },
    {
      title: "Ngày sự kiện",
      align: "left",
      width: 180,
      dataIndex: "date_created",
    },
    {
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
      dataIndex: "data:title",
    },
    {
      title: "",
      width: 50,
      align: "center",
      render: (element) => {
        if (element._id !== newsItem._id) {
          return (
            <Space>
              <Tooltip title={"Xoá"}>
                <DeleteOutlined
                  onClick={() => handleDeleteItemList(element)}
                  className={styles.delete}
                />
              </Tooltip>
            </Space>
          );
        }
      },
    },
  ];

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Tạo sự kiện mới`,
      children: (
        <div className={styles.addNewEventContainer}>
          <Form
            initialValues={{
              event_name: "",
              event_content: "",
              khach_the: "",
              chu_the: "",
              date_created: moment("10/02/2023", dateFormat),
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
              <Button type="primary" className={styles.addButton} onClick={addEventToTable}>
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
  if (typeModal === "delete") {
    return (
      <Modal
        title={"Xoá sự kiện"}
        open={isOpen}
        destroyOnClose
        confirmLoading={confirmLoading}
        onOk={handleDelete}
        onCancel={handleCancel}
        getContainer="#modal-mount"
        okText={"Xoá"}
        closable={false}
        maskClosable={false}
      >
        <div className={styles.deleteBodyContainer}>
          <div className={styles.leftDeleteBody}>Tên sự kiện:</div>
          <div className={styles.rightDeleteBody}>{choosedEvent.event_name}</div>
        </div>
      </Modal>
    );
  }

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

  function handleDelete() {
    functionDelete({ _id: choosedEvent._id });
    setIsOpen(false);
  }

  function handleClickEdit() {
    form
      .validateFields()
      .then((values) => {
        values.date_created = values.date_created.format("DD/MM/YYYY");
        functionEdit({
          ...initialValues,
          ...values,
        });
        setIsOpen(false);
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
  function handleChangeNewsSelect(newValue: object) {
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
      setValueEventSelect(null);
    } else {
      openNotification("top", "exited");
    }
  }
  function handleAddOneEvent() {
    form
      .validateFields()
      .then((values) => {
        if (values.date_created === undefined || values.date_created === null) {
          values.date_created = "";
        } else {
          values.date_created = values.date_created.format("DD/MM/YYYY");
        }
        values["system_created"] = false;
        values["new_list"] = listNewsAdd.map((e) => e._id);
        console.log(values["event_content"]);
        functionAddOneEvent(values);
      })
      .catch();
  }

  function handleDeleteItemList(value: any) {
    const result = listEvent.filter((e: any) => e._id !== value._id);
    setListEvent(result);
  }

  function handleSearchEvent(value: any) {
    setSearchParams({
      text_search_event: value.trim(),
    });
  }

  function handleChangeEvent(newValue: object) {
    setValueEventSelect(newValue);
  }

  function handleAddManyEvent() {
    const allEventAdd = listEvent.map((e) => e._id);
    functionAddManyEvent(allEventAdd);
  }
};
