import { ReportIcon } from "@/assets/svg";
import { CaretRightOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Collapse, Input, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";

import {
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
}

export const MindmapModal: React.FC<props> = ({ item, isVisible, setHideModal }) => {
  const [choosedEvent, setChoosedEvent] = useState<any>({ start_date: "10/10/2022" });
  const [isOpenModalEditEvent, setIsOpenModalEditEvent] = useState<boolean>(false);
  const [typeModal, setTypeModal] = useState("edit");
  const { data: dataFilterByID } = useEventByIdNewsList(item._id);
  const [dataEventFromUser, setDataEventFromUser] = useState<any[]>();
  const [dataEventFromSystem, setDataEventFromSystem] = useState<any[]>();
  const { mutate: mutateOneEvent } = useMutationEventNews();
  const { mutate: mutateManyEvent } = useMutationAddManyEvent();
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
              <Button
                onClick={handleOpenModalAddEvent}
                type="primary"
                className={styles.addEventButton}
                icon={<PlusOutlined />}
                key="button"
              >
                Thêm sự kiện
              </Button>
            </div>
          </div>
        </Col>
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
            <div className={styles.detailAllEvent}>
              <div className={styles.userEventContainer}>
                <Collapse
                  expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                  defaultActiveKey={["0"]}
                  ghost
                >
                  <Collapse.Panel
                    className={styles.headerCollapse}
                    header={
                      <div className={styles.textHeaderCollapse}>Sự kiện do người dùng tạo</div>
                    }
                    key="1"
                  >
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
                  </Collapse.Panel>
                  <Collapse.Panel
                    className={styles.headerCollapse}
                    header={
                      <div className={styles.textHeaderCollapse}>Sự kiện do hệ thống tạo</div>
                    }
                    key="2"
                  >
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
                  </Collapse.Panel>
                </Collapse>
              </div>
            </div>
          </div>
        </Col>
      </Row>
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

  function handleClickEdit(value: any) {
    setChoosedEvent(value);
    setIsOpenModalEditEvent(true);
    setTypeModal("edit");
  }
  function handleClickDelete(value: any) {
    setChoosedEvent(value);
    setIsOpenModalEditEvent(true);
    setTypeModal("delete");
  }

  function handleOpenModalAddEvent() {
    setIsOpenModalEditEvent(true);
    setChoosedEvent(null);
    setTypeModal("add");
  }

  function handleUpdateEvent(value: any) {
    mutateOneEvent({ data: value, _id: choosedEvent._id, action: "update" });
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
          setIsOpenModalEditEvent(false);
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
          setIsOpenModalEditEvent(false);
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
                <Col span={17}>
                  <Input.TextArea
                    bordered={false}
                    className={styles.textContent}
                    autoSize={{ minRows: 1, maxRows: 5 }}
                    value={item.event_content}
                    readOnly={true}
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
        <ReportIcon
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
    setEvent(item);
  }
};
