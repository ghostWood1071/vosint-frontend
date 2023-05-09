import { navigationItemLevel } from "@/components/editor/plugins/table-of-contents-plugin";
import {
  CACHE_KEYS,
  useAddEventIdsToReport,
  useCreateReportEvents,
  useReports,
  useUpdateReport,
} from "@/pages/reports/report.loader";
import { IEventDto, TReport } from "@/services/report-type";
import type { HeadingTagType } from "@lexical/rich-text";
import {
  Col,
  Input,
  Modal,
  Pagination,
  Radio,
  Row,
  Space,
  Spin,
  Table,
  TableColumnsType,
  Typography,
  message,
} from "antd";
import classNames from "classnames";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { shallow } from "zustand/shallow";

import styles from "./index.module.less";
import { useReportModalState } from "./index.state";

export function ReportModal(): JSX.Element {
  const queryClient = useQueryClient();
  const [events, setEvent, selectedHeading] = useReportModalState(
    (state) => [state.events, state.setEvent, state.selectedHeading],
    shallow,
  );
  const [filter, setFilter] = useState({
    skip: 1,
    limit: 10,
    title: "",
  });
  const [selectedReport, setSelectedReport] = useState<TReport | null>(null);
  const { data, isLoading } = useReports(filter, {
    enabled: events !== null,
    keepPreviousData: true,
  });

  const { mutateAsync: createReportEvents } = useCreateReportEvents();
  const { mutate: addEventIds, isLoading: isLoadingAddEvent } = useAddEventIdsToReport({
    onSuccess: () => {
      queryClient.invalidateQueries(CACHE_KEYS.REPORTS);

      setEvent(null);
      setFilter({
        skip: 1,
        limit: 10,
        title: "",
      });
      setSelectedReport(null);
      message.success("Thêm sự kiện vào báo cáo thành công");
    },
  });
  const { mutate: updateReport, isLoading: isLoadingUpdate } = useUpdateReport(
    selectedReport?._id ?? "",
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CACHE_KEYS.REPORTS);
        setEvent(null);
        setFilter({
          skip: 1,
          limit: 10,
          title: "",
        });
        setSelectedReport(null);
        message.success("Thêm sự kiện vào báo cáo thành công");
      },
    },
  );
  const columnsEventTable: TableColumnsType<IEventDto> = [
    {
      title: "Tên sự kiện",
      align: "left",
      dataIndex: "event_name",
    },
    {
      title: "Ngày sự kiện",
      width: 130,
      align: "left",
      dataIndex: "date_created",
    },
  ];

  return (
    <Modal
      open={events !== null}
      title="Chọn báo cáo"
      onCancel={handleCancel}
      onOk={handleOk}
      width="70%"
      confirmLoading={isLoadingAddEvent || isLoadingUpdate}
      getContainer="#modal-mount"
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Input.Search
            placeholder={"Tìm theo tên báo cáo"}
            onSearch={(value) => setFilter({ ...filter, title: value })}
          />
          <br />
          <br />
          <Spin spinning={isLoading}>
            <Radio.Group onChange={handleChange}>
              <Space direction="vertical">
                {data?.data.map((report, index) => (
                  <Radio key={report._id} value={index}>
                    {report.title}
                  </Radio>
                ))}
                <Pagination
                  size="small"
                  current={filter.skip}
                  pageSize={filter.limit}
                  total={data?.total}
                  onChange={(page, pageSize) => {
                    setFilter({
                      ...filter,
                      skip: page,
                      limit: pageSize,
                    });
                  }}
                />
              </Space>
            </Radio.Group>
          </Spin>
        </Col>
        <Col span={12}>
          {selectedReport && (
            <>
              <Typography.Title level={3} italic={true}>
                {selectedReport.title}
              </Typography.Title>
              <TableOfContents
                tableOfContent={JSON.parse(selectedReport?.content)?.root?.children}
              />
            </>
          )}
        </Col>
        <Col span={24}>
          <Table
            columns={columnsEventTable}
            dataSource={events ?? []}
            rowKey="_id"
            pagination={false}
            size="middle"
          />
        </Col>
      </Row>
    </Modal>
  );

  function handleChange(e: any) {
    if (!data?.data) return;
    setSelectedReport(data?.data[e.target.value]);
  }

  function handleCancel() {
    setEvent(null);
  }

  async function handleOk() {
    if (!selectedReport || selectedHeading === null || events === null) return;
    const contentParsed = JSON.parse(selectedReport?.content);
    const current = contentParsed.root.children[selectedHeading];
    const next = contentParsed.root.children[selectedHeading + 1];

    if (current?.type === "heading" && next?.type === "events") {
      addEventIds({
        id: next.id!,
        data:
          events?.map((e: IEventDto) => {
            return e._id + "";
          }) ?? [],
      });
    } else {
      const createdEventsId = await createReportEvents({
        event_ids: events?.map((e: IEventDto) => {
          return e._id + "";
        }),
      });
      contentParsed.root.children.splice(selectedHeading + 1, 0, {
        type: "events",
        id: createdEventsId,
        version: 1,
      });
      updateReport({
        content: JSON.stringify(contentParsed),
      });
    }
  }
}

interface TableOfContentsProps {
  tableOfContent: Array<any>;
}

function TableOfContents({ tableOfContent }: TableOfContentsProps): JSX.Element {
  const [selectedHeading, setSelectedHeading] = useReportModalState(
    (state) => [state.selectedHeading, state.setSelectedHeading],
    shallow,
  );

  return (
    <div className={styles.tableOfContents}>
      <div className={styles.navigationItemList} tabIndex={0}>
        {tableOfContent.map((children, index) => {
          if (children.type !== "heading") return null;

          return (
            <div
              className={classNames({
                [styles.navigationItem]: true,
                [styles.locationIndicatorHighlight]: selectedHeading === index,
              })}
              onClick={() => setSelectedHeading(index)}
              role="menuitem"
              key={index}
            >
              <div
                className={classNames(
                  styles.navigationItemContent,
                  navigationItemLevel[children?.tag as HeadingTagType],
                )}
              >
                {children?.children[0]?.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
