import { ReportIcon } from "@/assets/svg";
import { CaretRightOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Collapse, Input, Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";

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
  const [choosedEvent, setChoosedEvent] = useState<any>();
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
      title={<div style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}>Mind map</div>}
      open={isVisible}
      destroyOnClose
      onCancel={() => setHideModal(false)}
      width={"90%"}
      getContainer="#modal-mount"
      footer={null}
      maskClosable={false}
      wrapClassName={"00000000"}
      className={styles.modal}
    >
      <div className={styles.bodyModal}>
        <div className={styles.leftBody}>
          <div className={styles.leftHeader}>
            <div className={styles.leftHeader}>Nội dung</div>
          </div>
          <div className={styles.leftContent}>
            <div
              dangerouslySetInnerHTML={{ __html: item["data:html"] }}
              className={styles.detailContent}
              onClick={(event) => event.stopPropagation()}
            />
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
                icon={<PlusOutlined />}
                key="button"
              >
                Thêm sự kiện
              </Button>
            </div>
          </div>

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
    setIsOpenModalEditEvent(true);
    setChoosedEvent(null);
    setTypeModal("add");
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
                <div className={styles.contentField}>: {item.date_created}</div>
              </div>
            </div>
          </Collapse.Panel>
        </Collapse>
      </div>
      <div className={styles.editContainer}>
        <ReportIcon
          onClick={handleOpenReport}
          title="Thêm sự kiện vào báo cáo"
          className={styles.reportIcon}
          style={{ cursor: "pointer" }}
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
