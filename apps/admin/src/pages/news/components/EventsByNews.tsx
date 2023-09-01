import { getEventByNews } from "@/common/_helper";
import { useEventsState } from "@/components/editor/plugins/events-plugin/events-state";
import { EventItem } from "@/pages/events/components/event-item";
import { SystemEventItem } from "@/pages/events/components/system-event-item";
import { List } from "antd";
import { useState } from "react";
import shallow from "zustand/shallow";

import styles from "../../events/components/system-event-item.module.less";
import { useEventsByIdNewsList } from "../news.loader";

const EventsByNews = ({ newsletterId, dataSource }: { newsletterId: any; dataSource: any }) => {
  const [eventChoosedList, setEventChoosedList] = useState<any[]>([]);
  const dataEvents =
    dataSource?.length > 0 && getEventByNews(dataSource.map((item: any) => item._id));

  // call api get event by news
  // const [dateTime, setDateTime] = useEventsState(
  //   (state) => [state.dateTimeFilter, state.setDateTimeFilter],
  //   shallow,
  // );
  // const [eventNumber, setEventNumber] = useState(5);
  // const { data } = useEventsByIdNewsList({
  //   newsletterId: newsletterId,
  //   startDate: dateTime[0],
  //   endDate: dateTime[1],
  //   eventNumber: eventNumber,
  // });

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.body}>
          <div className={styles.recordsContainer}>
            <List
              itemLayout="vertical"
              size="small"
              dataSource={dataEvents}
              renderItem={(item) => {
                return (
                  <></>
                  // <SystemEventItem
                  //   item={item}
                  //   eventChoosedList={eventChoosedList}
                  //   setEventChoosedList={setEventChoosedList}
                  // />
                );
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsByNews;
