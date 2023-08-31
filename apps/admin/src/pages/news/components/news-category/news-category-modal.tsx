import default_thumb from "@/assets/img/default-thumbnail.jpg";
import { Tree } from "@/components";
import { ETreeTag, useNewsSelection, useNewsState } from "@/components/news/news-state";
import { AddCateComponent } from "@/pages/configuration/components/cate-config/add-cate-component";
import { useMutationObjectCate } from "@/pages/configuration/config.loader";
import { OBJECT_TYPE, useObjectList } from "@/pages/organization/organizations.loader";
import { AppstoreOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  List,
  Menu,
  MenuProps,
  Modal,
  Select,
  Space,
  Typography,
  message,
} from "antd";
import Title from "antd/lib/skeleton/Title";
import produce from "immer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import shallow from "zustand/shallow";

import { useCheckMatchKeyword, useMutationCreateNewsObject, useMutationDeleteNewsObject, useNewsIdToNewsletter, useNewsSidebar } from "../../news.loader";
import { buildTree } from "../../news.utils";
import "./news-category-modal.less";

const NewsCategoryModal = () => {
  const navigate = useNavigate();
  const [openNewsCategory, setOpenNewsCategory] = useNewsSelection(
    (state) => [state.openNewsCategory, state.setOpenNewsCategory],
    shallow,
  );

  const [newsSelection, setNewsSelection] = useNewsSelection(
    (state) => [state.newsSelection, state.setNewsSelection],
    shallow,
  );

  const [objectSelection, setObjectSelection] = useNewsSelection(
    (state) => [state.objectSelection, state.setObjectSelection],
    shallow,
  );

  const { mutate: mutateCheckMatchKeyword } = useCheckMatchKeyword();
  const { mutate: mutateCreateNewsObject} = useMutationCreateNewsObject();
  const { mutate: mutateDeleteNewsObject} = useMutationDeleteNewsObject();

  //build checkbox menu
  const { data: dataObject } = useObjectList(OBJECT_TYPE.DOI_TUONG, { name: "" });
  const { data: dataOrganization } = useObjectList(OBJECT_TYPE.TO_CHUC, { name: "" });
  const { data: dataRegion } = useObjectList(OBJECT_TYPE.QUOC_GIA, { name: "" });

  
  const CATEGORY_OBJECT = "Danh Mục Đối Tượng";
  const CATEGORY_ORGANIZATION = "Danh Mục Tổ Chức";
  const CATEGORY_REGION = "Danh Mục Quốc Gia";

  const { Option } = Select;
  const { Title } = Typography;
  const [objectIds, setObjectIds] = useState<any>([]);
  const [organizationIds, setOrganizationIds] = useState<any>([]);
  const [regionIds, setRegionIds] = useState<any>([]);

  const handleCancel = () => setOpenNewsCategory(false);

  const handleChangeSelect = (e: any, type: number) => {
    if(type == 1) setObjectIds(e);
    if(type == 2) setOrganizationIds(e);
    if(type == 3) setRegionIds(e);
  };

  const handleSubmit = () => {
    const selectionIds = newsSelection.map((news) => news._id);
    const data = { news_ids: selectionIds, object_ids: [...objectIds, ...organizationIds, ...regionIds], news_keyword: []};
    mutateCheckMatchKeyword(data, {
      onSuccess: (res) => {
        const check = res.find((news: any) => !news.is_contain);

        if (check) {
          mutateCreateNewsObject(data, {onSuccess: (res) => {
            setOpenNewsCategory(false);
          }, onError: (err) => { console.log(err) }})
        } else {
          message.success("Danh sách tin đã có trong mục đối tượng!");
        }
      },
      onError: (err) => {
        console.log("err", err);
      },
    });
  }

  return (
    <>
      {dataObject && dataOrganization && dataRegion && (
        <>
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
            // footer={null}
            // cancelButtonProps={{ style: { display: 'none' } }}
            // okButtonProps={{ style: { display: "none" } }}
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
                    options={dataObject?.data.map((obj: any) => ({
                      label: obj.name,
                      value: obj._id,
                    }))}
                    onChange={(e) => handleChangeSelect(e, 1)}
                  />
                </div>
                <div className="box__category">
                  <Title level={5}>{CATEGORY_ORGANIZATION}</Title>
                  <Checkbox.Group
                    options={dataOrganization?.data.map((obj: any) => ({
                      label: obj.name,
                      value: obj._id,
                    }))}
                    onChange={(e) => handleChangeSelect(e, 2)}
                  />
                </div>

                <div className="box__category">
                  <Title level={5}>{CATEGORY_REGION}</Title>
                  <Checkbox.Group
                    options={dataRegion?.data.map((obj: any) => ({
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
         
        </>
      )}
    </>
  );
};

export default NewsCategoryModal;
