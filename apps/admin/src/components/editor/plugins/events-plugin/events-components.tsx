import { IEventDTO } from "@/models/event.type";
import { useGetReportEvents } from "@/pages/reports/report.loader";
import { CACHE_KEYS, useRemoveEventIdsToReport } from "@/pages/reports/report.loader";
import { getEvent } from "@/services/event.service";
import { DeleteOutlined } from "@ant-design/icons";
import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";
import { Button, Col, Collapse, List, Row, Spin, Typography } from "antd";
import type { ElementFormatType, NodeKey } from "lexical";
import moment from "moment";
import { useInView } from "react-intersection-observer";
import { useQueries, useQueryClient } from "react-query";

import { useEventsState } from "./events-state";
import styles from "./index.module.less";

type EventsComponentProps = {
  className: Readonly<{
    base: string;
    focus: string;
  }>;
  format: ElementFormatType | null;
  nodeKey: NodeKey;
  eventsId: string;
};

export function EventsComponent({ className, eventsId, format, nodeKey }: EventsComponentProps) {
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();
  const [startDate, endDate] = useEventsState((state) => state.dateTimeFilter);
  const { data, isLoading } = useGetReportEvents(eventsId, {
    enabled: inView,
  });
  const results = useQueries(
    (data?.event_ids ?? []).map((id) => ({
      queryKey: ["event", id],
      queryFn: () => getEvent(id) as Promise<IEventDTO>,
    })) ?? [],
  );
  const {
    mutate: mutateDelete,
    isLoading: isLoadingDelete,
    variables: variablesDelete,
  } = useRemoveEventIdsToReport({
    onSuccess: () => {
      queryClient.invalidateQueries([CACHE_KEYS.REPORT_EVENT, eventsId]);
    },
  });

  if (isLoading) return <Spin />;

  return (
    <BlockWithAlignableContents className={className} format={format} nodeKey={nodeKey}>
      <div className={styles.root} ref={ref}>
        {results?.map((result, index) => {
          if (result.isLoading) return <Spin key={index} />;
          if (result.isError) return <div key={index}>Error</div>;

          if (
            startDate &&
            endDate &&
            !filterIsBetween(result?.data?.date_created ?? null, startDate, endDate)
          )
            return null;

          return (
            <div key={result.data?._id}>
              <Row align="middle" justify="space-between">
                <Col span={22}>
                  <Typography.Title level={5} className={styles.title}>
                    {result.data?.event_name}
                  </Typography.Title>
                </Col>
                <Col span={2}>
                  <Button
                    danger
                    type="text"
                    title="Xoá sự kiện"
                    icon={<DeleteOutlined />}
                    loading={isLoadingDelete && variablesDelete?.data?.[0] === result.data?._id}
                    onClick={handleDelete}
                  />
                </Col>
              </Row>
              <Typography.Text>Thời gian: {result.data?.date_created}</Typography.Text>
              <br />
              <Typography.Text italic>{result.data?.event_content}</Typography.Text>
              <Collapse ghost>
                <Collapse.Panel
                  key={result.data?._id ?? index}
                  header="Danh sách tin nói về sự kiện"
                >
                  <List
                    dataSource={result.data?.new_list ?? []}
                    renderItem={(item) => {
                      return (
                        <List.Item>
                          <Typography.Link
                            target="_blank"
                            href={item?.["data:url"]}
                            rel="noopener noreferrer"
                          >
                            {item?.["data:title"]}
                          </Typography.Link>
                        </List.Item>
                      );
                    }}
                  />
                </Collapse.Panel>
              </Collapse>
            </div>
          );

          function handleDelete() {
            mutateDelete({
              id: eventsId,
              data: [result.data!._id!],
            });
          }
        })}
      </div>
    </BlockWithAlignableContents>
  );
}

export function filterIsBetween(date: string | null, start: string, end: string) {
  if (!date) return false;
  const dateParse = moment(date).toDate();
  const startParse = moment(start, "DD/MM/YYYY").toDate();
  const endParse = moment(end, "DD/MM/YYYY").toDate();

  return moment(dateParse).isBetween(startParse, endParse, undefined, "[]");
}
