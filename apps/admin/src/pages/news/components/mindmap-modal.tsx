import { ReportIcon } from "@/assets/svg";
import {
  convertTimeToShowInUI,
  removeWhitespaceInStartAndEndOfString,
} from "@/utils/tool-validate-string";
import {
  CaretRightOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  PlusOutlined,
  TranslationOutlined,
} from "@ant-design/icons";
import {
  Button,
  Collapse,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Skeleton,
  Space,
  Table,
  TableColumnsType,
  Tabs,
  TabsProps,
  Tooltip,
  Typography,
  message,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  useAllEventNewsList,
  useEventByIdNewsList,
  useMutationAddManyEvent,
  useMutationEventNews,
} from "../news.loader";
import { AddMindmap } from "./add-mindmap";
import styles from "./mindmap-modal.module.less";
import { ReportModal } from "./report-modal";
import { useReportModalState } from "./report-modal/index.state";

interface props {
  item: any;
  isVisible: boolean;
  setHideModal: (value: any) => void;
  isTranslation: boolean;
  isGettingData: boolean;
  handleClickTranslation: () => void;
}

interface SelectCustomProps {
  value: string;
  label: string;
}

const formItemLayoutWithOutLabel = {
  labelCol: { span: 4 },
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 0 },
  },
};

export const MindmapModal: React.FC<props> = ({
  item,
  isVisible,
  setHideModal,
  isTranslation,
  handleClickTranslation,
  isGettingData,
}) => {
  const [choosedEvent, setChoosedEvent] = useState<any>();
  const [isOpenModalEditEvent, setIsOpenModalEditEvent] = useState<boolean>(false);
  const [typeModal, setTypeModal] = useState("edit");
  const { data: dataFilterByID } = useEventByIdNewsList(item._id);
  const [isAddingEvent, setIsAddingEvent] = useState<boolean>(false);
  const [dataEventFromUser, setDataEventFromUser] = useState<any[]>();
  const [dataEventFromSystem, setDataEventFromSystem] = useState<any[]>();
  const { mutate: mutateOneEvent } = useMutationEventNews();
  const { mutate: mutateManyEvent } = useMutationAddManyEvent();
  const [form] = Form.useForm<Record<string, any>>();
  const [valueEventSelect, setValueEventSelect] = useState<SelectCustomProps>({
    value: "",
    label: "",
  });
  const [valueNewsSelect, setValueNewsSelect] = useState<SelectCustomProps>({
    value: "",
    label: "",
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [listNewsAdd, setListNewsAdd] = useState<any[]>([
    { _id: item._id, "data:title": item["data:title"], "data:url": item["data:url"] },
  ]);
  const [listEvent, setListEvent] = useState<any[]>([]);
  const [keyTabs, setKeyTabs] = useState<string>("1");

  const { data: dataAllEventNews } = useAllEventNewsList({
    event_name: searchParams.get("text_search_event") ?? "",
    skip: 1,
    limit: 50,
    id_new: item._id,
  });

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
      render: (item) => {
        return <>{convertTimeToShowInUI(item)}</>;
      },
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
              <Input.TextArea autoSize={{ minRows: 1, maxRows: 10 }} />
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
          <div className={styles.addButtonContainer}>
            <Button type="primary" className={styles.addButton} onClick={addManyEvent}>
              Thêm các sự kiện
            </Button>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    let dataBridgeEventFromUser: any[] = [];
    let dataBridgeEventFromSystem: any[] = [];
    dataFilterByID?.forEach((element: any) => {
      if (element?.system_created === false) {
        dataBridgeEventFromUser.push(element);
      } else {
        dataBridgeEventFromSystem.push(element);
      }
    });
    setDataEventFromUser(dataBridgeEventFromUser);
    setDataEventFromSystem(dataBridgeEventFromSystem);
  }, [dataFilterByID]);

  return (
    <Modal
      title={
        <div style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}>
          {isTranslation && item["data:title_translate"]?.length > 1
            ? item["data:title_translate"]
            : item["data:title"]}
        </div>
      }
      open={isVisible}
      destroyOnClose
      onCancel={() => setHideModal(false)}
      width={"90%"}
      getContainer="#modal-mount"
      footer={null}
      maskClosable={false}
      className={styles.modal}
    >
      <div className={styles.bodyModal}>
        <div className={styles.leftBody}>
          <div className={styles.leftHeader}>
            <div
              className={
                isTranslation ? styles.titleLeftHeaderWithTranslation : styles.titleLeftHeader
              }
              onClick={(event) => {
                event.stopPropagation();
                if (!isGettingData) {
                  handleClickTranslation();
                }
              }}
            >
              {isGettingData ? (
                <Button className={styles.loadingButton} loading={true} />
              ) : (
                <TranslationOutlined
                  className={
                    isTranslation ? styles.choosedIconFilterContent : styles.iconFilterContent
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    handleClickTranslation();
                  }}
                />
              )}{" "}
              {isTranslation ? "Nội dung đã dịch" : "Nội dung nguồn"}
            </div>
          </div>
          <div className={styles.leftContent}>
            {isTranslation ? (
              isGettingData ? (
                <Skeleton className={styles.skeleton} active />
              ) : (
                <div
                  dangerouslySetInnerHTML={{ __html: item["data:content_translate"] }}
                  className={styles.detailContent}
                  onClick={(event) => event.stopPropagation()}
                />
              )
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: item["data:html"] }}
                className={styles.detailContent}
                onClick={(event) => event.stopPropagation()}
              />
            )}
          </div>
        </div>
        <div className={styles.rightBody}>
          <div className={styles.rightHeader}>
            <div className={styles.titleRightHeader}>Các sự kiện</div>
            <div className={styles.addEventButtonContainer}>
              <Button
                onClick={handleOpenModalAddEvent}
                type="primary"
                className={styles.addEventButton}
                icon={!isAddingEvent && <PlusOutlined />}
                key="button"
              >
                {isAddingEvent ? "Chi tiết các sự kiện" : "Thêm sự kiện"}
              </Button>
            </div>
          </div>
          {isAddingEvent ? (
            <div className={styles.rightContent} style={{ paddingInline: 10 }}>
              <Tabs onChange={onChangeTabs} defaultActiveKey="1" items={items} />
            </div>
          ) : (
            <div className={styles.rightContent}>
              <div className={styles.eventContainer}>
                <div className={styles.textHeader}>Sự kiện do người dùng tạo</div>
                <div className={styles.detailAllEvent}>
                  {dataEventFromUser?.map((element: any) => {
                    return (
                      <Items
                        key={element._id}
                        item={element}
                        handleEdit={handleClickEdit}
                        handleDelete={handleClickDelete}
                      />
                    );
                  })}
                </div>
              </div>
              <div className={styles.eventContainer} style={{ border: 0 }}>
                <div className={styles.textHeader}>Sự kiện do hệ thống tạo</div>
                <div className={styles.detailAllEvent}>
                  {dataEventFromSystem?.map((element: any) => {
                    return (
                      <Items
                        key={element._id}
                        item={element}
                        handleEdit={handleClickEdit}
                        handleDelete={handleClickDelete}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {isOpenModalEditEvent ? (
        <AddMindmap
          choosedEvent={choosedEvent}
          functionEdit={handleUpdateEvent}
          isOpen={isOpenModalEditEvent}
          setIsOpen={setIsOpenModalEditEvent}
          functionDelete={handleDeleteEvent}
          typeModal={typeModal}
          newsItem={item}
          functionAddManyEvent={handleAddManyEvent}
          functionAddOneEvent={handleAddOneEvent}
        />
      ) : null}
      <ReportModal />
    </Modal>
  );

  function addOneEvent() {
    form
      .validateFields()
      .then((values) => {
        values.date_created = values.date_created.format("DD/MM/YYYY");
        values["system_created"] = false;
        values["new_list"] = listNewsAdd.map((e) => e._id);
        const data = removeWhitespaceInStartAndEndOfString(values);
        handleAddOneEvent(data);
      })
      .catch();
  }

  function addManyEvent() {
    const allEventAdd = listEvent.map((e) => e._id);
    if (allEventAdd[0] !== undefined) {
      handleAddManyEvent(allEventAdd);
    } else {
      message.warning("Chưa có sự kiện nào để thêm!");
    }
  }

  function onChangeTabs(key: string) {
    setKeyTabs(key);
  }

  function handleDeleteItemList(value: any) {
    const result = listEvent.filter((e: any) => e._id !== value._id);
    setListEvent(result);
  }

  function handleSearchNews(value: any) {
    setSearchParams({
      text_search_news: value.trim(),
    });
  }

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

  function handleSearchEvent(value: any) {
    setSearchParams({
      text_search_event: value.trim(),
    });
  }

  function handleChangeEvent(newValue: SelectCustomProps) {
    setValueEventSelect(newValue);
  }

  function handleChangeNewsSelect(newValue: SelectCustomProps) {
    setValueNewsSelect(newValue);
  }

  function addNews() {}

  function handleDeleteNewsAddItem(id: string) {
    const result = listNewsAdd.filter((e: any) => e._id !== id);
    setListNewsAdd(result);
  }

  function handleClickEdit(value: any) {
    setChoosedEvent(value);
    setIsOpenModalEditEvent(true);
    setTypeModal("edit");
  }
  function handleClickDelete(value: any) {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xoá sự kiện này?",
      okText: "Xoá",
      cancelText: "Huỷ",
      onOk: () => {
        handleDeleteEvent({ _id: value._id });
      },
    });
  }

  function handleOpenModalAddEvent() {
    setIsAddingEvent(!isAddingEvent);
  }

  function handleUpdateEvent(value: any) {
    mutateOneEvent(
      { data: value, _id: choosedEvent._id, action: "update" },
      {
        onSuccess: () => {
          setIsOpenModalEditEvent(false);
        },
      },
    );
  }

  function handleDeleteEvent(value: any) {
    mutateOneEvent({ _id: item._id, data: [value._id], action: "delete" });
  }

  function handleAddOneEvent(values: any) {
    mutateOneEvent(
      {
        data: values,
        action: "add",
      },
      {
        onSuccess: () => {
          setIsAddingEvent(false);
          form.resetFields();
          setListNewsAdd([
            { _id: item._id, "data:title": item["data:title"], "data:url": item["data:url"] },
          ]);
        },
      },
    );
  }

  function handleAddManyEvent(value: any) {
    mutateManyEvent(
      {
        action: "add",
        id: item._id,
        data: value,
      },
      {
        onSuccess: () => {
          setIsAddingEvent(false);
          setListEvent([]);
        },
      },
    );
  }
};

interface ItemsProps {
  item: any;
  handleEdit: (value: any) => void;
  handleDelete: (value: any) => void;
}

const Items: React.FC<ItemsProps> = ({ item, handleEdit, handleDelete }) => {
  const setEvent = useReportModalState((state) => state.setEvent);
  const Ref = useRef<any>();

  return (
    <div className={styles.itemContainer} key={item._id} ref={Ref}>
      <div className={styles.collapseContainer}>
        <Collapse
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          ghost
          onChange={(value) => {
            if (value[0] === "1") {
              Ref?.current?.scrollIntoView();
            }
          }}
        >
          <Collapse.Panel header={item.event_name} key="1">
            <div className={styles.itemContentContainer}>
              <div className={styles.lineFieldContent}>
                <div className={styles.titleField}>Nội dung</div>
                <div className={styles.contentField}>
                  :{" "}
                  <Input.TextArea
                    bordered={false}
                    className={styles.textContent}
                    autoSize={{ minRows: 1, maxRows: 10 }}
                    value={item.event_content}
                    readOnly={true}
                  />
                </div>
              </div>
              <div className={styles.lineFieldContent}>
                <div className={styles.titleField}>Chủ thể"</div>
                <div className={styles.contentField}>: {item.chu_the}</div>
              </div>
              <div className={styles.lineFieldContent}>
                <div className={styles.titleField}>Khách thể</div>
                <div className={styles.contentField}>: {item.khach_the}</div>
              </div>
              <div className={styles.lineFieldContent}>
                <div className={styles.titleField}>Ngày sự kiện</div>
                <div className={styles.contentField}>
                  : {convertTimeToShowInUI(item.date_created)}
                </div>
              </div>
            </div>
          </Collapse.Panel>
        </Collapse>
      </div>
      <div className={styles.editContainer}>
        <FileTextOutlined
          onClick={handleOpenReport}
          title="Thêm sự kiện vào báo cáo"
          className={styles.reportIcon}
        />
        <EditOutlined
          onClick={() => {
            handleEdit(item);
          }}
          title={"Sửa sự kiện"}
          className={styles.edit}
        />
        <DeleteOutlined
          onClick={() => {
            handleDelete(item);
          }}
          title={"Xoá sự kiện"}
          className={styles.delete}
        />
      </div>
    </div>
  );

  function handleOpenReport() {
    setEvent([item]);
  }
};
