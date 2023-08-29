import { OutlineEventIcon } from "@/assets/icons";
import { useSidebar } from "@/pages/app/app.store";
import { QuickReportModal } from "@/pages/news/components/quick-report-modal";
import { useQuickReportModalState } from "@/pages/news/components/quick-report-modal/index.state";
import { ReportModal } from "@/pages/news/components/report-modal";
import { useNewsFilter } from "@/pages/news/news.context";
import { getNewsDetailUrl } from "@/pages/router";
import { ReloadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Empty, Input, List, Space } from "antd";
import { flatMap, unionBy } from "lodash";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

import { EVENT_CACHE_KEYS, useInfiniteEventFormElt } from "../event.loader";
import styles from "../event.module.less";
import EventSummaryModal from "./event-summary-modal";
import { SystemEventItem } from "./system-event-item";

interface Props {}

interface FilterEventProps {
  start_date?: string;
  end_date?: string;
  event_name?: string;
}

export const EventDetailPage: React.FC<Props> = () => {
  const [skip, setSkip] = useState<number>(1);
  const pinned = useSidebar((state) => state.pinned);
  const [filterEvent, setFilterEvent] = useState<FilterEventProps>();
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();
  let { newsletterId: detailIds, tag } = useParams();
  const navigate = useNavigate();
  const [eventChoosedList, setEventChoosedList] = useState<any[]>([]);
  const newsFilter = useNewsFilter();

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteEventFormElt(
    detailIds!,
    newsFilter,
    tag ?? "",
  );
  const setQuickEvent = useQuickReportModalState((state) => state.setEvent);
  // const dataSource = unionBy(flatMap(data?.pages.map((a) => a?.data?.map((e: any) => e))), "_id");
  const dataSource = unionBy(flatMap(data?.pages.map((a) => a?.result?.map((e: any) => e))), "_id");

  // let listEvent: any = [];
  // if (dataSource[0]) {
  //   for (const [key, value] of Object.entries(dataSource[0])) {
  //     listEvent = [value, ...listEvent];
  //   }
  // }
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
  }, [detailIds, newsFilter]);

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
          <Button
            className={styles.item}
            icon={<OutlineEventIcon />}
            onClick={() => {
              // setStatus(!status);
              // handleConvert(status);
              navigate(getNewsDetailUrl(detailIds, tag));
            }}
            title={"Hiển thị danh sách tin"}
          />
        </Space>
      </div>
      <div className={styles.body}>
        <div className={styles.recordsContainer}>
          {/* {data?.pages[0].tree && dataSource[0][data?.pages[0].tree][0] !== undefined ? ( */}
          {dataSource && dataSource.length > 0 ? (
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
