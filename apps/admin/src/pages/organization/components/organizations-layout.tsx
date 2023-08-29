import { EarthIcon, FlagIcon, GroupIcon, UserTieIcon } from "@/assets/svg";
import { AppContainer } from "@/pages/app";
import { NewsFilter } from "@/pages/news/components/news-filter";
import { NewsFilterProvider } from "@/pages/news/news.context";
import { getOrganizationsDetailUrl, organizationGraphPath } from "@/pages/router";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Input, Menu, MenuProps, Pagination, Space, Typography } from "antd";
import produce from "immer";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { OBJECT_TYPE, useObjectList } from "../organizations.loader";
import { useOrganizationsStore } from "../organizations.store";
import styles from "./organizations-layout.module.less";

export const OrganizationsLayout: React.FC = () => {
  return (
    <NewsFilterProvider>
      <AppContainer sidebar={<Sidebar />}>
        {/* <NewsFilter /> */}
        <Outlet />
      </AppContainer>
    </NewsFilterProvider>
  );
};

function buildMenuItem(
  { data, total }: { data: any[]; total: number },
  objectType: OBJECT_TYPE,
  { onSearch }: { onSearch: (objectType: OBJECT_TYPE) => (value: string) => void },
  { onChange }: { onChange: (objectType: OBJECT_TYPE) => (page: number) => void },
): MenuProps["items"] {
  return [
    {
      label: (
        <Input.Search
          placeholder="Tìm kiếm"
          onSearch={onSearch(objectType)}
          className={styles.input}
        />
      ),
      key: objectType + "search",
      className: styles.search,
      disabled: true,
    },
    ...data?.map((i) => ({
      label: (
        <Space>
          <Avatar
            src={i?.avatar_url ? i.avatar_url : <UserOutlined />}
            style={{ backgroundColor: "#cccccc" }}
          >
            {i?.name}
          </Avatar>
          <Typography.Text style={{ textTransform: "uppercase" }}>{i?.name}</Typography.Text>
        </Space>
      ),
      key: getOrganizationsDetailUrl(i._id),
    })),
    {
      label: (
        <Pagination
          defaultCurrent={1}
          showSizeChanger={false}
          pageSize={5}
          total={total}
          onChange={onChange(objectType)}
          size="small"
        />
      ),
      key: objectType + "paginate",
      className: styles.pagination,
      disabled: true,
    },
  ];
}

const defaultValue = {
  [OBJECT_TYPE.DOI_TUONG]: {
    name: "",
    skip: 1,
    limit: 5,
  },
  [OBJECT_TYPE.TO_CHUC]: {
    name: "",
    skip: 1,
    limit: 5,
  },
  [OBJECT_TYPE.QUOC_GIA]: {
    name: "",
    skip: 1,
    limit: 5,
  },
};

function Sidebar(): JSX.Element {
  const navigate = useNavigate();
  const [sidebarFilter, setSidebarFilter] = useState(defaultValue);
  const { pathname } = useLocation();
  const setKeySearch = useOrganizationsStore((state) => state.setKeySearch);

  const { data: dataDoiTuong } = useObjectList(
    OBJECT_TYPE.DOI_TUONG,
    sidebarFilter[OBJECT_TYPE.DOI_TUONG],
  );

  const { data: dataToChuc } = useObjectList(
    OBJECT_TYPE.TO_CHUC,
    sidebarFilter[OBJECT_TYPE.TO_CHUC],
  );

  const { data: dataQuocGia } = useObjectList(
    OBJECT_TYPE.QUOC_GIA,
    sidebarFilter[OBJECT_TYPE.QUOC_GIA],
  );

  const items: MenuProps["items"] = [
    {
      label: "DANH MỤC ĐỐI TƯỢNG",
      key: OBJECT_TYPE.DOI_TUONG,
      icon: <UserTieIcon />,
      children: buildMenuItem(
        dataDoiTuong ?? { data: [], total: 0 },
        OBJECT_TYPE.DOI_TUONG,
        { onSearch: handleChangeName },
        { onChange: handleChangePaginate },
      ),
    },
    {
      label: "DANH MỤC TỔ CHỨC",
      key: OBJECT_TYPE.TO_CHUC,
      icon: <GroupIcon />,
      children: buildMenuItem(
        dataToChuc ?? { data: [], total: 0 },
        OBJECT_TYPE.TO_CHUC,
        { onSearch: handleChangeName },
        { onChange: handleChangePaginate },
      ),
    },
    {
      label: "DANH MỤC QUỐC GIA",
      key: OBJECT_TYPE.QUOC_GIA,
      icon: <FlagIcon />,
      children: buildMenuItem(
        dataQuocGia ?? { data: [], total: 0 },
        OBJECT_TYPE.QUOC_GIA,
        { onSearch: handleChangeName },
        { onChange: handleChangePaginate },
      ),
    },
    {
      label: "ĐỒ THỊ QUAN HỆ QUỐC TẾ",
      key: organizationGraphPath,
      icon: <EarthIcon />,
    },
  ];

  return (
    <Menu
      mode="inline"
      items={items}
      onSelect={handleClickMenu}
      selectedKeys={[pathname]}
      className={styles.menuStyle}
    />
  );

  function handleClickMenu({ key, keyPath }: { key: string; keyPath: string[] }) {
    if (key.includes("search") || key.includes("paginate")) {
      return;
    }

    if (key === organizationGraphPath) {
      navigate(organizationGraphPath);
    } else {
      navigate(key);
    }
    const listString = keyPath[0].split("/");
    if (listString[listString.length - 1] !== "international-relationship-graph") {
      let dataObject = (
        keyPath[1] === OBJECT_TYPE.DOI_TUONG
          ? dataDoiTuong.data
          : keyPath[1] === OBJECT_TYPE.TO_CHUC
          ? dataToChuc.data
          : dataQuocGia.data
      ).find((e: any) => e._id === listString[listString.length - 1]);

      let keywordsString = "";
      Object.keys(dataObject.keywords).forEach((e) => {
        if (dataObject.keywords[e] !== "") {
          let keyStringItem = "";
          const listKey = dataObject.keywords[e].split(",");
          for (let i = 0; i < listKey.length; i++) {
            if (i === 0) {
              keyStringItem = keyStringItem + `"${listKey[i]}"`;
            } else {
              keyStringItem = keyStringItem + `|"${listKey[i]}"`;
            }
          }
          if (keyStringItem !== "") {
            if (keywordsString.length === 0) {
              keywordsString = keyStringItem;
            } else {
              keywordsString = keywordsString + `|` + keyStringItem;
            }
          }
        }
      });
      setKeySearch(keywordsString);
    }
  }

  function handleChangePaginate(key: OBJECT_TYPE) {
    return function (page: number) {
      setSidebarFilter(
        produce((draft) => {
          draft[key].skip = page;
        }),
      );
    };
  }

  function handleChangeName(key: OBJECT_TYPE) {
    return function (value: string) {
      setSidebarFilter(
        produce((draft) => {
          draft[key].name = value;
        }),
      );
    };
  }
}
