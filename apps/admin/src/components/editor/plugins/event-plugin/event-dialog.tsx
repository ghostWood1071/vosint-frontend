import { ListNewsSampleLinhVuc } from "@/components/news/form/form-linh-vuc";
import { useNewsSamplesState } from "@/components/news/news-state";
import { useCreateEvent, useEvents } from "@/pages/reports/report.loader";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { DatePicker, DatePickerProps, Form, Modal, Switch, Table, TableProps } from "antd";
import { LexicalEditor, createEditor } from "lexical";
import React, { useEffect, useMemo, useState } from "react";
import { create } from "zustand";
import { shallow } from "zustand/shallow";

import { INSERT_EVENT_COMMAND } from "../event-plugin";
import { EventEditor, useEventContext } from "../event-plugin/event-context";
import styles from "./index.module.less";

export function EventDialog(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [open, setOpen] = useEventDialogStore((state) => [state.open, state.setOpen], shallow);
  const [systemCreated, setSystemCreated] = useState(false);
  const [paginate, setPaginate] = useState({ pageNumber: 1, pageSize: 10 });
  const [selectedID, setSelectedID] = useState<React.Key>("");
  const { eventEditorConfig } = useEventContext();
  const eventEditor = useMemo(() => {
    if (eventEditorConfig === null) return null;

    const _eventEditor = createEditor({
      namespace: eventEditorConfig.namespace,
      nodes: eventEditorConfig.nodes,
      onError: (error) => eventEditorConfig.onError(error, editor),
      theme: eventEditorConfig.theme,
    });
    return _eventEditor;
  }, [eventEditorConfig]);

  const { data, isLoading } = useEvents(
    {
      skip: paginate.pageNumber,
      limit: paginate.pageSize,
    },
    {
      enabled: systemCreated,
      keepPreviousData: true,
    },
  );
  const { mutate } = useCreateEvent({
    onSuccess: (data, variables) => {
      editor.dispatchCommand(INSERT_EVENT_COMMAND, {
        id: data,
        hidden: false,
        open: true,
        date: variables.date_created,
      });
    },
  });
  const [name, setName] = useState(defaultName);
  const [content, setContent] = useState(defaultContent);
  const [date, setDate] = useState("");
  const [form] = Form.useForm();
  const [newsSamples, setNewsSamples] = useNewsSamplesState(
    (state) => [state.newsSamples, state.setNewsSamples],
    shallow,
  );

  if (eventEditor === null) return null;

  const columns: TableProps<any>["columns"] = [
    {
      title: "Tên sự kiện",
      dataIndex: "event_name",
      key: "event_name",
      render: (value) => (
        <div
          dangerouslySetInnerHTML={{
            __html: generateHTMLFromJSON(value, eventEditor),
          }}
        />
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "date",
      key: "date",
    },
  ];

  const handleCancel = () => {
    setOpen(false);
    setPaginate({
      pageNumber: 1,
      pageSize: 10,
    });
  };

  const handleOk = async () => {
    if (systemCreated) {
      editor.dispatchCommand(INSERT_EVENT_COMMAND, {
        id: selectedID + "",
        hidden: false,
        open: true,
      });
    } else {
      mutate({
        event_content: content,
        event_name: name,
        date_created: date,
        new_list: newsSamples.map((item) => item._id),
      });
    }
    setOpen(false);
    setPaginate({
      pageNumber: 1,
      pageSize: 10,
    });
    setSelectedID("");
    setNewsSamples([]);
  };

  const handlePaginate = (page: number, pageSize: number) => {
    setPaginate({
      pageSize: pageSize,
      pageNumber: page,
    });
  };

  const handleDateChange: DatePickerProps["onChange"] = (_, dateString) => {
    setDate(dateString);
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      title="Tạo sự kiện"
      destroyOnClose
      onOk={handleOk}
      width={"60%"}
      getContainer="#modal-mount"
      maskClosable={false}
      className={styles.modalDialog}
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} form={form}>
        <Form.Item label="Hệ thống">
          <Switch checked={systemCreated} onChange={(checked) => setSystemCreated(checked)} />
        </Form.Item>

        {systemCreated ? (
          <Form.Item
            wrapperCol={{
              push: 2,
              span: 20,
            }}
          >
            <Table
              rowKey="_id"
              pagination={{
                position: ["bottomCenter"],
                total: data?.total,
                current: paginate.pageNumber,
                pageSize: paginate.pageSize,
                onChange: handlePaginate,
                showSizeChanger: true,
              }}
              columns={columns}
              dataSource={data?.data}
              loading={isLoading}
              rowSelection={{
                type: "radio",
                onChange: (value) => {
                  setSelectedID(value[0]);
                },
              }}
            />
          </Form.Item>
        ) : (
          <>
            <Form.Item label="Tên">
              <EventEditorParagraph data={defaultName} setData={setName} />
            </Form.Item>
            <Form.Item label="Thời gian">
              <DatePicker bordered={false} format={"YYYY-MM-YY"} onChange={handleDateChange} />
            </Form.Item>
            <Form.Item label="Nội dung">
              <EventEditorParagraph data={defaultContent} setData={setContent} />
            </Form.Item>
            <ListNewsSampleLinhVuc />
          </>
        )}
      </Form>
    </Modal>
  );
}

const defaultName = `{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Tên sự kiện","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`;
const defaultContent = `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Nội dung sự kiện","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`;

interface EventDialogState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useEventDialogStore = create<EventDialogState>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
}));

export function EventEditorParagraph({
  data,
  setData,
}: {
  data: string;
  setData?: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [editor] = useLexicalComposerContext();

  const { eventEditorConfig } = useEventContext();
  const eventEditor = useMemo(() => {
    if (eventEditorConfig === null) return null;

    const _eventEditor = createEditor({
      namespace: eventEditorConfig.namespace,
      nodes: eventEditorConfig.nodes,
      onError: (error) => eventEditorConfig.onError(error, editor),
      theme: eventEditorConfig.theme,
    });
    return _eventEditor;
  }, [eventEditorConfig]);

  useEffect(() => {
    if (eventEditor === null) return;

    eventEditor.update(() => {
      const editorState = eventEditor.parseEditorState(data);
      eventEditor.setEditorState(editorState);
    });
  }, [data, eventEditor]);

  useEffect(() => {
    if (eventEditor === null) return;

    return eventEditor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves, prevEditorState, tags }) => {
        if (
          (dirtyElements.size === 0 && dirtyLeaves.size === 0) ||
          tags.has("history-merge") ||
          prevEditorState.isEmpty()
        ) {
          return;
        }
        setData && setData(JSON.stringify(editorState));
      },
    );
  }, [eventEditor]);

  if (eventEditor === null) return null;

  return (
    <>
      <EventEditor eventEditor={eventEditor} />
      <OnChangePlugin
        onChange={(e) => {
          console.log(e);
        }}
      />
    </>
  );
}

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
