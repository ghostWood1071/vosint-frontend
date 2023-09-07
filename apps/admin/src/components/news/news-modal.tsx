import { NewsletterDTO } from "@/models/newsletter.type";
import { useNewsletterDetail } from "@/pages/news/news.loader";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Form, Modal } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { NewsletterFormGioTin } from "./form/form-ban-tin";
import { NewsletterFormChuDe } from "./form/form-chu-de";
import "./news-modal.less";
import { ETreeAction, ETreeTag, useNewsSamplesTopicState, useNewsState } from "./news-state";

interface Props {
  onFinish: (values: NewsletterDTO) => Promise<any>;
  confirmLoading?: boolean;
}

type IKeyword = Record<
  string,
  {
    required_keyword: string[];
    exclusion_keyword: string;
  }
>;

const defaultKeyword: IKeyword = {
  keyword_vi: {
    required_keyword: [],
    exclusion_keyword: "",
  },
  keyword_en: {
    required_keyword: [],
    exclusion_keyword: "",
  },
  keyword_cn: {
    required_keyword: [],
    exclusion_keyword: "",
  },
  keyword_ru: {
    required_keyword: [],
    exclusion_keyword: "",
  },
};

export function NewsletterModal({ onFinish, confirmLoading }: Props): JSX.Element {
  const { t } = useTranslation("translation", { keyPrefix: "news" });
  const { action, tag, data } = useNewsState((state) => state.news);
  const reset = useNewsState((state) => state.reset);
  const newsSelectId = useNewsState((state) => state.newsSelectId);
  const { data: initialData } = useNewsletterDetail(newsSelectId as string, {});
  const location = useLocation();
  const setNews = useNewsState((state) => state.setNews);
  const newsSamples = useNewsSamplesTopicState((state) => state.newsSamples);
  const setNewsSamples = useNewsSamplesTopicState((state) => state.setNewsSamples);
  const [form] = Form.useForm<NewsletterDTO & { is_sample?: boolean }>();
  const [keyword, setKeyword] = useState<IKeyword>(defaultKeyword);

  useEffect(() => {
    if (action === ETreeAction.UPDATE && initialData) {
      form.setFieldsValue({
        ...initialData,
      });
      setKeyword({
        keyword_vi: initialData.keyword_vi ?? [],
        keyword_en: initialData.keyword_en ?? [],
        keyword_cn: initialData.keyword_cn ?? [],
        keyword_ru: initialData.keyword_ru ?? [],
      });
      setNewsSamples(initialData.news_samples);
    } else {
      form.resetFields();
      setKeyword(defaultKeyword);
      setNewsSamples([]);
    }
  }, [initialData, action]);

  useEffect(() => {
    reset();
  }, [location.pathname]);

  useEffect(() => {
    if (action === ETreeAction.DELETE) {
      Modal.confirm({
        title: `Bạn có chắc muốn xoá "${data?.title}" không?`,
        icon: <ExclamationCircleOutlined />,
        okText: "Xoá",
        cancelText: "Huỷ",
        onOk: handleFormFinish,
        onCancel: handleCancel,
      });
    }
  }, [action]);

  console.log(t(tag!));
  
  return (
    <Modal
      title={t(action!) + t(tag!)}
      open={action !== null && action !== ETreeAction.SELECT && action !== ETreeAction.DELETE}
      confirmLoading={confirmLoading}
      maskClosable={false}
      destroyOnClose
      onOk={handleFormFinish}
      onCancel={handleCancel}
      closable={false}
      width={800}
      okText={action === "create" ? "Thêm" : "Cập nhật"}
      cancelText="Thoát"
    >
      {action !== ETreeAction.SELECT && action !== ETreeAction.DELETE && (
        <Form form={form}>
          {tag === ETreeTag.GIO_TIN && <NewsletterFormGioTin />}
          {tag === ETreeTag.CHU_DE && (
            <NewsletterFormChuDe title="Chủ đề" keyword={keyword} setKeyword={setKeyword} />
          )}
          {tag === ETreeTag.LINH_VUC && (
            <NewsletterFormChuDe title="Lĩnh vực" keyword={keyword} setKeyword={setKeyword} />
          )}
        </Form>
      )}
    </Modal>
  );

  function handleFormFinish() {
    form.validateFields().then((value) => {
      if (data?.parent_id) {
        value.parent_id = data.parent_id;
      }

      if (value?.is_sample) {
        value.news_samples = newsSamples;
        onFinish({ ...value, ...defaultKeyword, tag, action, _id: data?._id });
      } else {
        value.news_samples = [];
        onFinish({ ...value, ...keyword, tag, action, _id: data?._id });
      }
    });
  }

  function handleCancel() {
    setNews({
      data: null,
      tag: null,
      action: null,
    });
  }
}
