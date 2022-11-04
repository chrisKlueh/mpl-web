import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { TablePagination } from "@mui/material";

import styles from "./GroupsContainer.module.css";
import WrapperContainer from "../general/WrapperContainer";
import { showGroupsRequest, resetGroupsState } from "../../slices/groupsSlice";
import GroupsList from "./GroupsList";
import GroupCreationDialog from "./GroupCreationDialog";
import { getSelectedPage, getMaxAmountOfPages } from "../../helpers/listHelper";

const GroupsContainer = (props) => {
  const rowsPerPageOptions = [5, 10, 15];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const { isLoading, groups, isAdmin, showGroupsRequest, resetGroupsState } =
    props;

  useEffect(() => {
    //equals componentDidMount
    showGroupsRequest();
    //return statement equals componentWillUnmount
    return () => {
      resetGroupsState();
    };
  }, [showGroupsRequest, resetGroupsState]);

  useEffect(() => {
    if (groups.length > 0) {
      const newAmountOfPages = getMaxAmountOfPages(groups, rowsPerPage);
      if (page >= newAmountOfPages) {
        setPage(newAmountOfPages - 1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = event.target.value;
    const newAmountOfPages = getMaxAmountOfPages(groups, newRowsPerPage);
    if (page >= newAmountOfPages) {
      setPage(newAmountOfPages - 1);
    }
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  return (
    <WrapperContainer
      pageTitle="Available Groups"
      handleRefresh={showGroupsRequest}
      isRefreshing={isLoading}
      autoRefresh={60}
    >
      <GroupsList
        listItems={getSelectedPage(groups, page, rowsPerPage)}
        maxLength={rowsPerPage}
        isLoadingGroups={isLoading}
        isAdmin={isAdmin}
      />
      <div className={styles.bottomContainer}>
        {groups.length > 0 && (
          <TablePagination
            component="div"
            count={groups.length}
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
    groups: state.groups.groups,
    isLoading:
      state.groups.isGettingGroups ||
      state.groups.isCreatingGroup ||
      state.groups.isDeletingGroup,
    isAdmin: state.login.isAdmin,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showGroupsRequest: () => dispatch(showGroupsRequest()),
    resetGroupsState: () => dispatch(resetGroupsState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupsContainer);
