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
import { Button, Col, Dropdown, MenuProps, Row, Space } from "antd";
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

import { $findMatchingParent, downloadFile } from "../../utils";
import { useConvertLexicalToDocx } from "../../utils/docx";
import { INSERT_EVENT_FILTER_COMMAND } from "../event-plugin";
import { useEventDialogStore } from "../event-plugin/event-dialog";
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

  const [setOpen] = useEventDialogStore((state) => [state.setOpen]);

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

  function handleExportDocx() {
    setExporting(true);
    const editorState = activeEditor.getEditorState();
    Packer.toBlob(convertLexicalToDocx(editorState.toJSON()))
      .then((blob) => {
        downloadFile(blob, "bao-cao-nhanh.docx");
      })
      .finally(() => {
        setExporting(false);
      });
  }

  return (
    <div className="toolbar">
      <Row justify="space-between">
        <Col span={6}>
          <Space>
            <Space.Compact>
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
            </Space.Compact>
            <Space.Compact>
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
            </Space.Compact>
            {blockType in blockTypeToBlockName && activeEditor === editor && (
              <>
                <BlockFormatDropDown disabled={!isEditable} blockType={blockType} editor={editor} />
              </>
            )}
            <Space>
              <Button
                onClick={() => {
                  setOpen(true);
                }}
              >
                Sự kiện
              </Button>
              <Button
                onClick={() => {
                  const startDate = moment().subtract("7", "days").format("YYYY-MM-DD");
                  const endDate = moment().format("YYYY-MM-DD");

                  activeEditor.dispatchCommand(INSERT_EVENT_FILTER_COMMAND, {
                    startDate: startDate,
                    endDate: endDate,
                  });
                }}
              >
                Lọc sự kiện theo ngày
              </Button>
            </Space>
          </Space>
        </Col>
        <Col span={6} style={{ textAlign: "right" }}>
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
    </div>
  );
}
