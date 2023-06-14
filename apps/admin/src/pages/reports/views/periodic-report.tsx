import { OutlineFileWordIcon } from "@/assets/icons";
import { useEventsState } from "@/components/editor/plugins/events-plugin/events-state";
import { downloadFile } from "@/components/editor/utils";
import { useEventsByIdNewsList } from "@/pages/news/news.loader";
import { Button, Col, DatePicker, Input, PageHeader, Row, Space, Typography } from "antd";
import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import moment from "moment";
import { useEffect, useState } from "react";
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
  const [title, setTitle] = useState("Tên báo cáo");
  const [headings, setHeadings] = useState<any[]>([]);
  const { id } = useParams<{ id: string }>();
  const [dateTime, setDateTime] = useEventsState(
    (state) => [state.dateTimeFilter, state.setDateTimeFilter],
    shallow,
  );
  const [eventNumber, setEventNumber] = useState(5);
  const { data: dataEventsById, isLoading: isLoadingEventsById } = useEventsByIdNewsList({
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
  dataEventsById?.result?.map((item: any) => {
    let listEvent = Object.values(item)[0] as any[];
    listEvent?.map((obj: any) => {
      const b: any[] = [];
      obj.new_list?.map((item2: any) => {
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
  useEffect(() => {
    if (!dataSelect[0]) return;
    setTitle(dataSelect[0].title);
    setHeadings(datatest);
  }, []);
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={styles.root}>
      <Row>
        <Col md={isOpen ? 4 : 1} lg={isOpen ? 4 : 1} className={styles.outline}>
          <div className={styles.affix}>
            <PageHeader title="Mục lục" />
            <DirectoryTree data={dataWithDefaultParentId} id={id} />
          </div>
        </Col>
        <Col md={isOpen ? 16 : 19} span={isOpen ? 16 : 22} className={styles.container}>
          <Row justify={"space-between"} align={"middle"}>
            <Col span={4}></Col>
            <Col span={16} className={styles.title} pull={4}>
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
        </Col>
        <Col md={isOpen ? 4 : 2} span={isOpen ? 4 : 1} className={styles.action} pull={2}>
          <Space>
            <Button
              title="Xuất file ra docx"
              icon={<OutlineFileWordIcon />}
              onClick={handleExportDocx}
            />
          </Space>
        </Col>
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
    nodes?.map((node: any, index: any) => {
      const titleNode = new Paragraph({
        text: node.time ? index + 1 + ". Ngày " + node.time + ", " + node.title : node.title,
        heading: headingLevel[node.level + 1],
        alignment: AlignmentType.LEFT,
      });
      section.children.push(titleNode);
      const paragraph = new Paragraph({
        children: [],
      });
      if (node.time) {
        const content = new TextRun({
          text: node.content,
        });
        paragraph.addChildElement(content);
        const sourceNew = new TextRun({
          text: "Nguồn tin",
          italics: true,
          break: 1,
        });
        paragraph.addChildElement(sourceNew);
        for (const source of node.list_news) {
          const sourceNew = new TextRun({
            text: "- " + source.title,
            break: 1,
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
      downloadFile(blob, "bao-cao-dinh-ky.docx");
      console.log("Tree docs exported successfully!");
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
