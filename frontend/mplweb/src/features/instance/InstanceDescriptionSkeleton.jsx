import React from "react";
import { Skeleton, Typography } from "@mui/material";

import parentStyles from "./InstanceDescription.module.css";
import styles from "./InstanceDescriptionSkeleton.module.css";

const InstanceDetailSkeleton = (props) => {
  return (
    <div className={parentStyles.root}>
      <Typography variant="subtitle2">
        <Skeleton
          className={styles.lineSkeleton}
          animation="wave"
          variant="rectangular"
          height={20}
        />
      </Typography>
      <Typography variant="h6" className={parentStyles.shortDesc}>
        <Skeleton
          className={styles.lineSkeleton}
          animation="wave"
          variant="rectangular"
          height={40}
        />
      </Typography>
      <Typography className={parentStyles.detailsHeading} variant="h6">
        Details
      </Typography>
      <div className={parentStyles.detailsContainer}>
        <Skeleton
          className={styles.areaSkeleton}
          animation="wave"
          variant="rectangular"
          height={200}
        />
      </div>
    </div>
  );
};

export default InstanceDetailSkeleton;
