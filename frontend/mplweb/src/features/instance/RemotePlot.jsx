import React, { Fragment } from "react";

import styles from "./RemotePlot.module.css";
import LoadingFragment from "../general/LoadingFragment";

export default function RemotePlot() {
  let isLoading = true;
  return (
    <Fragment>
      {isLoading ? (
        <div className={styles.loadingFragment}>
          <LoadingFragment message="Establishing connection.." />
        </div>
      ) : (
        <video className={styles.plotVideo} />
      )}
    </Fragment>
  );
}
