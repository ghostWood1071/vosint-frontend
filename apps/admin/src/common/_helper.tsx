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

const downloadFileWord = (file: any) => {
  // const url = window.URL.createObjectURL(new Blob([res]));
  const url = window.URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;

  // get date dd/MM/yyyy
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm: any = today.getMonth() + 1; // Months start at 0!
  let dd: any = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const formattedToday = dd + "/" + mm + "/" + yyyy;
  link.setAttribute("download", `tin_tuc(${formattedToday}).docx`);
  document.body.appendChild(link);
  link.click();
};

export { getKeywords, getNewsList, getEventByNews, downloadFileWord };
