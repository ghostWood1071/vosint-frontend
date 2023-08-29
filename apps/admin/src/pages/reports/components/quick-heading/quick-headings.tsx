import { useEventContext } from "@/components/editor/plugins/event-plugin/event-context";
import { filterIsBetween } from "@/components/editor/plugins/events-plugin/events-components";
import { useEventsState } from "@/components/editor/plugins/events-plugin/events-state";
import { IEventDTO } from "@/models/event.type";
import { generateHTMLFromJSON } from "@/pages/events/components/event-item";
import { useGetNewsFromTTXVN } from "@/pages/news/news.loader";
import { getEvent } from "@/services/event.service";
import { useLexicalComposerContext } from "@aiacademy/editor";
import { DeleteOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Collapse, List, Row, Spin, Typography } from "antd";
import { AxiosError } from "axios";
import classNames from "classnames";
import { createEditor } from "lexical";
import moment from "moment";
import { useMemo } from "react";
import { UseQueryResult, useQueries } from "react-query";

import { queryStringDslTTXVN } from "./quick-heading.utils";
import styles from "./quick-headings.module.less";

export const headingLevel: Record<number, string> = {
  1: styles.h1,
  2: styles.h2,
  3: styles.h3,
  4: styles.h4,
  5: styles.h5,
};

interface Props {
  headingsData: IQuickHeading[];
  onDeleteEvent?: (reportId: string) => (eventId: string) => void;
}

export interface IQuickHeading {
  id: string;
  level: 1 | 2 | 3 | 4 | 5;
  title: string;
  required_keyword: string[];
  exclusion_keyword: string;
  eventIds: string[];
  username: string;
  ttxvn: boolean;
}

export function QuickHeadings({ headingsData, onDeleteEvent }: Props): JSX.Element {
  return (
    <div className={styles.headings}>
      {headingsData.map((heading) => (
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
            <Typography.Paragraph type="secondary">
              Cập nhật lần cuối bởi:
              {" " + heading?.username}
            </Typography.Paragraph>
          </Row>
          {heading.ttxvn ? (
            <EventsTTXVN
              required_keyword={heading.required_keyword}
              exclusion_keyword={heading.exclusion_keyword}
            />
          ) : (
            <Events
              headingId={heading.id}
              eventIds={heading.eventIds}
              onDeleteEvent={onDeleteEvent?.(heading.id)}
            />
          )}
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

function Events({ eventIds, headingId, onDeleteEvent }: EventsProps): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const { eventEditorConfig } = useEventContext();
  const eventEditor = useMemo(() => {
    if (eventEditorConfig === null) return null;

    const _eventEditor = createEditor({
      namespace: eventEditorConfig?.namespace,
      nodes: eventEditorConfig?.nodes,
      onError: (error) => eventEditorConfig?.onError(error, editor),
      theme: eventEditorConfig?.theme,
    });
    return _eventEditor;
  }, [eventEditorConfig]);

  const [startDate, endDate] = useEventsState((state) => state.dateTimeFilter);
  let events = useQueries(
    eventIds.map((id) => ({
      queryKey: ["event", id],
      queryFn: () => getEvent(id) as Promise<IEventDTO>,
      retry: function (failureCount: number, error: unknown) {
        if ((error as AxiosError)?.response?.status === 404) return false;
        return failureCount < 3;
      },
    })) ?? [],
  );

  if (eventEditor === null) return null;

  events = events.filter((event: any) => event.isSuccess);

  return (
    <div className={styles.events}>
      {events.length > 0 &&
        events.map((event: UseQueryResult<IEventDTO, any>, index) => {
          // if (event.isLoading) return <Spin key={index} />;

          // pass event not exist database
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
            event.data && (
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
                <Typography.Text italic>
                  Thời gian:{" "}
                  {event.data?.date_created
                    ? moment(event.data?.date_created).format("DD/MM/YYYY")
                    : null}
                </Typography.Text>
                <br />
                <div
                  dangerouslySetInnerHTML={{
                    __html: generateHTMLFromJSON(
                      event.data?.event_content ?? defaultContent,
                      eventEditor,
                    ),
                  }}
                />
                <Collapse ghost>
                  <Collapse.Panel
                    key={event.data?._id ?? index}
                    header="Danh sách tin nói về sự kiện"
                  >
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
            )
          );
        })}
    </div>
  );
}

function EventsTTXVN({
  required_keyword,
  exclusion_keyword,
}: {
  required_keyword: string[];
  exclusion_keyword: string;
}) {
  const [startDate, endDate] = useEventsState((state) => state.dateTimeFilter);

  const { data } = useGetNewsFromTTXVN({
    start_date: startDate,
    end_date: endDate,
    text_search: queryStringDslTTXVN({
      required_keyword: required_keyword,
      exclusion_keyword: exclusion_keyword,
    }),
  });

  const events = data?.result ?? [];

  return (
    <div className={styles.events}>
      {events.map((event: any, index: number) => (
        <div className={styles.event} key={index}>
          <Row justify="space-between" align={"middle"}>
            <Col span={21}>
              <Typography.Text ellipsis className={styles.eventTitle} italic strong>
                {event.Title}
              </Typography.Text>
            </Col>
          </Row>
          <Typography.Text italic>
            Thời gian: {event.PublishDate ? moment(event.PublishDate).format("DD/MM/YYYY") : null}
          </Typography.Text>
          <br />
          <div>{event.content}</div>
        </div>
      ))}
    </div>
  );
}

const defaultContent = `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Nội dung sự kiện","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`;
