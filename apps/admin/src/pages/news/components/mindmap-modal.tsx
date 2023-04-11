import { CaretRightOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
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
  notification,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useEventByIdNewsList } from "../news.loader";
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

export const MindmapModal: React.FC<props> = ({ item, isVisible, setHideModal }) => {
  const [isAddEventView, setIsAddEventView] = useState(false);
  const [listEvent, setListEvent] = useState<any[]>([]);
  const [valueSelect, setValueSelect] = useState<any>({});
  const [choosedEvent, setChoosedEvent] = useState<any>({ start_date: "10/10/2022" });
  const [isOpenModalEditEvent, setIsOpenModalEditEvent] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [api] = notification.useNotification();
  const [listNewsAdd, setListNewsAdd] = useState<any[]>([
    { _id: item._id, "data:title": item["data:title"] },
  ]);
  const { data: dataFilterByID } = useEventByIdNewsList(item._id);
  const [form] = Form.useForm<Record<string, any>>();

  const columns: TableColumnsType<any> = [
    {
      title: "Tên sự kiện",
      align: "left",
      dataIndex: "event_name",
    },
    {
      title: "Ngày sự kiện",
      align: "left",
      width: 180,
      dataIndex: "start_date",
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
              name={"datetime"}
            >
              <DatePicker format={"DD/MM/YYYY"} />
            </Form.Item>
            <Form.Item
              validateTrigger={["onChange", "onBlur"]}
              label="Danh sách tin"
              name={"datetime"}
            >
              <div className={styles.addExistEventHeader}>
                <div className={styles.leftAddExistNewsContainer}>
                  <Select
                    showSearch
                    className={styles.newsEventSelect}
                    value={valueSelect}
                    placeholder={"Nhập tiêu đề tin"}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={handleSearch}
                    onChange={handleChange}
                    notFoundContent={null}
                    // options={(data?.data || []).map((d: any) => ({
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
                value={valueSelect}
                placeholder={"Nhập tên sự kiện"}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={handleSearch}
                onChange={handleChange}
                notFoundContent={null}
                // options={(data?.data || []).map((d: any) => ({
                //   value: d._id,
                //   label: d.event_name,
                // }))}
              />
            </div>
            <div className={styles.rightAddExistNewsContainer}>
              <Button type="primary" className={styles.addButton} onClick={addSource}>
                Thêm
              </Button>
            </div>
          </div>
          {listEvent.length > 0 ? (
            <Table columns={columns} dataSource={listEvent} rowKey="id" pagination={false} />
          ) : null}
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
                <div className={styles.addButtonContainer}>
                  <Button type="primary" className={styles.addButton} onClick={addEvent}>
                    Thêm sự kiện
                  </Button>
                </div>
              </div>
            ) : (
              <div className={styles.detailAllEvent}>
                {dataFilterByID?.map((element: any) => {
                  return <Items item={element} handleEdit={handleEdit} />;
                })}
              </div>
            )}
          </div>
        </Col>
      </Row>
      <ModalEdit
        choosedEvent={choosedEvent}
        functionEdit={functionEdit}
        isOpen={isOpenModalEditEvent}
        setIsOpen={setIsOpenModalEditEvent}
      />
    </Modal>
  );
  function addNews() {}

  function handleEdit(value: any) {
    setChoosedEvent(value);
    setIsOpenModalEditEvent(true);
  }

  function functionEdit(value: any) {}

  function handleChangeTypeBody() {
    setIsAddEventView(!isAddEventView);
  }

  function handleDeleteItemList(value: any) {
    const result = listEvent.filter((e: any) => e.id !== value.id);
    setListEvent(result);
  }

  function handleSearch(value: any) {
    console.log("this is type: ", typeof value);
    setSearchParams({
      text: value,
    });
  }
  function handleChange(newValue: object) {
    setValueSelect(newValue);
  }

  function openNotification(placement: any, type: any) {
    if (type === "invalid") {
      api.info({
        message: `Thông báo`,
        description: "Nguồn tin không tồn tại.",
        placement,
      });
    }
    if (type === "exited") {
      api.info({
        message: `Thông báo`,
        description: "Nguồn tin đã được thêm.",
        placement,
      });
    }
  }

  function addSource() {
    // const item = data.data.find((e: any) => e._id === valueSelect);
    // if (item === undefined) {
    //   openNotification("top", "invalid");
    //   return;
    // }
    // const check = listEvent.findIndex((e: any) => e.id === item._id);
    // if (check === -1) {
    //   setListEvent([
    //     ...listEvent,
    //     { id: item._id, event_name: item.event_name, start_date: item.start_date },
    //   ]);
    //   setValueSelect(null);
    // } else {
    //   openNotification("top", "exited");
    // }
  }

  function addEvent() {
    form
      .validateFields()
      .then((values) => {
        if (values.datetime === undefined) {
          values.datetime = "";
        } else {
          values.datetime = new Date(values.datetime).toISOString();
        }
        values["news_list"] = [item._id];
        setIsAddEventView(false);
      })
      .catch();
  }
};

interface ItemsProps {
  item: any;
  handleEdit: (value: any) => void;
}

const Items: React.FC<ItemsProps> = ({ item, handleEdit }) => {
  return (
    <div className={styles.itemContainer} key={item._id}>
      <div className={styles.collapseContainer}>
        <Collapse
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          defaultActiveKey={["0"]}
          ghost
        >
          <Collapse.Panel header={item.event_name} key="1">
            <div className={styles.itemContentContainer}>
              <Row gutter={[0, 5]}>
                <Col span={6}>Nội dung</Col>
                <Col span={1}>:</Col>
                <Col span={17}>{item.event_content}</Col>
                <Col span={6}>Khách thể</Col>
                <Col span={1}>:</Col>
                <Col span={17}>{item.khach_the}</Col>
                <Col span={6}>Chủ thể"</Col>
                <Col span={1}>:</Col>
                <Col span={17}>{item.chu_the}</Col>
                <Col span={6}>Ngày sự kiện</Col>
                <Col span={1}>:</Col>
                <Col span={17}>{item.start_date}</Col>
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
  const initialValues = { ...choosedEvent, start_date: dayjs(choosedEvent.start_date, dateFormat) };

  const [form] = Form.useForm<Record<string, any>>();

  function handleCancel() {
    setIsOpen(false);
  }

  async function handleEdit() {
    form
      .validateFields()
      .then((values) => {
        if (values.note === undefined) {
          values.note = "";
        }
        functionEdit({ ...initialValues, ...values });
        setIsOpen(false);
      })
      .catch();
  }
  return (
    <Modal
      title={"Sửa sự kiện"}
      open={isOpen}
      destroyOnClose
      confirmLoading={confirmLoading}
      onOk={handleEdit}
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
          <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
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
          name={"start_date"}
        >
          <DatePicker format={"DD/MM/YYYY"} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
