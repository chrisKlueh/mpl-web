import React from "react";
import { CircularProgress } from "@mui/material";

import styles from "./LoadingFragment.module.css";

export default function LoadingFragment(props) {
  const { message } = props;
  return (
    <div className={styles.spinnerContainer}>
      <p>{message}</p>
      <CircularProgress className={styles.spinner} />
    </div>
  );
}
