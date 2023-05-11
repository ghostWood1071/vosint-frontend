import { Button, DatePicker, Form, List, Space } from "antd";
import { flatMap, unionBy } from "lodash";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "react-query";

import { ReportModal } from "../news/components/report-modal";
import { useReportModalState } from "../news/components/report-modal/index.state";
import { EditEventModal } from "./components/edit-event-modal";
import { EventItem } from "./components/event-item";
import { CACHE_KEYS, useInfiniteEventsList, useMutationEvents } from "./event.loader";
import styles from "./event.module.less";

interface Props {}

interface FilterDateProps {
  start_date: string;
  end_date: string;
}

export const EventPage: React.FC<Props> = () => {
  const [skip, setSkip] = useState<number>(1);
  const [choosedEvent, setChoosedEvent] = useState<any>();
  const [typeModal, setTypeModal] = useState<string>("");
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [filterDate, setFilterDate] = useState<FilterDateProps>();
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();
  const [eventChoosedList, setEventChoosedList] = useState<any[]>([]);
  const { data, isFetchingNextPage, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteEventsList(filterDate);
  const { mutate } = useMutationEvents();
  const setEvent = useReportModalState((state) => state.setEvent);

  const dataSource = unionBy(flatMap(data?.pages.map((a) => a?.data?.map((e: any) => e))), "_id");
  useEffect(() => {
    queryClient.removeQueries([CACHE_KEYS]);
    setSkip(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (inView && skip * 30 <= data?.pages[0].total) {
      setSkip(skip + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    queryClient.removeQueries([CACHE_KEYS.ListEvents]);
    fetchNextPage({ pageParam: { skip: 1, limit: 30 } });
    setSkip(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDate]);

  useEffect(() => {
    queryClient.removeQueries([CACHE_KEYS.ListEvents]);
    setSkip(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchNextPage({ pageParam: { skip: skip, limit: 30 } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);
  return (
    <div className={styles.mainContainer}>
      <div className={styles.filterContainer}>
        <Space wrap>
          <Form.Item noStyle name="datetime">
            <DatePicker.RangePicker format={"DD/MM/YYYY"} onChange={handleChangeFilterTime} />
          </Form.Item>
          <Button onClick={handleAddManyEvent} disabled={eventChoosedList.length === 0}>
            Thêm sự kiện vào báo cáo ({eventChoosedList.length})
          </Button>
        </Space>
      </div>
      <div className={styles.body}>
        <List
          itemLayout="vertical"
          size="small"
          dataSource={dataSource}
          renderItem={(item) => {
            return (
              <EventItem
                item={item}
                onClickDelete={handleClickDelete}
                onClickEdit={handleClickEdit}
                eventChoosedList={eventChoosedList}
                lengthDataSource={dataSource?.length}
                setEventChoosedList={setEventChoosedList}
                onClickReport={handleClickReport}
              />
            );
          }}
        />
      </div>

      {isOpenModal ? (
        <EditEventModal
          isOpen={isOpenModal}
          setIsOpen={setIsOpenModal}
          choosedEvent={choosedEvent}
          functionEdit={handleEdit}
          functionDelete={handleDelete}
          typeModal={typeModal}
        />
      ) : null}
      <ReportModal />
      <div>
        {skip >= 1 ? (
          <button
            ref={ref}
            disabled={!hasNextPage || isFetchingNextPage}
            style={{ padding: 0, margin: 0, border: 0 }}
          >
            {isFetchingNextPage ? "Đang lấy thêm tin..." : ""}
          </button>
        ) : null}
      </div>
    </div>
  );

  function handleClickDelete(value: any) {
    setChoosedEvent(value);
    setTypeModal("delete");
    setIsOpenModal(true);
  }

  function handleClickEdit(value: any) {
    setChoosedEvent(value);
    setTypeModal("edit");
    setIsOpenModal(true);
  }

  function handleDelete(value: string) {
    mutate(
      { action: "delete", _id: value },
      {
        onSuccess: () => {
          setIsOpenModal(false);
        },
      },
    );
  }

  function handleEdit(value: any) {
    mutate(
      { action: "update", _id: value._id, data: value },
      {
        onSuccess: () => {
          setIsOpenModal(false);
        },
      },
    );
  }

  function handleChangeFilterTime(value: any) {
    const start_date = value?.[0].format("DD/MM/YYYY");
    const end_date = value?.[1].format("DD/MM/YYYY");
    setFilterDate({ start_date: start_date, end_date: end_date });
  }

  function handleAddManyEvent(value: any) {
    setEvent(eventChoosedList);
  }

  function handleClickReport(value: any) {
    setEvent(value);
  }
};
