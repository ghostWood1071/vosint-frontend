import { useSidebar } from "@/pages/app/app.store";
import { DatePicker, Form, Input } from "antd";
import { useState } from "react";

import { useNewsFilter, useNewsFilterDispatch } from "../news.context";
import styles from "./news-filter.module.less";
import "../less/news-filter.less";

export function NewsFilterTTXVN(): JSX.Element {
  const pinned = useSidebar((state) => state.pinned);
  const newsFilter = useNewsFilter();
  const setNewsFilter = useNewsFilterDispatch();
  const [internalTextSearch, setInternalTextSearch] = useState("");

  return (
    <div className={(pinned ? styles.filterWithSidebar : styles.filter) + " filter-ttxvn"}>
      <Form
        onValuesChange={handleFinish}
        initialValues={{
          sac_thai: "",
        }}
        style={{ width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap" }}
      >
        <Form.Item className={styles.item} name="datetime">
          <DatePicker.RangePicker inputReadOnly format={"DD/MM/YYYY"} />
        </Form.Item>
        <div className={styles.input}>
          <Input.Search
            className={styles.search}
            placeholder="Tìm kiếm"
            onSearch={handleSearch}
            value={internalTextSearch}
            onChange={(e) => setInternalTextSearch(e.target.value)}
          />
        </div>
      </Form>
    </div>
  );

  function handleFinish(values: Record<string, any>) {
    if ("datetime" in values) {
      values.startDate = values.datetime?.[0].format("DD/MM/YYYY");
      values.endDate = values.datetime?.[1].format("DD/MM/YYYY");
      delete values.datetime;
    }
    if ("language_source" in values) {
      values.language_source = values?.language_source?.join(",");
    }
    setNewsFilter({ ...newsFilter, ...values, text_search: internalTextSearch.trim() });
  }

  function handleSearch(value: string) {
    setNewsFilter({ ...newsFilter, text_search: value.trim() });
  }
}
