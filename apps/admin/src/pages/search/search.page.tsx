import { LOCAL_ROLE } from "@/constants/config";
import { authLoginPath } from "@/pages/router";
import React from "react";
import { Navigate } from "react-router-dom";
import { useLocalStorage } from "react-use";

import { BodySearch } from "./components/body-search";
import { SearchHeader } from "./components/search-header";
import styles from "./search.module.less";

interface SearchProps {}

export const Search: React.FC<SearchProps> = () => {
  const [role] = useLocalStorage(LOCAL_ROLE);

  if (!role) return <Navigate to={authLoginPath} />;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <SearchHeader />
      </div>
      <div className={styles.body}>
        <BodySearch />
      </div>
    </div>
  );
};
