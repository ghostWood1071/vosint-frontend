import { downloadFileWord, getKeywords } from "@/common/_helper";
import { EventNodes, EventPlugin } from "@/components/editor/plugins/event-plugin";
import {
  EventEditorConfig,
  EventProvider,
} from "@/components/editor/plugins/event-plugin/event-context";
import { EventFilterNode } from "@/components/editor/plugins/event-plugin/event-filter-node";
import { EventNode } from "@/components/editor/plugins/event-plugin/event-node";
import { ContentEditable, EditorNodes, editorTheme } from "@aiacademy/editor";
import { FileWordOutlined, PlusOutlined } from "@ant-design/icons";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { Button, DatePicker, Empty, Input, List, Modal, Space } from "antd";
import { flatMap, unionBy } from "lodash";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "react-query";

import { QuickReportModal } from "../news/components/quick-report-modal";
import { ReportModal } from "../news/components/report-modal";
import { useReportModalState } from "../news/components/report-modal/index.state";
import { EditEventModal } from "./components/edit-event-modal";
import { EventItem } from "./components/event-item";
import EventSummaryModal from "./components/event-summary-modal";
import { EVENT_CACHE_KEYS, useInfiniteEventsList, useMutationEvents } from "./event.loader";
import styles from "./event.module.less";

interface Props {}

interface FilterEventProps {
  start_date?: string;
  end_date?: string;
  event_name?: string;
}

export const EventPage: React.FC<Props> = () => {
  const [skip, setSkip] = useState<number>(1);

  const [choosedEvent, setChoosedEvent] = useState<any>();
  const [typeModal, setTypeModal] = useState<string>("");
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [filterEvent, setFilterEvent] = useState<FilterEventProps>();
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();
  const [eventChoosedList, setEventChoosedList] = useState<any[]>([]);
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteEventsList(filterEvent);
  const { mutate } = useMutationEvents();

  const setEvent = useReportModalState((state) => state.setEvent);

  const dataSource = unionBy(flatMap(data?.pages.map((a) => a?.data?.map((e: any) => e))), "_id");

  const initialConfig: InitialConfigType = {
    namespace: "synthetic-report",
    onError: (error) => {
      console.error(error);
      throw new Error("synthetic-report?");
    },
    theme: editorTheme,
    nodes: [...EditorNodes, EventNode, EventFilterNode],
  };

  const eventConfig: EventEditorConfig = {
    namespace: "synthetic-report",
    onError: (error) => {
      console.error(error);
      throw new Error("synthetic-event?");
    },
    theme: editorTheme,
    nodes: [...EventNodes],
  };

  // TODO: Fix later. This is a hack to make sure the editor is not re-rendered when the event is changed
  React.useEffect(() => {
    if (inView && skip * 50 <= data?.pages[0].total) {
      fetchNextPage({ pageParam: { skip: skip + 1, limit: 50 } });
      setSkip(skip + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    queryClient.removeQueries([EVENT_CACHE_KEYS.ListEvents]);
    fetchNextPage({ pageParam: { skip: 1, limit: 50 } });
    setSkip(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterEvent]);

  const handleExportWord = () => {
    const newArr = eventChoosedList.map((event) => event._id);

    mutate(
      { action: "export", _id: "", data: newArr },
      {
        onSuccess: (res) => {
          downloadFileWord(new Blob([res]));
        },
      },
    );
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.filterContainer}>
        <Space wrap>
          <Button
            className={styles.item + " btn-tool"}
            icon={<FileWordOutlined />}
            onClick={handleExportWord}
            title="Tải file word"
            disabled={eventChoosedList.length == 0}
          />
          <DatePicker.RangePicker
            inputReadOnly
            format={"DD/MM/YYYY"}
            onChange={handleChangeFilterTime}
          />
          <Input.Search
            onSearch={(value) => {
              setFilterEvent({ ...filterEvent, event_name: value });
            }}
          />
          {/* summary */}
          <EventSummaryModal eventChoosedList={eventChoosedList} isUserEvent={true} />
          <Button
            style={{
              borderColor: eventChoosedList.length === 0 ? "rgb(230,230,230)" : "#1890ff",
            }}
            onClick={handleAddManyEvent}
            disabled={eventChoosedList.length === 0}
          >
            Thêm sự kiện vào báo cáo ({eventChoosedList.length})
          </Button>
          <Button
            onClick={handleClickCreate}
            type="primary"
            className={styles.addButton}
            icon={<PlusOutlined />}
            key="button"
          >
            Thêm sự kiện
          </Button>
        </Space>
      </div>
      <div className={styles.body}>
        <div className={styles.recordsContainer}>
          <LexicalComposer initialConfig={initialConfig}>
            <EventProvider>
              <EventPlugin eventEditorConfig={eventConfig}>
                <HistoryPlugin />
                <RichTextPlugin
                  contentEditable={<ContentEditable />}
                  placeholder={null}
                  ErrorBoundary={LexicalErrorBoundary}
                />
                <TabIndentationPlugin />
              </EventPlugin>
              {dataSource[0] !== undefined ? (
                <List
                  itemLayout="vertical"
                  size="small"
                  dataSource={dataSource}
                  renderItem={(item) => {
                    return (
                      <EventItem
                        item={item}
                        onClickDelete={handleClickDelete}
                        onClickEdit={handleClickEdit}
                        eventChoosedList={eventChoosedList}
                        lengthDataSource={dataSource?.length}
                        setEventChoosedList={setEventChoosedList}
                        onClickReport={handleClickReport}
                      />
                    );
                  }}
                />
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"Trống"} />
              )}
            </EventProvider>
          </LexicalComposer>
          {skip >= 1 ? (
            <div>
              <button
                ref={ref}
                disabled={!hasNextPage || isFetchingNextPage}
                style={{ padding: 0, margin: 0, border: 0 }}
              >
                {isFetchingNextPage ? "Đang lấy sự kiện..." : ""}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {isOpenModal ? (
        <LexicalComposer initialConfig={initialConfig}>
          <EventProvider>
            <EventPlugin eventEditorConfig={eventConfig}>
              <HistoryPlugin />
              <RichTextPlugin
                contentEditable={<ContentEditable />}
                placeholder={null}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <TabIndentationPlugin />
            </EventPlugin>
            <EditEventModal
              isOpen={isOpenModal}
              setIsOpen={setIsOpenModal}
              choosedEvent={choosedEvent}
              functionEdit={handleEdit}
              functionAdd={handleAdd}
              typeModal={typeModal}
            />
          </EventProvider>
        </LexicalComposer>
      ) : null}
      <ReportModal />
      <QuickReportModal />
    </div>
  );

  function handleClickCreate() {
    setIsOpenModal(true);
    setTypeModal("add");
  }

  function handleClickDelete(value: any) {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xoá sự kiện này?",
      okText: "Xoá",
      cancelText: "Huỷ",
      onOk: () => {
        handleDelete(value._id);
      },
    });
  }

  function handleClickEdit(value: any) {
    setChoosedEvent(value);
    setTypeModal("edit");
    setIsOpenModal(true);
  }

  function handleDelete(value: string) {
    mutate({ action: "delete", _id: value });
  }

  function handleEdit(value: any) {
    mutate(
      { action: "update", _id: value._id, data: value },
      {
        onSuccess: () => {
          setIsOpenModal(false);
        },
      },
    );
  }

  function handleAdd(value: any) {
    mutate(
      { action: "add", data: value },
      {
        onSuccess: () => {
          setIsOpenModal(false);
        },
      },
    );
  }

  function handleChangeFilterTime(value: any) {
    const start_date = value?.[0].format("DD/MM/YYYY");
    const end_date = value?.[1].format("DD/MM/YYYY");
    setFilterEvent({ ...filterEvent, start_date: start_date, end_date: end_date });
  }

  function handleAddManyEvent() {
    setEvent(eventChoosedList);
  }

  function handleClickReport(value: any) {
    setEvent(value);
  }
};
