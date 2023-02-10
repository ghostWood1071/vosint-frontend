import { NAVBAR_HEADER } from "@/pages/app/app.constants";
import { Col, Input, Row } from "antd";
import "antd/dist/antd.css";
import classNames from "classnames";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import styles from "./body-search.module.less";

interface BodySearchProps {}

export const BodySearch: React.FC<BodySearchProps> = () => {
  const { t } = useTranslation();
  const [textSearch, setTextSearch] = useState("");
  function clickSearch() {
    if (textSearch.length > 0) {
      alert(textSearch);
    }
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.logo}>
        <img className={styles.logoIcon} src="/logo-header-blue.jpg" alt="logo-auth" />
      </div>
      <div className={styles.searchContainer}>
        <Input
          className={styles.textInput}
          onChange={(e) => {
            setTextSearch(e.target.value);
            console.log("okla");
          }}
          placeholder={"Tìm kiếm"}
        />

        <button className={styles.iconSearchContainer} onClick={clickSearch}>
          <img className={styles.iconSearch} src="/search-icon.png" alt="icon-search" />
        </button>
      </div>
      <div className={styles.barContainer}>
        <Row>
          {[...NAVBAR_HEADER].slice(0, NAVBAR_HEADER.length - 1).map(({ title, to, icon }) => (
            <Col span={6} key={to}>
              <NavLink
                to={to}
                title={title}
                className={({ isActive }) => classNames(styles.link, { [styles.active]: isActive })}
              >
                <div className={styles.itemBarContainer}>
                  <div className={styles.iconContainer}>{icon}</div>
                  <div className={styles.itemText}>{title.toUpperCase()}</div>
                </div>
              </NavLink>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};
