import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { TablePagination } from "@mui/material";

import styles from "./FeedbackContainer.module.css";
import WrapperContainer from "../general/WrapperContainer";
import { showFeedbackRequest } from "../../slices/feedbackSlice";
import FeedbackList from "./FeedbackList";
import { getSelectedPage } from "../../helpers/listHelper";

const FeedbackContainer = (props) => {
  const { isLoading, feedback, showFeedbackRequest } = props;
  const rowsPerPageOptions = [6, 10, 15];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  useEffect(() => {
    //equals componentDidMount
    showFeedbackRequest();
  }, [showFeedbackRequest]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) =>
    setRowsPerPage(parseInt(event.target.value, 10));

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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackContainer);
