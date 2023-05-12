import { useNewsletterDetail } from "@/pages/news/news.loader";
import { NewsletterDto } from "@/services/news.type";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Form, Modal } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { NewsletterFormGioTin } from "./form/form-ban-tin";
import { NewsletterFormLinhVuc } from "./form/form-linh-vuc";
import { ETreeAction, ETreeTag, useNewsSamplesState, useNewsState } from "./news-state";

const formItemLayoutWithOutLabel = {
  labelCol: { span: 6 },
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 1 },
  },
};

interface Props {
  onFinish: (values: NewsletterDto) => Promise<any>;
  confirmLoading?: boolean;
}

export function NewsletterModal({ onFinish, confirmLoading }: Props): JSX.Element {
  const { t } = useTranslation("translation", { keyPrefix: "news" });
  const { action, tag, data } = useNewsState((state) => state.news);
  const reset = useNewsState((state) => state.reset);
  const newsSelectId = useNewsState((state) => state.newsSelectId);
  const { data: initialData } = useNewsletterDetail(newsSelectId as string, {});
  const location = useLocation();

  const setNews = useNewsState((state) => state.setNews);
  const newsSamples = useNewsSamplesState((state) => state.newsSamples);
  const [form] = Form.useForm<NewsletterDto & { isSample?: boolean }>();

  useEffect(() => {
    if (action === ETreeAction.UPDATE && initialData) {
      form.setFieldsValue({
        ...initialData,
        isSample: !!initialData?.news_samples?.length,
      });
    } else {
      form.resetFields();
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

  return (
    <Modal
      title={t(action!) + t(tag!)}
      open={action !== null && action !== ETreeAction.SELECT && action !== ETreeAction.DELETE}
      confirmLoading={confirmLoading}
      getContainer="#modal-mount"
      maskClosable={false}
      destroyOnClose
      onOk={handleFormFinish}
      onCancel={handleCancel}
      closable={false}
    >
      {action !== ETreeAction.SELECT && action !== ETreeAction.DELETE && (
        <Form form={form} {...formItemLayoutWithOutLabel}>
          {tag === ETreeTag.GIO_TIN && <NewsletterFormGioTin />}
          {tag === ETreeTag.CHU_DE && <NewsletterFormLinhVuc title="Chủ đề" />}
          {tag === ETreeTag.LINH_VUC && <NewsletterFormLinhVuc title="Lĩnh vực" />}
        </Form>
      )}
    </Modal>
  );

  function handleFormFinish() {
    form.validateFields().then((value) => {
      if (value?.isSample) {
        value.news_samples = newsSamples.map((i) => i._id);
        value.required_keyword = [];
        value.exclusion_keyword = "";
        delete value.isSample;
      } else {
        value.news_samples = [];
      }

      if (data?.parent_id) {
        value.parent_id = data.parent_id;
      }

      onFinish({ ...value, tag, action, _id: data?._id });
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
