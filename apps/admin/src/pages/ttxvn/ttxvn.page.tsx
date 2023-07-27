import { removeWhitespaceInStartAndEndOfString } from "@/utils/tool-validate-string";
import { Button, DatePicker, Empty, Form, Input, List, Modal, Select, Space } from "antd";
import { debounce, flatMap, unionBy } from "lodash";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "react-query";

import { useSidebar } from "../app/app.store";
import { TTXVNNewsItem } from "./components/ttsvn-news-item";
import {
  TTXVN_CACHE_KEYS,
  useAccountTTXVNConfig,
  useInfiniteTTXVNList,
  useMutationAccountTTXVNConfig,
} from "./ttxvn.loader";
import styles from "./ttxvn.module.less";

interface Props {}

interface FilterEventProps {
  start_date?: string;
  end_date?: string;
  text_search?: string;
  crawling?: string;
}

const formItemLayoutWithOutLabel = {
  labelCol: { span: 4 },
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 0 },
  },
};

export const TTXVNNewsPage: React.FC<Props> = () => {
  const [skip, setSkip] = useState<number>(1);
  const pinned = useSidebar((state) => state.pinned);
  const [filterTTXVN, setFilterTTXVN] = useState<FilterEventProps>({});
  const queryClient = useQueryClient();
  const [isVisibleModalAccountConfig, setIsVisibleModalAccountConfig] = useState<boolean>(false);
  const { ref, inView } = useInView();
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteTTXVNList({
    ...filterTTXVN,
    order: "PublishDate",
    name: "ttxvn",
  });

  const { data: accountConfigData } = useAccountTTXVNConfig();
  const { mutate } = useMutationAccountTTXVNConfig();
  const dataSource = unionBy(flatMap(data?.pages.map((a) => a?.result?.map((e: any) => e))), "_id");

  useEffect(() => {
    if (inView && skip * 50 <= data?.pages[0]?.total_record) {
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

  useEffect(() => {
    if (accountConfigData) {
      setInitialValues(accountConfigData[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountConfigData]);

  const ProcessSearch = debounce((value) => {
    setFilterTTXVN({ ...filterTTXVN, text_search: value.trim() });
  }, 500);

  const [initialValues, setInitialValues] = useState({
    _id: "",
    username: "",
    password: "",
  });
  const [form] = Form.useForm<Record<string, any>>();

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
          <Button type="default" onClick={handleClickChangeAccount}>
            Cấu hình tài khoản
          </Button>
        </Space>
      </div>
      <div className={styles.body}>
        <div className={styles.recordsContainer}>
          {dataSource[0] !== undefined ? (
            <List
              itemLayout="vertical"
              size="small"
              dataSource={dataSource}
              renderItem={(item) => {
                return <TTXVNNewsItem item={item} />;
              }}
            />
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
                {isFetchingNextPage ? "Đang lấy tin..." : ""}
              </button>
            </div>
          ) : null}
        </div>
      </div>
      {isVisibleModalAccountConfig && (
        <Modal
          title={"Cấu hình tài khoản lấy tin Thông tấn xã Việt Nam "}
          open={isVisibleModalAccountConfig}
          destroyOnClose
          onOk={handleFinish}
          onCancel={handleCancel}
          width={800}
          closable={false}
          maskClosable={false}
        >
          <Form
            initialValues={initialValues ?? {}}
            form={form}
            {...formItemLayoutWithOutLabel}
            preserve={false}
          >
            <Form.Item
              validateTrigger={["onChange", "onBlur"]}
              rules={[
                {
                  required: true,
                  message: "Hãy nhập vào tên tài khoản!",
                  whitespace: true,
                },
              ]}
              label="Tên tài khoản"
              name={"username"}
            >
              <Input />
            </Form.Item>
            <Form.Item
              validateTrigger={["onChange", "onBlur"]}
              rules={[
                {
                  required: true,
                  message: "Hãy nhập vào mật khẩu!",
                  whitespace: true,
                },
              ]}
              label="Mật khẩu"
              name={"password"}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      )}
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

  function handleClickChangeAccount() {
    setIsVisibleModalAccountConfig(true);
  }

  function handleFinish() {
    form
      .validateFields()
      .then((values) => {
        const data = removeWhitespaceInStartAndEndOfString(values);
        mutate(
          { id: initialValues._id, data: data },
          {
            onSuccess: () => {
              setIsVisibleModalAccountConfig(false);
            },
          },
        );
      })
      .catch();
  }

  function handleCancel() {
    setIsVisibleModalAccountConfig(false);
  }
};
