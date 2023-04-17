import { EventEditorParagraph } from "@/components/editor/plugins/event-plugin/event-component";
import { useEventContext } from "@/components/editor/plugins/event-plugin/event-context";
import { CaretRightOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
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
import { LexicalEditor, createEditor } from "lexical";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  useAllEventNewsList,
  useEventByIdNewsList,
  useMutationAddManyEvent,
  useMutationEventNews,
} from "../news.loader";
import styles from "./mindmap-modal.module.less";

dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";

interface props {
  item: any;
  isVisible: boolean;
  setHideModal: (value: any) => void;
}

const formItemLayoutWithOutLabel = {
  labelCol: { span: 4 },
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 0 },
  },
};

const defaultName = `{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}`;
const defaultContent = `{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}`;

export const MindmapModal: React.FC<props> = ({ item, isVisible, setHideModal }) => {
  const [isAddEventView, setIsAddEventView] = useState(false);
  const [listEvent, setListEvent] = useState<any[]>([]);
  const [valueEventSelect, setValueEventSelect] = useState<any>({});
  const [valueNewsSelect, setValueNewsSelect] = useState<any>({});
  const [choosedEvent, setChoosedEvent] = useState<any>({ start_date: "10/10/2022" });
  const [isOpenModalEditEvent, setIsOpenModalEditEvent] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [eventName, setEventName] = useState(defaultName);
  const [eventContent, setEventContent] = useState(defaultContent);
  const [listNewsAdd, setListNewsAdd] = useState<any[]>([
    { _id: item._id, "data:title": item["data:title"] },
  ]);
  const { data: dataFilterByID } = useEventByIdNewsList(item._id);
  const { data: dataAllEventNews } = useAllEventNewsList({
    event_name: searchParams.get("text_search_event") ?? "",
    skip: "1",
    limit: "20",
    id_new: item._id,
  });
  const { mutate: mutateOneEvent } = useMutationEventNews();
  const { mutate: mutateManyEvent } = useMutationAddManyEvent();

  const [form] = Form.useForm<Record<string, any>>();

  const [editor] = useLexicalComposerContext();
  const { eventEditorConfig } = useEventContext();
  const eventEditor = useMemo(() => {
    if (eventEditorConfig === null) return null;

    const _eventEditor = createEditor({
      namespace: eventEditorConfig?.namespace,
      nodes: eventEditorConfig?.nodes,
      onError: (error) => eventEditorConfig?.onError(error, editor),
      theme: eventEditorConfig?.theme,
    });
    return _eventEditor;
  }, [eventEditorConfig]);

  if (eventEditor === null) return null;

  const columnsEventTable: TableColumnsType<any> = [
    {
      title: "Tên sự kiện",
      align: "left",
      dataIndex: "event_name",
      render: (value) => (
        <div
          dangerouslySetInnerHTML={{
            __html: generateHTMLFromJSON(value, eventEditor),
          }}
        />
      ),
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
        if (element._id !== item._id) {
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
              rules={[{}]}
            >
              <EventEditorParagraph data={defaultName} setData={setEventName} />
            </Form.Item>
            <Form.Item
              validateTrigger={["onChange", "onBlur"]}
              label="Nội dung sự kiện"
              name={"event_content"}
            >
              {/* <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} /> */}
              <EventEditorParagraph data={defaultContent} setData={setEventContent} />
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
                    <PlusOutlined className={styles.plus} />
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
            <div className={styles.addButtonContainer}>
              <Button type="primary" className={styles.addButton} onClick={addOneEvent}>
                Thêm sự kiện
              </Button>
            </div>
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
                  return (
                    <Select.Option value={d._id}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: generateHTMLFromJSON(d.event_name, eventEditor),
                        }}
                      />
                    </Select.Option>
                  );
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
          <div className={styles.addButtonContainer}>
            <Button type="primary" className={styles.addButton} onClick={addManyEvent}>
              Thêm sự kiện
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={
        <Row align={"middle"}>
          <Col span={24}>
            <h2 style={{ textAlign: "center" }}>Mind map</h2>
          </Col>
        </Row>
      }
      open={isVisible}
      destroyOnClose
      onCancel={() => setHideModal(false)}
      width={"90%"}
      getContainer="#modal-mount"
      maskClosable={false}
      footer={null}
    >
      <Row>
        <Col span={12}>
          <div className={styles.leftHeader}>Nội dung</div>
        </Col>
        <Col span={12}>
          <div className={styles.rightHeader}>
            <div className={styles.titleRightHeader}>Các sự kiện</div>
            <div className={styles.addEventButtonContainer}>
              {isAddEventView ? (
                <Button
                  onClick={handleChangeTypeBody}
                  type="primary"
                  className={styles.addEventButton}
                  key="button"
                >
                  Chi tiết các sự kiện
                </Button>
              ) : (
                <Button
                  onClick={handleChangeTypeBody}
                  type="primary"
                  className={styles.addEventButton}
                  icon={<PlusOutlined />}
                  key="button"
                >
                  Thêm sự kiện
                </Button>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <div className={styles.leftBody}>
            <div
              dangerouslySetInnerHTML={{ __html: item["data:html"] }}
              className={styles.detailContent}
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.rightBody}>
            {isAddEventView ? (
              <div className={styles.addEventContainer}>
                <Tabs defaultActiveKey="1" items={items} />
              </div>
            ) : (
              <div className={styles.detailAllEvent}>
                {dataFilterByID?.map((element: any) => {
                  return <Items key={element._id} item={element} handleEdit={handleClickEdit} />;
                })}
              </div>
            )}
          </div>
        </Col>
      </Row>
      {isOpenModalEditEvent ? (
        <ModalEdit
          choosedEvent={choosedEvent}
          functionEdit={handleUpdateEvent}
          isOpen={isOpenModalEditEvent}
          setIsOpen={setIsOpenModalEditEvent}
        />
      ) : null}
    </Modal>
  );

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

  function addNews() {}

  function handleClickEdit(value: any) {
    setChoosedEvent(value);
    setIsOpenModalEditEvent(true);
  }

  function handleChangeTypeBody() {
    setIsAddEventView(!isAddEventView);
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
  function handleSearchNews(value: any) {
    setSearchParams({
      text_search_news: value.trim(),
    });
  }
  function handleChangeNewsSelect(newValue: object) {
    setValueNewsSelect(newValue);
  }

  function handleChangeEvent(newValue: object) {
    setValueEventSelect(newValue);
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

  function addOneEvent() {
    form
      .validateFields()
      .then((values) => {
        if (values.date_created === undefined || values.date_created === null) {
          values.date_created = "";
        } else {
          values.date_created = values.date_created.format("DD/MM/YYYY");
        }
        values["system_created"] = false;
        values["event_name"] = eventName;
        values["event_content"] = eventContent;
        values["new_list"] = listNewsAdd.map((e) => e._id);
        mutateOneEvent(
          {
            data: values,
            action: "add",
          },
          {
            onSuccess: () => {
              setIsAddEventView(false);
            },
          },
        );
      })
      .catch();
  }

  function handleUpdateEvent(value: any) {
    console.log(value);
    mutateOneEvent({ data: value, _id: choosedEvent._id, action: "update" });
  }

  function addManyEvent() {
    const allEventAdd = listEvent.map((e) => e._id);
    mutateManyEvent(
      {
        action: "add",
        id: item._id,
        data: allEventAdd,
      },
      {
        onSuccess: () => {
          setListEvent([]);
          setIsAddEventView(false);
        },
      },
    );
  }
};

interface ItemsProps {
  item: any;
  handleEdit: (value: any) => void;
}

const Items: React.FC<ItemsProps> = ({ item, handleEdit }) => {
  const [editor] = useLexicalComposerContext();
  const { eventEditorConfig } = useEventContext();
  const eventEditor = useMemo(() => {
    if (eventEditorConfig === null) return null;

    const _eventEditor = createEditor({
      namespace: eventEditorConfig?.namespace,
      nodes: eventEditorConfig?.nodes,
      onError: (error) => eventEditorConfig?.onError(error, editor),
      theme: eventEditorConfig?.theme,
    });
    return _eventEditor;
  }, [eventEditorConfig]);

  if (eventEditor === null) return null;

  return (
    <div className={styles.itemContainer} key={item._id}>
      <div className={styles.collapseContainer}>
        <Collapse
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          defaultActiveKey={["0"]}
          ghost
        >
          <Collapse.Panel
            header={
              <div
                dangerouslySetInnerHTML={{
                  __html: generateHTMLFromJSON(item.event_name, eventEditor),
                }}
              />
            }
            key="1"
          >
            <div className={styles.itemContentContainer}>
              <Row gutter={[0, 5]}>
                <Col span={6}>Nội dung</Col>
                <Col span={1}>:</Col>
                <Col span={17}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: generateHTMLFromJSON(item.event_content, eventEditor),
                    }}
                  />
                </Col>
                <Col span={6}>Khách thể</Col>
                <Col span={1}>:</Col>
                <Col span={17}>{item.khach_the}</Col>
                <Col span={6}>Chủ thể"</Col>
                <Col span={1}>:</Col>
                <Col span={17}>{item.chu_the}</Col>
                <Col span={6}>Ngày sự kiện</Col>
                <Col span={1}>:</Col>
                <Col span={17}>{item.date_created}</Col>
              </Row>
            </div>
          </Collapse.Panel>
        </Collapse>
      </div>
      <div className={styles.editContainer}>
        <Space>
          <Tooltip title={"Chỉnh sửa"}>
            <EditOutlined
              onClick={() => {
                handleEdit(item);
              }}
              className={styles.delete}
            />
          </Tooltip>
        </Space>
      </div>
    </div>
  );
};

interface ModalEditProps {
  confirmLoading?: boolean;
  isOpen: boolean;
  setIsOpen: (value: any) => void;
  choosedEvent: any;
  functionEdit: (value: any) => void;
}

const ModalEdit: React.FC<ModalEditProps> = ({
  confirmLoading,
  isOpen,
  setIsOpen,
  choosedEvent,
  functionEdit,
}) => {
  const [dataTableNews, setDataTableNews] = useState();
  const [eventName, setEventName] = useState(choosedEvent.event_name);
  const [eventContent, setEventContent] = useState(choosedEvent.event_content);
  const initialValues = {
    ...choosedEvent,
    date_created: moment(choosedEvent.date_created, dateFormat),
  };

  const [form] = Form.useForm<Record<string, any>>();

  function handleCancel() {
    setIsOpen(false);
  }

  async function handleClickEdit() {
    form
      .validateFields()
      .then((values) => {
        values.date_created = values.date_created.format("DD/MM/YYYY");
        functionEdit({
          ...initialValues,
          ...values,
          event_name: eventName,
          event_content: eventContent,
        });
        setIsOpen(false);
      })
      .catch();
  }

  if (!choosedEvent.event_name && !choosedEvent.event_content) return null;

  return (
    <Modal
      title={"Sửa sự kiện"}
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
        >
          <EventEditorParagraph data={choosedEvent.event_name} setData={setEventName} />
        </Form.Item>
        <Form.Item
          validateTrigger={["onChange", "onBlur"]}
          label="Nội dung sự kiện"
          name={"event_content"}
        >
          {/* <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} /> */}
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
};

export const eventHTMLCache: Map<string, string> = new Map();

function generateHTMLFromJSON(editorStateJSON: string, eventEditor: LexicalEditor): string {
  const editorState = eventEditor.parseEditorState(editorStateJSON);
  let html = eventHTMLCache.get(editorStateJSON);
  if (html === undefined) {
    html = editorState.read(() => $generateHtmlFromNodes(eventEditor, null));
    eventHTMLCache.set(editorStateJSON, html);
  }
  return html;
}
