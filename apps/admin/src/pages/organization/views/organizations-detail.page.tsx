import { useNewsSelection } from "@/components/news/news-state";
import { useGetMe } from "@/pages/auth/auth.loader";
import { NewsFilter } from "@/pages/news/components/news-filter";
import { NewsTableItem } from "@/pages/news/components/table-news";
import { useNewsFilter } from "@/pages/news/news.context";
import {
  useDeleteNewsInNewsletter,
  useMutationChangeStatusSeenPost,
  useNewsIdToNewsletter,
} from "@/pages/news/news.loader";
import { getContentTranslation } from "@/services/job.service";
import { Empty } from "antd";
import { flatMap, unionBy } from "lodash";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { shallow } from "zustand/shallow";

import { CACHE_KEYS, useInfiniteNewsByObject, useNewsByObject } from "../organizations.loader";
import { useOrganizationsStore } from "../organizations.store";
import styles from "./organizations-detail.module.less";

interface Props {}

export const OrganizationsDetailPage: React.FC<Props> = () => {
  let { id } = useParams();
  const [skip, setSkip] = useState(1);
  const queryClient = useQueryClient();
  const keySearch = useOrganizationsStore((state) => state.keySearch);
  const { ref, inView } = useInView();
  const newsFilter = useNewsFilter();
  const { mutate: mutateChangeStatusSeenPost } = useMutationChangeStatusSeenPost();

  
  // useInfiniteNewsByObject
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteNewsByObject({
    ...newsFilter,
    // text_search:
    //   keySearch +
    //   (newsFilter.text_search !== "" && newsFilter.text_search !== undefined
    //     ? `${keySearch !== "" ? "+" : ""}"${newsFilter.text_search}"`
    //     : ""),
    text_search: newsFilter.text_search,
    // order: "pub_date",
    object_id: id
  });

  const { data: dataIAm } = useGetMe();

  const [setNewsSelection] = useNewsSelection((state) => [state.setNewsSelection], shallow);
  const { mutateAsync: mutateDelete } = useDeleteNewsInNewsletter();
  const { mutate: mutateAdd } = useNewsIdToNewsletter();

  let dataSource = unionBy(
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

  useEffect(() => {
    queryClient.removeQueries([CACHE_KEYS.NewsList]);
    setSkip(1);
    setNewsSelection([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    queryClient.removeQueries([CACHE_KEYS.NewsList]);
    setNewsSelection([]);
    fetchNextPage({ pageParam: { page_number: 1, page_size: 50 } });
    setSkip(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keySearch]);

  React.useEffect(() => {
    if (inView && skip * 50 <= data?.pages[0].total_record) {
      setSkip(skip + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    queryClient.removeQueries([CACHE_KEYS.NewsList]);
    setNewsSelection([]);
    fetchNextPage({ pageParam: { page_number: 1, page_size: 50 } });
    setSkip(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsFilter]);
  useEffect(() => {
    fetchNextPage({ pageParam: { page_number: skip, page_size: 50 } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);

  const [filterData, setFilterData] = useState<any>([]);
  const handleDeleteNews = (newsSelection: any) => {
    const newsIds = newsSelection.map((news: any) => news._id);
    dataSource = dataSource.filter(item => !newsIds.includes(item._id));
    setFilterData(dataSource);
  }

  return (
    <>
      <NewsFilter organization={true} handleDeleteNews={(newsSelection: any) => handleDeleteNews(newsSelection)}/>
      <div className={styles.mainContainer}>
        <div className={styles.bodyNews}>
          <table style={{ width: "100%" }}>
            <tbody>
              {dataSource[0] !== undefined ? (
                (filterData.length > 0 ? filterData : dataSource).map((item: any) => (
                  <NewsTableItem
                    userId={dataIAm._id}
                    key={item._id}
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
    const dataCache: any = queryClient.getQueryData(CACHE_KEYS.NewsList);
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

  function handleDelete(newsId: string, tag = id) {
    return mutateDelete({
      newsId: [newsId],
      newsletterId: tag!,
    });
  }

  function handleAdd(newsId: string, tag = id) {
    return mutateAdd({
      newsIds: [newsId],
      newsletterId: tag!,
    });
  }
};
