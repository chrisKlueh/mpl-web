import React, { Fragment } from "react";
import { ListItem, Divider } from "@mui/material";
import { Skeleton } from "@mui/material";

import styles from "./ListRowSkeleton.module.css";

const createSkeleton = (rows, styling) => {
  let res = [];
  for (let i = 0; i < rows; i++) {
    res.push(
      <Fragment key={i}>
        <ListItem button className={styles.item} id={i}>
          <Skeleton
            className={styles.skeletonIcon}
            animation="wave"
            variant="circular"
            width={40}
            height={40}
          />
          <Skeleton
            className={styles.skeletonRow}
            animation="wave"
            variant="rectangular"
            width={"95%"}
            height={40}
          />
        </ListItem>
        <Divider />
      </Fragment>
    );
  }
  return <Fragment>{res}</Fragment>;
};

const ListRowSkeleton = (props) => {
  const { rows } = props;

  return <Fragment>{createSkeleton(rows)}</Fragment>;
};

export default ListRowSkeleton;
