import { DatePicker, Input, List, Select, Space } from "antd";
import { debounce, flatMap, unionBy } from "lodash";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "react-query";

import { useSidebar } from "../app/app.store";
import { TTXVNNewsItem } from "./components/ttsvn-news-item";
import { TTXVN_CACHE_KEYS, useInfiniteTTXVNList } from "./ttxvn.loader";
import styles from "./ttxvn.module.less";

interface Props {}

interface FilterEventProps {
  start_date?: string;
  end_date?: string;
  text_search?: string;
  crawling?: string;
}

export const TTXVNNewsPage: React.FC<Props> = () => {
  const [skip, setSkip] = useState<number>(1);
  const pinned = useSidebar((state) => state.pinned);
  const [filterTTXVN, setFilterTTXVN] = useState<FilterEventProps>();
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteTTXVNList({
    ...filterTTXVN,
    order: "PublishDate",
    name: "ttxvn",
  });
  const dataSource = unionBy(flatMap(data?.pages.map((a) => a?.result?.map((e: any) => e))), "_id");

  useEffect(() => {
    if (inView && skip * 50 <= data?.pages[0].total_record) {
      fetchNextPage({ pageParam: { page_number: skip + 1, page_size: 50 } });
      setSkip(skip + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    queryClient.removeQueries([TTXVN_CACHE_KEYS.ListTTXVN]);
    fetchNextPage({ pageParam: { page_number: 1, page_size: 50 } });
    setSkip(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterTTXVN]);

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
            defaultValue={""}
            onChange={handleChangeTypeCrawl}
          >
            <Select.Option value={""}>Tất cả tin</Select.Option>
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

  function handleChangeFilterTime(value: any) {
    const start_date = value?.[0].format("DD/MM/YYYY");
    const end_date = value?.[1].format("DD/MM/YYYY");
    setFilterTTXVN({ ...filterTTXVN, start_date: start_date, end_date: end_date });
  }

  function handleChangeTypeCrawl(value: string) {
    setFilterTTXVN({ ...filterTTXVN, crawling: value });
  }
};
