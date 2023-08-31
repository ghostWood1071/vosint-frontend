import {
  FormatAlignCenterIcon,
  FormatAlignLeftIcon,
  FormatAlignRightIcon,
  FormatBoldIcon,
  FormatItalicIcon,
  FormatUnderlinedIcon,
  OutlineFileWordIcon,
} from "@/assets/icons";
import { useLexicalComposerContext } from "@aiacademy/editor";
import { $createHeadingNode, $isHeadingNode, HeadingTagType } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  MenuProps,
  Row,
  Space,
  Typography,
} from "antd";
import { Packer } from "docx";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_CRITICAL,
  DEPRECATED_$isGridSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import type { LexicalEditor } from "lexical";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { shallow } from "zustand/shallow";

import { $findMatchingParent, downloadFile } from "../../utils";
import { useConvertLexicalToDocx } from "../../utils/docx";
import { useEventsState } from "../events-plugin/events-state";
import "./index.css";

const blockTypeToBlockName = {
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  paragraph: "Normal",
};

function BlockFormatDropDown({
  editor,
  blockType,
  disabled = false,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "Normal",
      key: "paragraph",
      onClick: formatParagraph,
    },
    {
      label: "Heading 1",
      key: "h1",
      onClick: () => formatHeading("h1"),
    },
    {
      label: "Heading 2",
      key: "h2",
      onClick: () => formatHeading("h2"),
    },
    {
      label: "Heading 3",
      key: "h3",
      onClick: () => formatHeading("h3"),
    },
  ];

  return (
    <Dropdown menu={{ items }} disabled={disabled} trigger={["click"]}>
      <Button>{blockTypeToBlockName[blockType]}</Button>
    </Dropdown>
  );
}

export function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>("paragraph");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isExporting, setExporting] = useState(false);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const convertLexicalToDocx = useConvertLexicalToDocx();
  const [dateTime, setDateTime] = useEventsState(
    (state) => [state.dateTimeFilter, state.setDateTimeFilter],
    shallow,
  );

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });
      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));

      if (elementDOM !== null) {
        const type = $isHeadingNode(element) ? element.getTag() : element.getType();
        if (type in blockTypeToBlockName) {
          setBlockType(type as keyof typeof blockTypeToBlockName);
        }
      }
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
    );
  }, [activeEditor, editor, updateToolbar]);

  async function handleExportDocx() {
    setExporting(true);
    const editorState = activeEditor.getEditorState();
    const blobData = await convertLexicalToDocx(editorState.toJSON(), dateTime, "");

    Packer.toBlob(blobData)
      .then((blob) => {
        downloadFile(blob, "bao-cao-nhanh.docx");
      })
      .finally(() => {
        setExporting(false);
      });
  }

  return (
    <div className="toolbar">
      <Row justify="space-between" align="middle">
        <Col span={22}>
          <Button
            title={`Đậm (Ctrl+B)`}
            aria-label="Bôi đậm văn bản của bạn"
            icon={<FormatBoldIcon />}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
            type={isBold ? "primary" : "default"}
          />

          <Button
            title={`Nghiêng (Ctrl+I)`}
            aria-label="Làm nghiêng văn bản của bạn"
            icon={<FormatItalicIcon />}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
            type={isItalic ? "primary" : "default"}
          />

          <Button
            title={`Gạch dưới (Ctrl+U)`}
            aria-label="Gạch dưới văn bản của bạn"
            icon={<FormatUnderlinedIcon />}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            }}
            type={isUnderline ? "primary" : "default"}
          />
          <Divider type="vertical" />
          <Button
            title={`Căn trái`}
            aria-label={`Căn chỉnh nội dung của bạn với lề trái. Căn trái thường được dùng cho nội dung phần thân và giúp dễ đọc tài liệu hơn`}
            icon={<FormatAlignLeftIcon />}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
            }}
          />
          <Button
            icon={<FormatAlignCenterIcon />}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
            }}
          />
          <Button
            icon={<FormatAlignRightIcon />}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
            }}
          />

          <Divider type="vertical" />
          {blockType in blockTypeToBlockName && activeEditor === editor && (
            <>
              <BlockFormatDropDown disabled={!isEditable} blockType={blockType} editor={editor} />
            </>
          )}
          <Divider type="vertical" />

          <Typography.Text strong>Lọc sự kiện theo ngày: </Typography.Text>
          <DatePicker.RangePicker
            inputReadOnly
            defaultValue={[moment().subtract(7, "days"), moment()]}
            format={"DD/MM/YYYY"}
            bordered={false}
            onChange={(_, formatString) => setDateTime(formatString)}
          />
        </Col>
        <Col span={2}>
          <Space>
            <Button
              title="Xuất file ra docx"
              icon={<OutlineFileWordIcon />}
              loading={isExporting}
              onClick={handleExportDocx}
            />
          </Space>
        </Col>
      </Row>
      <Row className="toolbar-datetime" align="middle">
        <Col span={4}></Col>
        <Col span={20}></Col>
      </Row>
    </div>
  );
}
