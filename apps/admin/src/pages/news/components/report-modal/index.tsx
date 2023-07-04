import { EVENT_CACHE_KEYS } from "@/pages/events/event.loader";
import { navigationItemLevel } from "@/pages/reports/components/heading-toc";
import { HeadingsData } from "@/pages/reports/components/headings";
import { CACHE_KEYS, useReports, useUpdateReport } from "@/pages/reports/report.loader";
import { IEventDto, TReport } from "@/services/report-type";
import { convertTimeToShowInUI } from "@/utils/tool-validate-string";
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
import produce from "immer";
import { union } from "lodash";
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
      render: (item) => {
        return <>{convertTimeToShowInUI(item)}</>;
      },
    },
  ];

  return (
    <Modal
      open={events !== null}
      title="Chọn báo cáo"
      onCancel={handleCancel}
      onOk={handleOk}
      maskClosable={false}
      width="70%"
      confirmLoading={isLoadingUpdate}
      getContainer="#modal-mount"
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Input.Search
            placeholder={"Tìm theo tên báo cáo"}
            onSearch={(value) => setFilter({ ...filter, title: value.trim() })}
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
              <TableOfContents headingsData={selectedReport?.headings ?? []} />
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
    const headingsUpdated = produce(selectedReport, (draft) => {
      const selected = draft.headings.find((h) => h.id === selectedHeading);
      if (!selected) return;

      selected.eventIds = union(
        selected.eventIds,
        events.map((e) => e._id),
      ) as string[];
    });

    updateReport(
      {
        headings: headingsUpdated.headings,
        event_list: events.map((e) => e._id),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(EVENT_CACHE_KEYS.ListEvents);
        },
      },
    );
  }
}

interface TableOfContentsProps {
  headingsData: HeadingsData[];
}

function TableOfContents({ headingsData }: TableOfContentsProps): JSX.Element {
  const [selectedHeading, setSelectedHeading] = useReportModalState(
    (state) => [state.selectedHeading, state.setSelectedHeading],
    shallow,
  );

  return (
    <div className={styles.tableOfContents}>
      <div className={styles.navigationItemList} tabIndex={0}>
        {headingsData.map(({ id, level, title }) => {
          return (
            <div
              className={classNames({
                [styles.navigationItem]: true,
                [styles.locationIndicatorHighlight]: selectedHeading === id,
              })}
              onClick={() => setSelectedHeading(id)}
              role="menuitem"
              key={id}
            >
              <div className={classNames(styles.navigationItemContent, navigationItemLevel[level])}>
                {title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
