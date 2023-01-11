import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import styles from "./dashboard-layout.module.less";
import { useLocalStorage } from "react-use";

import { AppHeader } from "@/pages/app/components/app-header";
import { LOCAL_ROLE } from "@/constants/config";
import { authLoginPath } from "@/pages/router";

export const DashboardLayout = () => {
  const [role] = useLocalStorage(LOCAL_ROLE);

  if (!role) return <Navigate to={authLoginPath} />;

  return (
    <div className={styles.body}>
      <AppHeader />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};
