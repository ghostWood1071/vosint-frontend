import { Button, DatePicker, Empty, Input, List, Space } from "antd";
import { flatMap, unionBy } from "lodash";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "react-query";

import { useSidebar } from "../app/app.store";
import { QuickReportModal } from "../news/components/quick-report-modal";
import { useQuickReportModalState } from "../news/components/quick-report-modal/index.state";
import { ReportModal } from "../news/components/report-modal";
import EventSummaryModal from "./components/event-summary-modal";
import { SystemEventItem } from "./components/system-event-item";
import { EVENT_CACHE_KEYS, useInfiniteEventsList } from "./event.loader";
import styles from "./event.module.less";

interface Props {}

interface FilterEventProps {
  start_date?: string;
  end_date?: string;
  event_name?: string;
}

export const SystemEventPage: React.FC<Props> = () => {
  const [skip, setSkip] = useState<number>(1);
  const pinned = useSidebar((state) => state.pinned);
  const [filterEvent, setFilterEvent] = useState<FilterEventProps>();
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();
  const [eventChoosedList, setEventChoosedList] = useState<any[]>([]);
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteEventsList({
    ...filterEvent,
    system_created: true,
  });
  const setQuickEvent = useQuickReportModalState((state) => state.setEvent);
  const dataSource = unionBy(flatMap(data?.pages.map((a) => a?.data?.map((e: any) => e))), "_id");
  useEffect(() => {
    if (inView && skip * 50 <= data?.pages[0].total) {
      fetchNextPage({ pageParam: { skip: skip + 1, limit: 50 } });
      setSkip(skip + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    queryClient.removeQueries([EVENT_CACHE_KEYS.ListEvents]);
    fetchNextPage({ pageParam: { skip: 1, limit: 50 } });
    setSkip(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterEvent]);

  return (
    <div className={styles.mainContainer}>
      <div className={pinned ? styles.filterContainerWithSidebar : styles.filterContainer}>
        <Space wrap>
          <DatePicker.RangePicker format={"DD/MM/YYYY"} onChange={handleChangeFilterTime} />
          <Input.Search
            onSearch={(value) => {
              setFilterEvent({ ...filterEvent, event_name: value });
            }}
          />
          {/* summary */}
          <EventSummaryModal eventChoosedList={eventChoosedList} isUserEvent={false} />
          <Button
            style={{
              borderColor: eventChoosedList.length === 0 ? "rgb(230,230,230)" : "#1890ff",
            }}
            onClick={handleAddManyEvent}
            disabled={eventChoosedList.length === 0}
          >
            Thêm sự kiện vào báo cáo ({eventChoosedList.length})
          </Button>
        </Space>
      </div>
      <div className={styles.body}>
        <div className={styles.recordsContainer}>
          {dataSource[0] !== undefined ? (
            <List
              itemLayout="vertical"
              size="small"
              dataSource={dataSource}
              renderItem={(item) => {
                return (
                  <SystemEventItem
                    item={item}
                    eventChoosedList={eventChoosedList}
                    setEventChoosedList={setEventChoosedList}
                  />
                );
              }}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"Trống"} />
          )}
          {skip >= 1 ? (
            <div>
              <button
                ref={ref}
                disabled={!hasNextPage || isFetchingNextPage}
                style={{ padding: 0, margin: 0, border: 0 }}
              >
                {isFetchingNextPage ? "Đang lấy sự kiện..." : ""}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <ReportModal />
      <QuickReportModal />
    </div>
  );

  function handleChangeFilterTime(value: any) {
    const start_date = value?.[0].format("DD/MM/YYYY");
    const end_date = value?.[1].format("DD/MM/YYYY");
    setFilterEvent({ ...filterEvent, start_date: start_date, end_date: end_date });
  }

  function handleAddManyEvent(value: any) {
    setQuickEvent(eventChoosedList);
  }
};
