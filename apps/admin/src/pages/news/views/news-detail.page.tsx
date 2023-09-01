import { getEventByNews } from "@/common/_helper";
import { useNewsSelection } from "@/components/news/news-state";
import { useGetMe } from "@/pages/auth/auth.loader";
import { SystemEventItem } from "@/pages/events/components/system-event-item";
import { getContentTranslation } from "@/services/job.service";
import { Empty, List } from "antd";
import { flatMap, unionBy } from "lodash";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { shallow } from "zustand/shallow";

import EventsByNews from "../components/EventsByNews";
import { NewsFilter } from "../components/news-filter";
import { NewsFilterV2 } from "../components/news-filter-v2";
import { NewsTableItem } from "../components/table-news";
import { useNewsFilter } from "../news.context";
import {
  CACHE_KEYS,
  useDeleteNewsInNewsletter,
  useEventsByIdNewsList,
  useInfiniteNewsFormElt,
  useMutationChangeStatusSeenPost,
  useMutationSwitch,
  useNewsIdToNewsletter,
} from "../news.loader";
import styles from "./news-detail.module.less";

export const NewsDetailPage = () => {
  let { newsletterId, tag } = useParams();
  const [setNewsSelection] = useNewsSelection((state) => [state.setNewsSelection], shallow);
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();
  const [skip, setSkip] = useState(1);
  const newsFilter = useNewsFilter();
  const { mutate: mutateChangeStatusSeenPost } = useMutationChangeStatusSeenPost();

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteNewsFormElt(
    newsletterId!,
    newsFilter,
    tag ?? "",
  );


  const { data: dataIAm } = useGetMe();
  const { mutateAsync: mutateDelete } = useDeleteNewsInNewsletter();
  const { mutate: mutateAdd } = useNewsIdToNewsletter();

  const [eventChoosedList, setEventChoosedList] = useState<any[]>([]);
  const { mutate } = useMutationSwitch();
  const [dataEvents, setDataEvents] = useState([]);
  const [status, setStatus] = useState(false);

  const dataSource = unionBy(
    flatMap(
      data?.pages.map((a) =>
        a?.result?.map((e: any) => ({
          ...e,
          isStar: dataIAm?.news_bookmarks.includes(e._id),
          isBell: dataIAm?.vital_list.includes(e._id),
        })),
      ),
    ),
    "_id",
  );

  // const data1 =data?.pages.map((a) =>
  //   a?.result?.map((e: any) => ({
  //     ...e,
  //   })),
  // ),

  useEffect(() => {
    queryClient.removeQueries([CACHE_KEYS.NewsList, newsletterId]);
    setNewsSelection([]);
    fetchNextPage({ pageParam: { page_number: 1, page_size: 50 } });
    setSkip(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsletterId, newsFilter]);

  useEffect(() => {
    if (inView && skip * 50 < data?.pages[data?.pages.length - 1].total_record) {
      fetchNextPage({ pageParam: { page_number: skip + 1, page_size: 50 } });
      setSkip(skip + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <>
      {/* <NewsFilterV2 /> */}
      <NewsFilter />
      <div className={styles.mainContainer}>
        <div className={styles.bodyNews}>
          <table style={{ width: "100%" }}>
            <tbody>
              {dataSource[0] !== undefined ? (
                dataSource?.map((item) => (
                  <NewsTableItem
                    userId={dataIAm?._id}
                    key={item?._id}
                    item={item}
                    onDelete={handleDelete}
                    onAdd={handleAdd}
                    typeTranslate={newsFilter.type_translate}
                    lengthDataSource={dataSource?.length}
                    setSeen={handleSetSeen}
                    handleUpdateCache={handleUpdateCache}
                  />
                ))
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"Trống"} />
              )}
            </tbody>
          </table>
          <div>
            {skip >= 1 ? (
              <button
                ref={ref}
                disabled={!hasNextPage || isFetchingNextPage}
                style={{ padding: 0, margin: 0, border: 0 }}
              >
                {isFetchingNextPage ? "Đang lấy tin..." : ""}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );

  async function handleUpdateCache(value: string, attachedFunction: Function) {
    const dataCache: any = queryClient.getQueriesData([
      CACHE_KEYS.NewsList,
      newsletterId,
    ])?.[0]?.[1] ?? {
      pages: [],
    };
    // This loop iterates over the pages in the dataCache object and their results to find the index of the item with the given value.
    // It uses two index variables, index1 and index2, to keep track of the current page and item indices.
    // If the item is found, the loop breaks and the indices are stored in index1 and index2.
    // If the item is not found, index1 and index2 remain 0.
    let index1 = 0;
    let index2 = 0;
    for (let i = 0; i < dataCache.pages.length; i++) {
      for (let j = 0; j < dataCache.pages[i].result.length; j++) {
        if (dataCache.pages[i].result[j]._id === value) {
          index2 = j;
          break;
        }
      }
      if (index2 !== 0) {
        index1 = i;
        break;
      }
    }
    const a = dataCache.pages[index1].result[index2];
    let result = await getContentTranslation(a?.source_language, a?.["data:content"]);
    if (result) {
      attachedFunction();
      dataCache.pages[index1].result[index2]["data:content_translate"] = result.results;
      queryClient.setQueryData(CACHE_KEYS.NewsList, dataCache);
    }
  }

  function handleSetSeen(checkedSeen: boolean, data: any) {
    if (checkedSeen) {
      mutateChangeStatusSeenPost({ action: "set-seen", data: data });
    } else {
      mutateChangeStatusSeenPost({ action: "set-unseen", data: data });
    }
  }

  function handleDelete(newsId: string, tag = newsletterId) {
    return mutateDelete({
      newsId: [newsId],
      newsletterId: tag!,
    });
  }

  function handleAdd(newsId: string, tag = newsletterId) {
    return mutateAdd({
      newsIds: [newsId],
      newsletterId: tag!,
    });
  }
};
