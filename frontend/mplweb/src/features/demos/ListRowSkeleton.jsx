import React, { Fragment } from "react";
import { ListItem, Divider } from "@mui/material";
import { Skeleton } from "@mui/material";

const createSkeleton = (rows, styling) => {
  let res = [];
  for (let i = 0; i < rows; i++) {
    res.push(
      <Fragment>
        <ListItem button className={styling} id={i}>
          <Skeleton animation="wave" variant="circle" width={40} height={40} />
          <Skeleton animation="wave" variant="rect" width={"95%"} height={40} />
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
