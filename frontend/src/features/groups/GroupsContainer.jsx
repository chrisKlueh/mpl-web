import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { TablePagination } from "@mui/material";

import styles from "./GroupsContainer.module.css";
import WrapperContainer from "../general/WrapperContainer";
import { showDemosRequest, resetDemosState } from "../../slices/demosSlice";
import GroupsList from "./GroupsList";
import GroupCreationDialog from "./GroupCreationDialog";
import { getSelectedPage, getMaxAmountOfPages } from "../../helpers/listHelper";

const GroupsContainer = (props) => {
  const rowsPerPageOptions = [5, 10, 15];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const { isLoading, demos, isAdmin, showDemosRequest, resetDemosState } =
    props;

  /* useEffect(() => {
    //equals componentDidMount
    showDemosRequest();
    //return statement equals componentWillUnmount
    return () => {
      resetDemosState();
    };
  }, [showDemosRequest, resetDemosState]);

  useEffect(() => {
    if (demos.length > 0) {
      const newAmountOfPages = getMaxAmountOfPages(demos, rowsPerPage);
      if (page >= newAmountOfPages) {
        setPage(newAmountOfPages - 1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demos]); */

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = event.target.value;
    const newAmountOfPages = getMaxAmountOfPages(demos, newRowsPerPage);
    if (page >= newAmountOfPages) {
      setPage(newAmountOfPages - 1);
    }
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  return (
    <WrapperContainer
      pageTitle="Available Demos"
      handleRefresh={showDemosRequest}
      isRefreshing={isLoading}
      autoRefresh={60}
    >
      <GroupsList
        listItems={getSelectedPage(demos, page, rowsPerPage)}
        maxLength={rowsPerPage}
        isGettingDemos={isLoading}
        isAdmin={isAdmin}
      />
      <div className={styles.bottomContainer}>
        {demos.length > 0 && (
          <TablePagination
            component="div"
            count={demos.length}
            color="standard"
            rowsPerPageOptions={rowsPerPageOptions}
            labelRowsPerPage={"Rows"}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            className={styles.pagination}
          />
        )}
        {isAdmin && <GroupCreationDialog />}
      </div>
    </WrapperContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    demos: state.demos.demos,
    isLoading:
      state.demos.isGettingDemos ||
      state.demos.isDeletingDemo ||
      state.demo.isUploadingDemo,
    isAdmin: state.login.isAdmin,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showDemosRequest: () => dispatch(showDemosRequest()),
    resetDemosState: () => dispatch(resetDemosState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupsContainer);
