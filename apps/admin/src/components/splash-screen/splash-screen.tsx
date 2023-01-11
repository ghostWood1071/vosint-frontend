import React from "react";
import { ReactComponent as Logo } from "@/assets/svg/logo-animated.svg";
import classnames from "classnames";
import styles from "./splash-screen.module.less";

export const SplashScreen: React.FC = () => {
  return (
    <div className={styles.root} aria-label="Loading Data studio">
      <div className={styles.logo}>
        <Logo />
        <div className={classnames(styles.laBallBeat, styles.laDark)}>
          <div />
          <div />
          <div />
        </div>
      </div>
    </div>
  );
};
