import { OutlineFileWordIcon } from "@/assets/icons";
import { IS_BOLD, IS_ITALIC, IS_UNDERLINE } from "@/components/editor/constants/lexical-constant";
import { useEventsState } from "@/components/editor/plugins/events-plugin/events-state";
import { downloadFile } from "@/components/editor/utils";
import { useEventsByIdNewsList } from "@/pages/news/news.loader";
import { Button, Col, DatePicker, Input, Row, Space, Spin, Typography } from "antd";
import {
  AlignmentType,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
  UnderlineType,
} from "docx";
import moment from "moment";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { shallow } from "zustand/shallow";

import { DirectoryTree } from "../components/directory-tree";
import { HeadingTocProvider } from "../components/heading-toc.context";
import styles from "./synthesis-report.module.less";

const headingLevel: Record<number, HeadingLevel> = {
  1: HeadingLevel.HEADING_1,
  2: HeadingLevel.HEADING_2,
  3: HeadingLevel.HEADING_3,
  4: HeadingLevel.HEADING_4,
  5: HeadingLevel.HEADING_5,
  6: HeadingLevel.HEADING_6,
};

export function PeriodicReportDetail(): JSX.Element {
  // const [title, setTitle] = useState("Tên báo cáo");
  // const [headings, setHeadings] = useState<any[]>([]);
  const { id } = useParams<{ id: string }>();
  const [dateTime, setDateTime] = useEventsState(
    (state) => [state.dateTimeFilter, state.setDateTimeFilter],
    shallow,
  );
  const [eventNumber, setEventNumber] = useState(5);
  const { data: dataEventsById, isLoading } = useEventsByIdNewsList({
    newsletterId: id,
    startDate: dateTime[0],
    endDate: dateTime[1],
    eventNumber: eventNumber,
  });

  const dataWithDefaultParentId =
    dataEventsById?.infor_tree?.map((item: any) => ({
      ...item,
      parent_id: item.parent_id ?? null,
    })) ?? [];
  let datatest: any[] = [];
  // eslint-disable-next-line array-callback-return
  dataEventsById?.result?.forEach((item: any) => {
    let listEvent = Object.values(item)[0] as any[];
    listEvent?.forEach((obj: any) => {
      const b: any[] = [];
      obj.new_list?.forEach((item2: any) => {
        if (item2 != null) b.push({ title: item2["data:title"], url: item2["data:url"] });
      });
      datatest.push({
        _id: obj._id,
        title: obj.event_name,
        time: obj.date_created,
        content: obj.event_content,
        list_news: b,
        parent_id: Object.keys(item)[0],
      });
    });
  });
  datatest = datatest?.concat(dataWithDefaultParentId);

  const dataSelect = dataEventsById?.infor_tree?.filter((item: any) => item._id === id) ?? [];

  return (
    <div className={styles.root}>
      <Row>
        <Col span={4} className={styles.outline}>
          <div className={styles.affix}>
            <div className={styles.textHeader}>Mục lục</div>
            <DirectoryTree data={dataWithDefaultParentId} id={id} />
          </div>
        </Col>
        <Col span={16} className={styles.container}>
          <Spin spinning={isLoading} size={"large"}>
            <div className={styles.menu_action}>
              <Button
                title="Xuất file ra docx"
                icon={<OutlineFileWordIcon />}
                onClick={handleExportDocx}
              />
            </div>
            <Row justify={"space-between"} align={"middle"}>
              <Col span={24} className={styles.title}>
                <Typography.Title level={2}>
                  Báo cáo định kỳ về "{dataSelect[0]?.title}"
                </Typography.Title>
              </Col>
              <Col span={24} className={styles.center}>
                <Space>
                  <Typography.Text>Từ ngày: </Typography.Text>
                  <DatePicker.RangePicker
                    defaultValue={[moment().subtract(30, "days"), moment()]}
                    format={"DD/MM/YYYY"}
                    bordered={false}
                    onChange={(_, formatString) => handleSetDateTime(formatString)}
                  />
                  <Typography.Text>Số sự kiện: </Typography.Text>
                  <Input
                    size="small"
                    className={styles.inputFilter}
                    defaultValue={5}
                    onChange={handleInputChange}
                  />
                </Space>
              </Col>

              <DirectoryTree data={datatest} id={id} />
            </Row>
          </Spin>
        </Col>
        <Col span={4} className={styles.action}></Col>
      </Row>
    </div>
  );

  function handleInputChange(e: any) {
    const value = e.target.value;
    if (value !== "") {
      setEventNumber(value);
    }
  }

  function handleSetDateTime(formatString: any) {
    setDateTime(formatString);
  }

  function setNodeLevels(nodes: any, parentId = null, level = 0) {
    return nodes
      .filter((node: any) => node.parent_id === parentId)
      .map((node: any) => ({
        ...node,
        level,
        children: setNodeLevels(nodes, node._id, level + 1),
      }));
  }

  function convertHeadingsToDocxPeriodic(nodes: any, title: any) {
    const section: any = {
      properties: {},
      children: [],
    };
    const titleDocx = new Paragraph({
      text: `Báo cáo định kỳ về "${title}"`,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
    });
    const dateTimeDocx = new Paragraph({
      text: `Từ ngày: ${dateTime[0]} đến ngày ${dateTime[1]}`,
      alignment: AlignmentType.CENTER,
    });
    section.children.push(titleDocx);
    section.children.push(dateTimeDocx);
    generateTreeDocs(nodes, section);
    return new Document({
      creator: "VOSINT",
      description: "",
      sections: [section],
    });
  }

  function generateTreeDocs(nodes: any, section: any) {
    nodes?.forEach((node: any, index: any) => {
      const titleNode = new Paragraph({
        text: node.time
          ? `${index + 1}, Ngày ${moment(node.time).format("DD/MM/YYYY")}, ${node.title}`
          : node.title,
        heading: headingLevel[node.level + 1],
        alignment: AlignmentType.LEFT,
      });
      section.children.push(titleNode);
      if (node.time) {
        try {
          const lexicalContent = JSON.parse(node.content);
          for (const block of lexicalContent.root?.children) {
            const paragraph = new Paragraph({
              children: [],
            });
            if (block.type === "heading") {
              const text = block?.children[0]?.text;
              const heading = new Paragraph({
                text,
                heading: headingLevel[block.tag],
              });
              section.children.push(heading);
            } else if (block.type === "paragraph") {
              for (const inline of block.children) {
                const textRun = new TextRun({
                  text: block?.children[0]?.text,
                  bold: !!(inline.format & IS_BOLD),
                  italics: !!(inline.format & IS_ITALIC),
                  underline:
                    inline.format & IS_UNDERLINE
                      ? {
                          color: "#000000",
                          type: UnderlineType.SINGLE,
                        }
                      : undefined,
                });
                paragraph.addChildElement(textRun);
              }

              if (block.children.length === 0) {
                const textRun = new TextRun({});
                paragraph.addChildElement(textRun);
              }
            }
            section.children.push(paragraph);
          }
        } catch {
          const paragraph = new Paragraph({
            children: [],
          });
          const content = new TextRun({
            text: node.content,
          });
          paragraph.addChildElement(content);
          section.children.push(paragraph);
        }

        const paragraph = new Paragraph({
          children: [],
        });
        const sourceNew = new TextRun({
          text: "Nguồn tin",
          italics: true,
        });
        paragraph.addChildElement(sourceNew);
        for (const source of node.list_news) {
          const sourceNew = new ExternalHyperlink({
            children: [
              new TextRun({
                text: `- ${source.title}`,
                break: 1,
                style: "Hyperlink",
              }),
            ],
            link: source.url,
          });
          paragraph.addChildElement(sourceNew);
        }
        section.children.push(paragraph);
      }

      if (node.children && node.children.length > 0) {
        generateTreeDocs(node.children, section);
      }
    });
  }

  async function handleExportDocx() {
    const nodesWithLevels = setNodeLevels(datatest);
    const blobData = await convertHeadingsToDocxPeriodic(nodesWithLevels, dataSelect[0]?.title);
    Packer.toBlob(blobData).then((blob) => {
      downloadFile(blob, `${dataSelect[0]?.title}.docx`);
    });
  }
}

export function PeriodicReport(): JSX.Element {
  return (
    <HeadingTocProvider>
      <PeriodicReportDetail />
    </HeadingTocProvider>
  );
}
