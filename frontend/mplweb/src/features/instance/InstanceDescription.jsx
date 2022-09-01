import React from "react";
import { Typography } from "@mui/material";

import styles from "./InstanceDescription.module.css";
import { formatIsoDate } from "../../helpers/formatHelper";

const InstanceDescription = (props) => {
  const { created_at, created_by, short_desc, detail_desc } = props.description;
  const { isLoading } = props;

  const renderDetailDesc = (detailDescString) => {
    const lines = detailDescString.split("\n");
    return (
      <div className={styles.detailsContainer}>
        {lines.map((line) => {
          return line === "\r" ? (
            <br />
          ) : (
            <Typography variant="body1">{line}</Typography>
          );
        })}
      </div>
    );
  };

  return isLoading ? (
    <div>Skeleton goes here</div>
  ) : (
    <div className={styles.root}>
      <Typography variant="subtitle2">
        {`created at ${formatIsoDate(created_at)} by ${created_by}`}
      </Typography>
      <Typography variant="h6" className={styles.shortDesc}>
        {short_desc}
      </Typography>
      <Typography className={styles.detailsHeading} variant="h6">
        Details
      </Typography>
      {renderDetailDesc(detail_desc)}
    </div>
  );
};

export default InstanceDescription;
