import default_thumb from "@/assets/img/default-thumbnail.jpg";
import { Tree } from "@/components";
import { ETreeTag, useNewsSelection, useNewsState } from "@/components/news/news-state";
import { OBJECT_TYPE, useObjectList } from "@/pages/organization/organizations.loader";
import { AppstoreOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Checkbox, List, Menu, MenuProps, Modal, Select, Space, Typography } from "antd";
import Title from "antd/lib/skeleton/Title";
import produce from "immer";
import { useState } from "react";
import shallow from "zustand/shallow";

import {
  useMutationNewsToCategory,
  useNewsIdToNewsletter,
  useNewsSidebar,
} from "../../news.loader";
import { buildTree } from "../../news.utils";
import "./news-category-modal.less";

const NewsCategoryModal = () => {
  const [openNewsCategory, setOpenNewsCategory] = useNewsSelection(
    (state) => [state.openNewsCategory, state.setOpenNewsCategory],
    shallow,
  );

  const [newsSelection, setNewsSelection] = useNewsSelection(
    (state) => [state.newsSelection, state.setNewsSelection],
    shallow,
  );

  const { mutate: mutateNewsToCategory } = useMutationNewsToCategory();

  const handleCancel = () => setOpenNewsCategory(false);

  //build checkbox menu
  const { data: dataObj } = useObjectList(OBJECT_TYPE.DOI_TUONG, { name: "" });
  const { data: dataOrg } = useObjectList(OBJECT_TYPE.TO_CHUC, { name: "" });
  const { data: dataReg } = useObjectList(OBJECT_TYPE.QUOC_GIA, { name: "" });

  const CATEGORY_OBJECT = "Danh Mục Đối Tượng";
  const CATEGORY_ORGANIZATION = "Danh Mục Tổ Chức";
  const CATEGORY_REGION = "Danh Mục Quốc Gia";

  const { Option } = Select;
  const { Title } = Typography;

  const [objSelected, setObjSelected] = useState<any[]>([]);
  const [orgSelected, setOrgSelected] = useState<any[]>([]);
  const [regSelected, setRegSelected] = useState<any[]>([]);

  const handleSubmit = () => {
    const data = {
      news_list: newsSelection.map((news) => news._id),
      category_list: [...objSelected, ...orgSelected, ...regSelected],
    };

    mutateNewsToCategory(
      { data, action: "add" },
      {
        onSuccess: (res) => {
          // console.log(res);
          // setOpenNewsCategory(false);
        },
        onError: () => {},
      },
    );
  };

  const handleChangeSelect = (e: any, type: number) => {
    // type == 1 / obj, type == 2 / org, type == 3 / reg
    if (type == 1 && !objSelected.includes(e[0])) setObjSelected([...objSelected, ...e]);
    if (type == 2 && !orgSelected.includes(e[0])) setOrgSelected([...orgSelected, ...e]);
    if (type == 3 && !regSelected.includes(e[0])) setRegSelected([...regSelected, ...e]);
  };

  return (
    <>
      {dataObj && dataOrg && dataReg && (
        <Modal
          className="news-category-modal-wrap"
          title={"Thêm tin vào danh mục"}
          open={openNewsCategory}
          onOk={handleSubmit}
          onCancel={handleCancel}
          getContainer="#modal-mount"
          okText="Thêm"
          // okButtonProps={{ disabled: !newsSelectId || newsSelectId === ETreeTag.GIO_TIN }}
          // confirmLoading={isLoadingMutate}
          destroyOnClose
        >
          <div>
            <div className="box">
              <Typography.Text>Danh sách tin:</Typography.Text>
              <List
                dataSource={newsSelection}
                renderItem={(item) => {
                  const handleDelete = () => {
                    const deletedNews = produce(newsSelection, (draft) => {
                      const index = draft.findIndex((i) => i._id === item._id);
                      if (index !== -1) draft.splice(index, 1);
                    });
                    setNewsSelection(deletedNews);
                  };

                  return (
                    <List.Item
                      actions={[
                        <Button
                          className="btn__delete"
                          icon={<DeleteOutlined />}
                          title="Xoá tin khỏi danh sách tin"
                          onClick={handleDelete}
                          danger
                          type="text"
                        />,
                      ]}
                    >
                      <Typography.Link target="_blank" href={item?.["data:url"]} rel="noreferrer">
                        {item?.["data:title"]}
                      </Typography.Link>
                    </List.Item>
                  );
                }}
              />
            </div>
            <div className="box">
              <Typography.Text>Chọn danh mục:</Typography.Text>
              <div className="box__category">
                <Title level={5}>{CATEGORY_OBJECT}</Title>
                <Checkbox.Group
                  options={dataObj?.data.map((obj: any) => ({
                    label: obj.name,
                    value: obj._id,
                  }))}
                  onChange={(e) => handleChangeSelect(e, 1)}
                />
              </div>
              <div className="box__category">
                <Title level={5}>{CATEGORY_ORGANIZATION}</Title>
                <Checkbox.Group
                  options={dataOrg?.data.map((obj: any) => ({
                    label: obj.name,
                    value: obj._id,
                  }))}
                  onChange={(e) => handleChangeSelect(e, 2)}
                />
              </div>

              <div className="box__category">
                <Title level={5}>{CATEGORY_REGION}</Title>
                <Checkbox.Group
                  options={dataReg?.data.map((obj: any) => ({
                    label: obj.name,
                    value: obj._id,
                  }))}
                  onChange={(e) => handleChangeSelect(e, 3)}
                />
              </div>

              {/* <div className="box__category">
                <Title level={5}>{CATEGORY_OBJECT}</Title>
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Chọn đối tượng"
                  onChange={(e) => handleChangeSelect(e, 1)}
                  optionLabelProp="label"
                >
                  {dataObj.data.map((obj: any, index: any) => (
                    <Option value={obj._id} label={obj.name} key={index}>
                      <Space>
                        <span role="img" aria-label={obj.name} className="box__image">
                          <img src={obj.avatar_url || default_thumb} alt="" />
                        </span>
                        {obj.name}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="box__category">
                <Title level={5}>{CATEGORY_ORGANIZATION}</Title>
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Chọn tổ chức"
                  onChange={(e) => handleChangeSelect(e, 2)}
                  optionLabelProp="label"
                >
                  {dataOrg.data.map((obj: any, index: any) => (
                    <Option value={obj._id} label={obj.name} key={index}>
                      <Space>
                        <span role="img" className="box__image">
                          <img src={obj.avatar_url || default_thumb} alt="" />
                        </span>
                        {obj.name}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="box__category">
                <Title level={5}>{CATEGORY_REGION}</Title>
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Chọn quốc gia"
                  onChange={(e) => handleChangeSelect(e, 3)}
                  optionLabelProp="label"
                >
                  {dataReg.data.map((obj: any, index: any) => (
                    <Option value={obj._id} label={obj.name} key={index}>
                      <Space>
                        <span role="img" aria-label={obj.name} className="box__image">
                          <img src={obj.avatar_url || default_thumb} alt="" />
                        </span>
                        {obj.name}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </div> */}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default NewsCategoryModal;
