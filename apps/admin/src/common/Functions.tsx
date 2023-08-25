import { useEventByIdNewsList, useNewsDetail } from "@/pages/news/news.loader";

// add keywords to event
const getKeywords = (item: any) => {
  let keywords: any = [];

  item.new_list.forEach((news: any) => {
    const data = useNewsDetail(news && news._id);
    if (data.data) keywords.push(...data?.data?.keywords);
  });

  return keywords || [];
};

const getNewsList = (item: any) => {
  let newList: any = [];
  item.new_list.forEach((news: any) => {
    const data = useNewsDetail(news._id);

    if (data.data) newList.push(data.data);
  });

  return newList;
};

const getEventByNews = (listId: any) => {
  const events: any = [];

  listId.forEach((item: any) => {
    const { data } = useEventByIdNewsList(item);
    if (data) events.push(...data);
  });

  return events;
};

export { getKeywords, getNewsList, getEventByNews };
