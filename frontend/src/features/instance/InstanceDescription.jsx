import React, { Fragment } from "react";
import { Typography } from "@mui/material";

import styles from "./InstanceDescription.module.css";
import InstanceDescriptionSkeleton from "./InstanceDescriptionSkeleton";
import { formatIsoDate } from "../../helpers/formatHelper";

const InstanceDescription = (props) => {
  const { created_at, creator, short_desc, detail_desc } = props.description;
  const { isLoading } = props;

  const renderDetailDesc = (detailDescString) => {
    const lines = detailDescString.split("\n");
    let key = 0;
    return (
      <div className={styles.detailsContainer}>
        {lines.map((line) => {
          key++;
          return line === "\r" ? (
            <br key={key} />
          ) : (
            <Typography key={key} variant="body1">
              {line}
            </Typography>
          );
        })}
      </div>
    );
  };

  return isLoading ? (
    <InstanceDescriptionSkeleton />
  ) : (
    <div className={styles.root}>
      {detail_desc !== undefined && (
        <Fragment>
          <Typography variant="subtitle2">
            {`created at ${formatIsoDate(created_at)} by ${creator}`}
          </Typography>
          <Typography variant="h6" className={styles.shortDesc}>
            {short_desc}
          </Typography>
          <Typography className={styles.detailsHeading} variant="h6">
            Details
          </Typography>
          {renderDetailDesc(detail_desc)}
        </Fragment>
      )}
    </div>
  );
};

export default InstanceDescription;
