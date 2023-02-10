import React from "react";

import { NewsCarousel } from "../components/news-carousel";
import { NewsTable } from "../components/news-table";
import { useNewsList } from "../news.loader";

interface Props {}

export const NewsListPage: React.FC<Props> = () => {
  const { data } = useNewsList();

  return (
    <>
      <NewsCarousel data={Array.isArray(data) ? data : []} />
      <NewsTable dataSource={Array.isArray(data) ? data : []} />
    </>
  );
};
