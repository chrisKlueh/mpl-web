import React, { Component } from "react";
import { connect } from "react-redux";

import WrapperContainer from "../wrapper/WrapperContainer";
import { showDemosRequest } from "../../slices/demosSlice";

class DemosContainer extends Component {
  componentDidMount() {
    this.handleShowDemos();
  }

  handleShowDemos = () => {
    const { showDemosRequest } = this.props;
    showDemosRequest();
  };

  renderDemos = (demos, isLoading) => {
    if (isLoading) {
      return <div>LOADING...</div>;
    } else {
      return demos.map((demo) => {
        return (
          <div>
            <div key="header">
              {demo.id} {demo.created_at} {demo.created_by} {demo.file_path}
            </div>
            <div key="title">{demo.title}</div>
            <div key="short_desc">{demo.short_desc}</div>
            <div key="detail_desc">{demo.detail_desc}</div>
            <br />
          </div>
        );
      });
    }
  };

  render() {
    const { isLoading, demos } = this.props;
    return (
      <WrapperContainer pageTitle="DemosContainer">
        {this.renderDemos(demos, isLoading)}
      </WrapperContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    demos: state.demos.demos,
    isLoading: state.demos.isGettingDemos,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showDemosRequest: () => dispatch(showDemosRequest()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DemosContainer);
