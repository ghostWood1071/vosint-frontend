import { ReactComponent as CollapsedIcon } from "@/assets/svg/collapsed-icon.svg";
import { ModalAddNewsSamples } from "@/components/news/form/form-linh-vuc";
import { useEvent, useRemoveNewsInEvent } from "@/pages/reports/report.loader";
import { useUpdateEvent } from "@/pages/reports/report.loader";
import { TNews } from "@/services/news.type";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button, Collapse, DatePicker, DatePickerProps, List, Space, Typography } from "antd";
import { $getNodeByKey, NodeKey, createEditor } from "lexical";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";

import { EventEditor, useEventContext } from "./event-context";
import { $isEventNode } from "./event-node";
import styles from "./index.module.less";

interface Props {
  id: string;
  nodeKey: NodeKey;
  date: moment.Moment;
}

export default function EventComponent({ nodeKey, date, id }: Props): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [tempName, setTempName] = useState("");
  const [tempContent, setTempContent] = useState("");
  const { data, isLoading } = useEvent(id, {
    onSuccess: (res) => {
      setTempName(res.event_name);
      setTempContent(res.event_content);
    },
  });
  const { mutate } = useUpdateEvent(id);
  const { mutate: mutateRemove } = useRemoveNewsInEvent(id);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (data && tempName && tempContent && date && data.new_list.length > 0) {
      const timeout = setTimeout(() => {
        mutate({
          event_name: tempName,
          event_content: tempContent,
          date_created: date.format("DD/MM/YYYY"),
          new_list: data.new_list.map((item) => item._id),
        });
      }, 1000);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempName, tempContent, date]);

  if (isLoading) return <></>;

  return (
    <>
      <summary className={styles.header}>
        <div className={styles.icon} onClick={handleToggle}>
          <span>
            <CollapsedIcon />
          </span>
        </div>
        <div className={styles.title}>
          <EventEditorParagraph data={data!.event_name} setData={setTempName} />
        </div>
      </summary>
      <div className={styles.content}>
        <Space>
          <Typography.Text strong>Thời gian:</Typography.Text>
          <DatePicker
            bordered={false}
            placeholder="Chọn ngày"
            onChange={handleChangeDate}
            defaultValue={date}
          />
        </Space>

        <div>
          <EventEditorParagraph data={data!.event_content} setData={setTempContent} />
        </div>

        <Collapse ghost>
          <Collapse.Panel
            key={1}
            header={
              <Space>
                <Typography.Text strong>Danh sách tin nói về sự kiện</Typography.Text>
                <Button
                  icon={<PlusOutlined />}
                  title="Thêm tin"
                  type="text"
                  onClick={handleOpenNews}
                />
              </Space>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={data?.new_list ?? []}
              renderItem={(item) => {
                return (
                  <List.Item
                    actions={[
                      <Button
                        icon={<DeleteOutlined />}
                        key="delete"
                        type="text"
                        onClick={handleDelete}
                      />,
                    ]}
                  >
                    <Typography.Link
                      target="_blank"
                      href={item?.["data:url"]}
                      rel="noopener noreferrer"
                    >
                      {item?.["data:title"]}
                    </Typography.Link>
                  </List.Item>
                );

                function handleDelete() {
                  mutateRemove([item._id]);
                }
              }}
            />
          </Collapse.Panel>
        </Collapse>
      </div>

      <ModalAddNewsSamples
        open={open}
        setOpen={setOpen}
        selected={data?.new_list ?? []}
        onOk={handleOK}
      />
    </>
  );

  function handleOpenNews(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setOpen(true);
  }

  function handleOK(selected: TNews[]) {
    mutate({
      new_list: selected.map((item) => item._id),
      event_name: tempName,
      event_content: tempContent,
    });
  }

  function handleToggle() {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (!node) return;
      if (!$isEventNode(node)) return;

      node.toggleOpen();
    });
  }

  function handleChangeDate(value: DatePickerProps["value"]) {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (!node) return;
      if (!$isEventNode(node)) return;
      if (!value) return;

      node.setDate(value.format("DD/MM/YYYY"));
    });
  }
}

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

    return createEditor({
      namespace: eventEditorConfig.namespace,
      nodes: eventEditorConfig.nodes,
      onError: (error) => eventEditorConfig.onError(error, editor),
      theme: eventEditorConfig.theme,
    });
  }, [eventEditorConfig]);

  useEffect(() => {
    if (eventEditor === null) return;

    eventEditor.update(() => {
      const editorState = eventEditor.parseEditorState(data);
      eventEditor.setEditorState(editorState);
    });
  }, []);

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

  return <EventEditor eventEditor={eventEditor} />;
}
