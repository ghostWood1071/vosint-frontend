import { EventEditorParagraph } from "@/components/editor/plugins/event-plugin/event-component";
import { useNewsListForSearchingInEvent } from "@/pages/news/news.loader";
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
  Table,
  TableColumnsType,
  Tabs,
  TabsProps,
  Typography,
  message,
} from "antd";
import { debounce } from "lodash";
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

interface SelectCustomProps {
  value: string;
  label: string;
}

interface ModalEditProps {
  confirmLoading?: boolean;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  choosedEvent: any;
  functionEdit: (value: any) => void;
  functionAdd: (value: any) => void;
  typeModal: string;
}

const defaultContent = `{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}`;

export const EditEventModal: React.FC<ModalEditProps> = ({
  confirmLoading,
  isOpen,
  setIsOpen,
  choosedEvent,
  functionEdit,
  typeModal,
  functionAdd,
}) => {
  const [listNewsAddedByUser, setListNewsAddedByUser] = useState<any[]>(
    typeModal === "add" ? [] : choosedEvent?.news_added_by_user ?? [],
  );

  const [listNewsFromServer, setListNewsFromServer] = useState<any[]>(
    typeModal === "add" ? [] : choosedEvent?.new_list ?? [],
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [eventContent, setEventContent] = useState(
    typeModal === "add" ? defaultContent : choosedEvent?.event_content,
  );
  const [isShowedEnterFieldNews, setIsShowedEnterFieldNews] = useState(false);
  const [valueNewsSelect, setValueNewsSelect] = useState<SelectCustomProps>({
    value: "",
    label: "",
  });
  const initialValues =
    typeModal === "edit"
      ? {
          ...choosedEvent,
          date_created: moment(convertTimeToShowInUI(choosedEvent.date_created), dateFormat),
        }
      : {};

  const [form] = Form.useForm<Record<string, any>>();
  const [formNews] = Form.useForm<Record<string, any>>();

  const { data: dataNews } = useNewsListForSearchingInEvent({
    text_search: searchParams.get("text_search_news") ?? "",
  });

  const columnsNewsTable: TableColumnsType<any> = [
    {
      title: "Tiêu đề tin",
      align: "left",
      render: (element) => {
        return (
          <Typography.Link href={element?.link} target="_blank" rel="noreferrer">
            {element.title}
          </Typography.Link>
        );
      },
    },
    {
      title: "",
      width: 50,
      align: "center",
      render: (element) => {
        return (
          <DeleteOutlined
            title={"Xoá tin"}
            onClick={() => handleDeleteItemNewsList(element)}
            className={styles.delete}
          />
        );
      },
    },
  ];

  const columnsNewsFromServer: TableColumnsType<any> = [
    {
      title: "Tiêu đề tin",
      align: "left",
      render: (element) => {
        return (
          <Typography.Link href={element?.["data:url"]} target="_blank" rel="noreferrer">
            {element["data:title"]}
          </Typography.Link>
        );
      },
    },
    {
      title: "",
      width: 50,
      align: "center",
      render: (element) => {
        return (
          <DeleteOutlined
            title={"Xoá tin"}
            onClick={() => handleDeleteItemNewsFromServer(element)}
            className={styles.delete}
          />
        );
      },
    },
  ];

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Tìm kiếm từ cơ sở dữ liệu`,
      children: (
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
              options={(dataNews?.result || []).map((d: any) => ({
                value: d._id,
                label: d["data:title"],
              }))}
            />
          </div>
          <div className={styles.rightAddExistNewsContainer}>
            <Button type="primary" className={styles.addButton} onClick={addNewsFromServer}>
              Thêm
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: `Tự nhập tin`,
      children: (
        <Form form={formNews} {...formItemLayoutWithOutLabel} preserve={false}>
          <Form.Item
            validateTrigger={["onChange", "onBlur"]}
            rules={[
              {
                required: true,
                message: "Hãy nhập vào tiêu đề tin!",
                whitespace: true,
              },
            ]}
            label="Tiêu đề"
            name={"title"}
          >
            <Input />
          </Form.Item>
          <Form.Item
            validateTrigger={["onChange", "onBlur"]}
            rules={[
              {
                required: true,
                message: "Hãy nhập vào đường dẫn tới tin!",
                whitespace: true,
              },
            ]}
            label="Đường dẫn"
            name={"link"}
          >
            <Input />
          </Form.Item>
          <div className={styles.addButtonContainer}>
            <Button type="primary" className={styles.addButton} onClick={handleAddNews}>
              Thêm
            </Button>
          </div>
        </Form>
      ),
    },
  ];

  const processChange = debounce((value: string) => {
    setSearchParams({
      text_search_news: value.trim(),
    });
  }, 500);
  return (
    <Modal
      title={typeModal === "add" ? "Thêm mới sự kiện" : "Cập nhật sự kiện"}
      open={isOpen}
      destroyOnClose
      confirmLoading={confirmLoading}
      onOk={typeModal === "add" ? handleClickAdd : handleClickEdit}
      onCancel={handleCancel}
      width={900}
      getContainer="#modal-mount"
      closable={false}
      maskClosable={false}
      className={styles.modal}
      okText={typeModal === "add" ? "Thêm" : "Cập nhật"}
      cancelText="Thoát"
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
        <Form.Item validateTrigger={["onChange", "onBlur"]} label="Nội dung" name={"event_content"}>
          {/* <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} /> */}
          <EventEditorParagraph
            data={typeModal === "add" ? defaultContent : choosedEvent?.event_content}
            setData={(value) => {
              setEventContent(value);
            }}
          />
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
        <Form.Item validateTrigger={["onChange", "onBlur"]} label="Nguồn tin" name={"news"}>
          <div>
            <Button type="primary" className={styles.addButton} onClick={handleShowEnterFieldNews}>
              {isShowedEnterFieldNews ? "Đóng" : "Thêm"}
            </Button>
            {isShowedEnterFieldNews && <Tabs defaultActiveKey="1" items={items} />}
          </div>
          <div className={styles.tableNewsContainer}>
            {listNewsAddedByUser.length > 0 && (
              <Table
                columns={columnsNewsTable}
                dataSource={listNewsAddedByUser}
                rowKey="id"
                pagination={false}
                showHeader={false}
                size="small"
              />
            )}
            {listNewsFromServer.length > 0 && (
              <Table
                columns={columnsNewsFromServer}
                dataSource={listNewsFromServer}
                rowKey="_id"
                pagination={false}
                size="small"
                showHeader={false}
              />
            )}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );

  function handleShowEnterFieldNews() {
    setIsShowedEnterFieldNews(!isShowedEnterFieldNews);
  }

  function handleAddNews() {
    formNews.validateFields().then((values) => {
      values["id"] = new Date().getTime().toString();
      setListNewsAddedByUser([...listNewsAddedByUser, values]);
      formNews.resetFields();
    });
  }

  function addNewsFromServer() {
    const indexNewsInTable = listNewsFromServer.findIndex((e) => e._id === valueNewsSelect);
    if (indexNewsInTable !== -1) {
      message.warning("Tin đã có trong bảng!");
      return;
    }

    const choosedNewsIndex = dataNews?.result.findIndex((e: any) => e._id === valueNewsSelect);
    const choosedNewsData = {
      _id: dataNews.result[choosedNewsIndex]._id,
      "data:title": dataNews?.result[choosedNewsIndex]["data:title"],
      "data:url": dataNews?.result[choosedNewsIndex]["data:url"],
    };
    setListNewsFromServer([...listNewsFromServer, choosedNewsData]);
    setValueNewsSelect({
      value: "",
      label: "",
    });
    setSearchParams({
      text_search_news: "",
    });
  }

  function handleCancel() {
    setIsOpen(false);
  }

  function handleSearchNews(value: any) {
    processChange(value);
  }

  function handleChangeNewsSelect(newValue: SelectCustomProps) {
    setValueNewsSelect(newValue);
  }

  function handleClickEdit() {
    form
      .validateFields()
      .then((values) => {
        values.date_created = values.date_created.format("DD/MM/YYYY");
        values.new_list = listNewsFromServer.map((e) => e._id);
        values.news_added_by_user = listNewsAddedByUser;
        values.event_content = eventContent;
        values.list_report = [];
        if (initialValues.list_report[0] !== undefined) {
          values.list_report = initialValues.list_report.map((e: any) => e._id);
        }

        const data = removeWhitespaceInStartAndEndOfString(values);
        functionEdit({
          ...initialValues,
          ...data,
        });
      })
      .catch();
  }

  function handleClickAdd() {
    form
      .validateFields()
      .then((values) => {
        values.date_created = values.date_created.format("DD/MM/YYYY");
        values.new_list = listNewsFromServer.map((e) => e._id);
        values.news_added_by_user = listNewsAddedByUser;
        values.event_content = eventContent;
        const data = removeWhitespaceInStartAndEndOfString(values);
        functionAdd({
          ...initialValues,
          ...data,
        });
      })
      .catch();
  }

  function handleDeleteItemNewsList(value: any) {
    const result = listNewsAddedByUser.filter((e: any) => e.id !== value.id);
    setListNewsAddedByUser(result);
  }

  function handleDeleteItemNewsFromServer(value: any) {
    const result = listNewsFromServer.filter((e: any) => e._id !== value._id);
    setListNewsFromServer(result);
  }
};
