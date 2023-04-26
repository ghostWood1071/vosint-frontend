import { OutlineFileWordIcon } from "@/assets/icons";
import { EventDialog } from "@/components/editor/plugins/event-plugin/event-dialog";
import EventsPlugin from "@/components/editor/plugins/events-plugin";
import { useEventsState } from "@/components/editor/plugins/events-plugin/events-state";
import { TableOfContentsPlugin } from "@/components/editor/plugins/table-of-contents-plugin";
import { downloadFile } from "@/components/editor/utils";
import { useConvertLexicalToDocx } from "@/components/editor/utils/docx";
import { reportPath } from "@/pages/router";
import { Editor, useLexicalComposerContext } from "@aiacademy/editor";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { Button, Card, Col, DatePicker, Modal, Row, Space, Spin, Typography, message } from "antd";
import { Packer } from "docx";
import { EditorState } from "lexical";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { shallow } from "zustand/shallow";

import { CACHE_KEYS, useDeleteReport, useReport, useUpdateReport } from "../report.loader";
import styles from "./synthetic-report.module.less";

export const SyntheticReportDetail: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = useState(true);
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();
  const [dateTime, setDateTime] = useEventsState(
    (state) => [state.dateTimeFilter, state.setDateTimeFilter],
    shallow,
  );
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useReport(id!, {
    enabled: !!id,
  });

  const [content, setContent] = useState("");
  const { mutate, isLoading: isUpdating } = useUpdateReport(id!);
  const { mutate: deleteReport, isLoading: isDeleting } = useDeleteReport();
  const convertLexicalToDocx = useConvertLexicalToDocx();
  const navigate = useNavigate();

  useEffect(() => {
    if (data && editor) {
      const editorState = editor.parseEditorState(data.content);
      editor.setEditorState(editorState);
    }
  }, [editor, data]);

  useEffect(() => {
    if (title) {
      mutate(
        { title },
        {
          onSuccess: () => {
            queryClient.invalidateQueries([CACHE_KEYS.REPORT, id!]);
          },
        },
      );
    }
  }, [title]);

  async function handleExportDocx() {
    const editorState = editor.getEditorState();
    const blobData = await convertLexicalToDocx(editorState.toJSON(), dateTime, data?.title ?? "");
    Packer.toBlob(blobData).then((blob) => {
      downloadFile(blob, "bao-cao-tong-hop.docx");
    });
  }

  return (
    <Card bordered={false}>
      <Row>
        <Col span={isOpen ? 4 : 1} className={styles.outline}>
          <div className={styles.affix}>
            {isOpen ? (
              <Button
                shape="circle"
                title="Đóng outline"
                icon={<ArrowLeftOutlined />}
                onClick={toggleOutline}
              />
            ) : (
              <Button
                shape="circle"
                title="Mở outline"
                icon={<UnorderedListOutlined />}
                onClick={toggleOutline}
              />
            )}
          </div>

          {isOpen && <TableOfContentsPlugin />}
        </Col>
        <Col span={isOpen ? 16 : 22} className={styles.container}>
          <Row align="middle" justify="center">
            <Col span={3}></Col>
            <Col span={16} className={styles.center}>
              <Typography.Title
                level={4}
                editable={{
                  icon: <EditOutlined />,
                  tooltip: "Chỉnh sửa tên báo cáo",
                  onChange: (value) => setTitle(value),
                  triggerType: ["text", "icon"],
                  enterIcon: null,
                }}
                style={{
                  marginBottom: 0,
                }}
              >
                {data?.title}
              </Typography.Title>
            </Col>
            <Col span={3}>
              <Space>
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  title="Xoá báo cáo"
                  onClick={handleDelete}
                  loading={isDeleting}
                />
                <Button
                  title="Xuất file ra docx"
                  icon={<OutlineFileWordIcon />}
                  onClick={handleExportDocx}
                />
                <Button
                  icon={<SaveOutlined />}
                  type="primary"
                  title="Lưu báo cáo"
                  onClick={handleClickSave}
                  loading={isUpdating}
                />
              </Space>
            </Col>

            <Col span={18} className={styles.center}>
              <Space>
                <Typography.Text>Từ ngày: </Typography.Text>
                <DatePicker.RangePicker
                  defaultValue={[moment().subtract(7, "days"), moment()]}
                  format={"DD/MM/YYYY"}
                  bordered={false}
                  onChange={(_, formatString) => setDateTime(formatString)}
                />
              </Space>
            </Col>
          </Row>
          <Spin spinning={isLoading}>
            <Editor>
              <EventsPlugin />
              <OnChangePlugin onChange={handleChangeContent} />
            </Editor>
          </Spin>
          <EventDialog />
        </Col>
      </Row>
    </Card>
  );

  function handleChangeContent(editorState: EditorState) {
    setContent(JSON.stringify(editorState));
  }

  function toggleOutline() {
    setIsOpen(!isOpen);
  }

  function handleClickSave() {
    mutate(
      { content },
      {
        onSuccess: () => {
          message.success({
            content: "Lưu báo cáo thành công",
          });
        },
      },
    );
  }

  function handleDelete() {
    Modal.confirm({
      title: "Xác nhận xoá báo cáo",
      content: "Bạn có chắc chắn muốn xoá báo cáo này?",
      okText: "Xoá",
      cancelText: "Huỷ",
      getContainer: "#modal-mount",
      onOk: () => {
        deleteReport(id!, {
          onSuccess: () => {
            queryClient.invalidateQueries([CACHE_KEYS.REPORTS]);
            message.success({
              content: "Xoá báo cáo thành công",
            });
            navigate(reportPath);
          },
        });
      },
    });
  }
};
