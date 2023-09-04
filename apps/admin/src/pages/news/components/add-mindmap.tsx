import { EventEditorParagraph } from "@/components/editor/plugins/event-plugin/event-component";
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
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { debounce } from "lodash";
import moment from "moment";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useNewsListForSearchingInEvent } from "../news.loader";
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
}

export const AddMindmap: React.FC<ModalEditProps> = ({
  confirmLoading,
  isOpen,
  setIsOpen,
  choosedEvent,
  functionEdit,
  typeModal,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: dataNews } = useNewsListForSearchingInEvent({
    text_search: searchParams.get("text_search_news") ?? "",
  });

  const [form] = Form.useForm<Record<string, any>>();
  const [formNews] = Form.useForm<Record<string, any>>();

  const [valueNewsSelect, setValueNewsSelect] = useState<SelectCustomProps>({
    value: "",
    label: "",
  });
  const [eventContent, setEventContent] = useState(choosedEvent.event_content);
  const initialValues =
    typeModal === "edit"
      ? {
          ...choosedEvent,
          date_created: moment(convertTimeToShowInUI(choosedEvent.date_created), dateFormat),
        }
      : {};

  const [isShowedEnterFieldNews, setIsShowedEnterFieldNews] = useState(false);

  const [listNewsAddedByUser, setListNewsAddedByUser] = useState<any[]>(
    choosedEvent?.news_added_by_user ?? [],
  );
  const [listNewsFromServer, setListNewsFromServer] = useState<any[]>(choosedEvent?.new_list ?? []);
  const processChange = debounce((value: string) => {
    setSearchParams({
      text_search_news: value.trim(),
    });
  }, 500);

  const columnsNewsAddedByUser: TableColumnsType<any> = [
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

  const itemsChildTabs: TabsProps["items"] = [
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

  return (
    <Modal
      title={(typeModal === "add" ? "Thêm" : "Cập nhật") + " sự kiện"}
      open={isOpen}
      destroyOnClose
      confirmLoading={confirmLoading}
      onOk={handleClickEdit}
      onCancel={handleCancel}
      width={800}
      getContainer="#modal-mount"
      closable={false}
      maskClosable={false}
      className={styles.modal}
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
          <EventEditorParagraph data={choosedEvent.event_content} setData={setEventContent} />
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
          <DatePicker format={"DD/MM/YYYY"} inputReadOnly/>
        </Form.Item>
        <Form.Item validateTrigger={["onChange", "onBlur"]} label="Nguồn tin">
          <div>
            <Button
              type="primary"
              className={styles.addButton}
              onClick={() => {
                setIsShowedEnterFieldNews(!isShowedEnterFieldNews);
              }}
            >
              {isShowedEnterFieldNews ? "Đóng tin mẫu" : "Thêm"}
            </Button>
            {isShowedEnterFieldNews && <Tabs defaultActiveKey="1" items={itemsChildTabs} />}
          </div>
          <div className={styles.tableNewsContainer}>
            {listNewsAddedByUser?.length > 0 && (
              <Table
                columns={columnsNewsAddedByUser}
                dataSource={listNewsAddedByUser}
                rowKey="_id"
                pagination={false}
                size="small"
              />
            )}
            {listNewsFromServer?.length > 0 && (
              <Table
                columns={columnsNewsFromServer}
                dataSource={listNewsFromServer}
                rowKey="_id"
                pagination={false}
                size="small"
              />
            )}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );

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
  }

  function handleAddNews() {
    formNews.validateFields().then((values) => {
      values["id"] = new Date().getTime().toString();
      setListNewsAddedByUser([...listNewsAddedByUser, values]);
      formNews.resetFields();
    });
  }

  function handleDeleteItemNewsFromServer(value: any) {
    const result = listNewsFromServer.filter((e: any) => e._id !== value._id);
    setListNewsFromServer(result);
  }

  function handleDeleteItemNewsList(value: any) {
    const result = listNewsAddedByUser.filter((e: any) => e.id !== value.id);
    setListNewsAddedByUser(result);
  }

  function handleCancel() {
    setIsOpen(false);
  }

  function handleClickEdit() {
    form
      .validateFields()
      .then((values) => {
        values.date_created = values.date_created.format("DD/MM/YYYY");
        values.event_content = eventContent;
        values.new_list = listNewsFromServer.map((e) => e._id);
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

  function handleSearchNews(value: any) {
    processChange(value);
  }
  function handleChangeNewsSelect(newValue: SelectCustomProps) {
    setValueNewsSelect(newValue);
  }
};
