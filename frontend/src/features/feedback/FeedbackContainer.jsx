import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { TablePagination } from "@mui/material";

import styles from "./FeedbackContainer.module.css";
import WrapperContainer from "../general/WrapperContainer";
import {
  showFeedbackRequest,
  resetFeedbackState,
} from "../../slices/feedbackSlice";
import FeedbackList from "./FeedbackList";
import { getSelectedPage, getMaxAmountOfPages } from "../../helpers/listHelper";

const FeedbackContainer = (props) => {
  const { isLoading, feedback, showFeedbackRequest, resetFeedbackState } =
    props;
  const rowsPerPageOptions = [5, 10, 15];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  useEffect(() => {
    //equals componentDidMount
    showFeedbackRequest();
    console.log("FEEDBACK MOUNT");
    //return statement equals componentWillUnmount
    return () => {
      resetFeedbackState();
      console.log("FEEDBACK UNMOUNT");
    };
  }, [showFeedbackRequest, resetFeedbackState]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = event.target.value;
    const newAmountOfPages = getMaxAmountOfPages(feedback, newRowsPerPage);
    if (page >= newAmountOfPages) {
      setPage(newAmountOfPages - 1);
    }
    setRowsPerPage(parseInt(newRowsPerPage, 10));
  };

  return (
    <WrapperContainer
      pageTitle="Feedback"
      handleRefresh={showFeedbackRequest}
      isRefreshing={isLoading}
      autoRefresh={60}
    >
      <FeedbackList
        listItems={getSelectedPage(feedback, page, rowsPerPage)}
        maxLength={rowsPerPage}
        isLoadingFeedback={isLoading}
      />
      {feedback.length > 0 && (
        <TablePagination
          component="div"
          count={feedback.length}
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
    </WrapperContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    feedback: state.feedback.feedback,
    isLoading:
      state.feedback.isGettingFeedback || state.feedback.isDeletingFeedback,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showFeedbackRequest: () => dispatch(showFeedbackRequest()),
    resetFeedbackState: () => dispatch(resetFeedbackState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackContainer);
