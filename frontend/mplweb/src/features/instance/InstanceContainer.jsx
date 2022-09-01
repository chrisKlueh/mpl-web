import React, { Component } from "react";
import { connect } from "react-redux";

import WrapperContainer from "../general/WrapperContainer";
// import { showDemoDetailsRequest } from "../../slices/demoDetailsSlice";
import { resetInstanceState } from "../../slices/instanceSlice";

class InstanceContainer extends Component {
  componentDidMount() {
    // this.handleShowDemoDetails();
  }

  componentWillUnmount() {
    const { resetInstanceState } = this.props;
    resetInstanceState();
  }

  handleShowDemoDetails = () => {
    // const { showDemoDetailsRequest } = this.props;
    // showDemoDetailsRequest();
  };

  render() {
    // const { isLoading, details } = this.props;
    return <WrapperContainer pageTitle="InstanceContainer"></WrapperContainer>;
  }
}

const mapStateToProps = (state) => {
  return {
    // details: state.demodetails.details,
    // isLoading: state.demodetails.isGettingDemoDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetInstanceState: () => dispatch(resetInstanceState()),
    // showDemoDetailsRequest: () => dispatch(showDemoDetailsRequest()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InstanceContainer);
