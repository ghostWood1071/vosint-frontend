import { EventEditorParagraph } from "@/components/editor/plugins/event-plugin/event-dialog";
import { filterIsBetween } from "@/components/editor/plugins/events-plugin/events-components";
import { useEventsState } from "@/components/editor/plugins/events-plugin/events-state";
import { IEventDto } from "@/services/report-type";
import { getEvent } from "@/services/report.service";
import { DeleteOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Collapse, List, Row, Spin, Typography } from "antd";
import { AxiosError } from "axios";
import classNames from "classnames";
import { UseQueryResult, useQueries } from "react-query";

import styles from "./headings.module.less";

export const headingLevel: Record<number, string> = {
  1: styles.h1,
  2: styles.h2,
  3: styles.h3,
  4: styles.h4,
  5: styles.h5,
};

interface Props {
  headingsData: HeadingsData[];
  onDeleteEvent?: (reportId: string) => (eventId: string) => void;
}

export interface HeadingsData {
  id: string;
  level: 1 | 2 | 3 | 4 | 5;
  title: string;
  eventIds: string[];
}

export function Headings({ headingsData, onDeleteEvent }: Props): JSX.Element {
  return (
    <div className={styles.headings}>
      {headingsData &&
        headingsData.map((heading) => (
          <div
            key={heading.id}
            id={heading.id}
            className={classNames({
              [styles.heading]: true,
              [headingLevel[heading.level]]: !!heading.level,
            })}
          >
            <Row justify={"space-between"} align={"middle"}>
              <Typography.Title level={heading.level}>{heading.title}</Typography.Title>
            </Row>
            <Events
              headingId={heading.id}
              eventIds={heading.eventIds}
              onDeleteEvent={onDeleteEvent?.(heading.id)}
            />
          </div>
        ))}
    </div>
  );
}

interface EventsProps {
  headingId: string;
  eventIds: string[];
  onDeleteEvent?: (eventId: string) => void;
}
function Events({ eventIds, headingId, onDeleteEvent }: EventsProps): JSX.Element {
  const [startDate, endDate] = useEventsState((state) => state.dateTimeFilter);
  const events = useQueries(
    eventIds.map((id) => ({
      queryKey: ["event", id],
      queryFn: () => getEvent(id) as Promise<IEventDto>,
      retry: function (failureCount: number, error: unknown) {
        if ((error as AxiosError)?.response?.status === 404) return false;
        return failureCount < 3;
      },
    })) ?? [],
  );

  return (
    <div className={styles.events}>
      {events.map((event: UseQueryResult<IEventDto, any>, index) => {
        // if (event.isLoading) return <Spin key={index} />;
        // if (event.isError) {
        //   if (event.error as AxiosError) {
        //     const error = event.error as AxiosError;
        //     if (error.response?.status === 404) return null;
        //   }

        //   return <Alert key={index} type="warning" message="Error" />;
        // }

        // if (
        //   startDate &&
        //   endDate &&
        //   !filterIsBetween(event?.data?.date_created ?? null, startDate, endDate)
        // )
        //   return null;

        return (
          <div key={event.data?._id + `headingId` + headingId} className={styles.event}>
            <Row justify="space-between" align={"middle"}>
              <Col span={21}>
                <Typography.Text ellipsis className={styles.eventTitle} italic strong>
                  {event.data?.event_name}
                </Typography.Text>
              </Col>
              <Col>
                <Button
                  danger
                  type="text"
                  title={`Xoá ${event.data?.event_name}`}
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    onDeleteEvent?.(event.data?._id ?? "");
                  }}
                />
              </Col>
            </Row>
            <Typography.Text italic>Thời gian: {event.data?.date_created}</Typography.Text>
            <br />
            <EventEditorParagraph data={event.data?.event_content ?? defaultContent} />
            <Collapse ghost>
              <Collapse.Panel key={event.data?._id ?? index} header="Danh sách tin nói về sự kiện">
                <List
                  dataSource={event.data?.new_list ?? []}
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
      })}
    </div>
  );
}

const defaultContent = `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Nội dung sự kiện","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`;
