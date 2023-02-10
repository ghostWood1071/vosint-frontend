import React from "react";
import { Outlet } from "react-router-dom";

import styles from "./auth-layout.module.less";

export const AuthLayout = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.contentContainer}>
        <div className={styles.boxContent}>
          <div className={styles.logoContainer}>
            <img className={styles.logoIcon} src="/logo-header-blue.jpg" alt="logo-auth" />
          </div>
          <div className={styles.textinputContainer}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
