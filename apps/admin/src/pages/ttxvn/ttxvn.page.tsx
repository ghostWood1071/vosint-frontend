import { PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, List, Modal, Select, Space } from "antd";
import { debounce, flatMap, unionBy } from "lodash";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "react-query";

import { useSidebar } from "../app/app.store";
import { TTXVNNewsItem } from "./components/ttsvn-news-item";
import { TTXVN_CACHE_KEYS, useInfiniteTTXVNList, useMutationTTXVN } from "./ttxvn.loader";
import styles from "./ttxvn.module.less";

interface Props {}

interface FilterEventProps {
  start_date?: string;
  end_date?: string;
  text_search?: string;
  check_crawl?: string;
}

export const TTXVNNewsPage: React.FC<Props> = () => {
  const [skip, setSkip] = useState<number>(1);
  const pinned = useSidebar((state) => state.pinned);
  const [filterTTXVN, setFilterTTXVN] = useState<FilterEventProps>();
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteTTXVNList(filterTTXVN);
  const { mutate } = useMutationTTXVN();

  const dataSource = unionBy(flatMap(data?.pages.map((a) => a?.data?.map((e: any) => e))), "_id");

  useEffect(() => {
    if (inView && skip * 50 <= data?.pages[0].total) {
      setSkip(skip + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    queryClient.removeQueries([TTXVN_CACHE_KEYS.ListTTXVN]);
    fetchNextPage({ pageParam: { skip: 1, limit: 50 } });
    setSkip(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterTTXVN]);

  useEffect(() => {
    queryClient.removeQueries([TTXVN_CACHE_KEYS.ListTTXVN]);
    setSkip(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchNextPage({ pageParam: { skip: skip, limit: 50 } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);

  const ProcessSearch = debounce((value) => {
    setFilterTTXVN({ ...filterTTXVN, text_search: value.trim() });
  }, 500);

  return (
    <div className={styles.mainContainer}>
      <div className={pinned ? styles.filterContainerWithSidebar : styles.filterContainer}>
        <Space wrap>
          <DatePicker.RangePicker format={"DD/MM/YYYY"} onChange={handleChangeFilterTime} />
          <Input.Search
            onChange={(event) => {
              ProcessSearch(event.target.value);
            }}
          />
          <Select
            style={{ width: 120 }}
            size="middle"
            defaultValue={"all"}
            onChange={handleChangeTypeCrawl}
          >
            <Select.Option value={"all"}>Tất cả tin</Select.Option>
            <Select.Option value={"crawled"}>Tin đã lấy</Select.Option>
            <Select.Option value={"not_crawl"}>Tin chưa lấy</Select.Option>
          </Select>
        </Space>
      </div>
      <div className={styles.body}>
        <div className={styles.recordsContainer}>
          <List
            itemLayout="vertical"
            size="small"
            dataSource={dataSource}
            renderItem={(item) => {
              return <TTXVNNewsItem item={item} />;
            }}
          />
          {skip >= 1 ? (
            <div>
              <button
                ref={ref}
                disabled={!hasNextPage || isFetchingNextPage}
                style={{ padding: 0, margin: 0, border: 0 }}
              >
                {isFetchingNextPage ? "Đang lấy tin..." : ""}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  function handleClickDelete(value: any) {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xoá sự kiện này?",
      okText: "Xoá",
      cancelText: "Huỷ",
      onOk: () => {
        handleDelete(value._id);
      },
    });
  }

  function handleDelete(value: string) {
    mutate({ action: "delete", _id: value });
  }

  function handleEdit(value: any) {
    mutate(
      { action: "update", _id: value._id, data: value },
      {
        onSuccess: () => {},
      },
    );
  }

  function handleAdd(value: any) {
    mutate(
      { action: "add", data: value },
      {
        onSuccess: () => {},
      },
    );
  }

  function handleChangeFilterTime(value: any) {
    const start_date = value?.[0].format("DD/MM/YYYY");
    const end_date = value?.[1].format("DD/MM/YYYY");
    setFilterTTXVN({ ...filterTTXVN, start_date: start_date, end_date: end_date });
  }

  function handleChangeTypeCrawl(value: string) {
    setFilterTTXVN({ ...filterTTXVN, check_crawl: value });
  }
};
