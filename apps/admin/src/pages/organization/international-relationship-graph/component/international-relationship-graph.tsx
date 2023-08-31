import { convertTimeToShowInUI } from "@/utils/tool-validate-string";
import { CaretRightOutlined } from "@ant-design/icons";
import { Col, Collapse, DatePicker, Empty, Row, Select } from "antd";
import { flatMap, unionBy } from "lodash";
import React, { useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "react-query";
import { useSearchParams } from "react-router-dom";

import {
  CACHE_KEYS,
  useGetKhachTheAndChuThe,
  useInfiniteuseGetEventBaseOnKTAndCT,
} from "../../organizations.loader";
import styles from "./international-relationship.module.less";

interface SelectCustomProps {
  value: string | undefined;
  label: string | undefined;
}

export const InternationalRelationshipGraph = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [skip, setSkip] = useState<number>(1);
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();
  const [valueObject1, setValueObject1] = React.useState<SelectCustomProps>({
    value: "",
    label: "",
  });
  const [valueObject2, setValueObject2] = React.useState<SelectCustomProps>({
    value: "",
    label: "",
  });
  const [filterEvent, setFilterEvent] = useState<Record<string, string>>({
    chu_the: valueObject1.label ?? "",
    khach_the: valueObject2.label ?? "",
  });

  const { data: dataKhachThe } = useGetKhachTheAndChuThe({
    skip: "1",
    limit: "50",
    text_search: searchParams.get("text_search_chu_the") ?? "",
  });
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteuseGetEventBaseOnKTAndCT(filterEvent);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const dataEvents = unionBy(
    flatMap(data?.pages?.map((a) => a?.result?.map((e: any) => e))),
    "_id",
  );

  function groupByDateCreated(array: any) {
    const grouped = array.reduce((prev: any, curr: any) => {
      if (curr?.date_created in prev) {
        prev[curr?.date_created].push(curr);
      } else {
        prev[curr?.date_created] = [curr];
      }
      return prev;
    }, {});
    const result: any[] = [];
    if (Object.keys(grouped)[0]) {
      Object.keys(grouped).forEach((key) => {
        result.push({ id: key, date: key, data: grouped[key] });
      });
    }

    return result;
  }
  React.useEffect(() => {
    const dataTime = groupByDateCreated(dataEvents);
    setTimelineData(dataTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  React.useEffect(() => {
    if (inView && skip * 50 <= data?.pages[0].total) {
      fetchNextPage({ pageParam: { skip: skip + 1, limit: 50 } });
      setSkip(skip + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  React.useEffect(() => {
    queryClient.removeQueries([CACHE_KEYS.ListEvent]);
    fetchNextPage({ pageParam: { skip: 1, limit: 50 } });
    setSkip(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterEvent]);

  React.useEffect(() => {
    setFilterEvent({ chu_the: valueObject1.label ?? "", khach_the: valueObject2.label ?? "" });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueObject1, valueObject2]);

  const dataSelect = () => {
    const data1 = (dataKhachThe?.data || []).map((d: any) => ({
      value: d._id,
      label: d.name,
    }));
    return [{ value: "", label: "" }].concat(data1);
  };
  return (
    <Row>
      <Col span={24}>
        <div className={styles.titleContainer}>
          <div className={styles.container1}>
            <span className={styles.titleSelect}>Đối tượng 1:</span>
            <Select
              showSearch
              className={styles.newsEventSelect}
              value={valueObject1.value}
              placeholder={"Nhập tiêu đề tin"}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={handleSearch1}
              onChange={handleChangeObject1}
              notFoundContent={null}
              options={dataSelect()}
            />
          </div>
          <div className={styles.container1}>
            <span className={styles.titleSelect}>Đối tượng 2:</span>
            <Select
              showSearch
              className={styles.newsEventSelect}
              value={valueObject2.value}
              placeholder={"Nhập tiêu đề tin"}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={handleSearch1}
              onChange={handleChangeObject2}
              notFoundContent={null}
              options={dataSelect()}
            />
          </div>
          <DatePicker.RangePicker
            inputReadOnly
            format={"DD/MM/YYYY"}
            onChange={handleChangeFilterTime}
          />
        </div>
      </Col>
      {valueObject1.label !== "" || valueObject2.label !== "" ? (
        <Col span={24}>
          <div className={styles.allEventBody}>
            <Row style={{ display: "flex", justifyContent: "center" }}>
              <Col span={12}>
                <div className={styles.leftTableTitle}>
                  {valueObject1.label + " -> " + valueObject2.label}
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.rightTableTitle}>
                  {valueObject2.label + " -> " + valueObject1.label}
                </div>
              </Col>
              {timelineData.length > 0 ? (
                <Col span={24}>
                  <div className="timeline">
                    {timelineData.map((item, index) => (
                      <Items
                        object1={valueObject1?.label}
                        object2={valueObject2?.label}
                        key={index}
                        item={item}
                      />
                    ))}
                  </div>
                </Col>
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"Trống"} />
              )}

              {skip >= 1 ? (
                <div>
                  <button
                    ref={ref}
                    disabled={!hasNextPage || isFetchingNextPage}
                    style={{ padding: 0, margin: 0, border: 0 }}
                  >
                    {isFetchingNextPage ? "Đang lấy sự kiện..." : ""}
                  </button>
                </div>
              ) : null}
            </Row>
          </div>
        </Col>
      ) : null}
    </Row>
  );
  function handleSearch1(value: string) {
    setSearchParams({
      text_search_chu_the: value.trim(),
    });
  }
  function handleChangeObject1(newValue: string) {
    if (newValue === "") {
      setValueObject1({ value: "", label: "" });
      return;
    }
    const value = dataKhachThe.data.find((e: any) => e._id === newValue);
    setValueObject1({ value: value?._id, label: value?.name });
  }
  function handleChangeObject2(newValue: string) {
    if (newValue === "") {
      setValueObject2({ value: "", label: "" });
      return;
    }
    const value = dataKhachThe.data.find((e: any) => e._id === newValue);
    setValueObject2({ value: value?._id, label: value?.name });
  }
  function handleChangeFilterTime(value: any) {
    const start_date = value?.[0].format("DD/MM/YYYY");
    const end_date = value?.[1].format("DD/MM/YYYY");
    setFilterEvent({ ...filterEvent, start_date: start_date, end_date: end_date });
  }
};

interface ItemProps {
  item: any;
  object1: string | undefined;
  object2: string | undefined;
}

const Items: React.FC<ItemProps> = ({ item, object1, object2 }) => {
  let data1 = item.data.filter((e: any) => e.chu_the === object1 && e.khach_the === object2);
  let data2 = item.data.filter((e: any) => e.chu_the === object2 && e.khach_the === object1);
  if (object1 === "") {
    data1 = item.data.filter((e: any) => e.khach_the === object2);
    data2 = item.data.filter((e: any) => e.chu_the === object2);
  }
  if (object2 === "") {
    data1 = item.data.filter((e: any) => e.chu_the === object1);
    data2 = item.data.filter((e: any) => e.khach_the === object1);
  }
  const Ref = useRef<any>();
  return (
    <div className={styles.mainItemContainer}>
      {data1.length > 0 || data2.length > 0 ? (
        <>
          <div className={styles.containerItem1}>
            <div className={styles.leftContainer}>
              {data1.length > 0 && (
                <>
                  <div className={styles.content}>
                    {data1.map((element: any, index: number) => {
                      return (
                        <Collapse
                          key={index}
                          expandIcon={({ isActive }) => (
                            <CaretRightOutlined rotate={isActive ? 90 : 0} />
                          )}
                          ghost
                          onChange={(value) => {
                            if (value[0] === "1") {
                              Ref?.current?.scrollIntoView();
                            }
                          }}
                        >
                          <Collapse.Panel header={element.event_name} key="1">
                            <div className={styles.itemContentContainer}>
                              {element.event_content}
                            </div>
                          </Collapse.Panel>
                        </Collapse>
                      );
                    })}
                  </div>
                  <div className={styles.line} />
                </>
              )}
            </div>
            <div className={styles.rightContainer} />
          </div>
          <div className={styles.containerItem2}>
            <div className={styles.timeContainer}>
              <div className={styles.time}>{convertTimeToShowInUI(item.date)}</div>
            </div>
          </div>
          <div className={styles.containerItem1}>
            <div className={styles.leftContainer} />
            <div className={styles.rightContainer}>
              {data2.length > 0 && (
                <>
                  <div className={styles.line} />
                  <div className={styles.content}>
                    {data2.map((element: any, index: number) => {
                      return (
                        <div key={index}>
                          <Collapse
                            expandIcon={({ isActive }) => (
                              <CaretRightOutlined rotate={isActive ? 90 : 0} />
                            )}
                            ghost
                            onChange={(value) => {
                              if (value[0] === "1") {
                                Ref?.current?.scrollIntoView();
                              }
                            }}
                          >
                            <Collapse.Panel header={element.event_name} key="1">
                              <div>{element.event_content}</div>
                            </Collapse.Panel>
                          </Collapse>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
