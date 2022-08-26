import React, { Component } from "react";
import { connect } from "react-redux";

import { showDemosRequest } from "../../slices/demosSlice";

class DemosContainer extends Component {
  componentDidMount() {
    console.log("did mount");
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
            <div>
              {demo.id} {demo.created_at} {demo.created_by} {demo.file_path}
            </div>
            <div>{demo.title}</div>
            <div>{demo.short_desc}</div>
            <div>{demo.detail_desc}</div>
            <br />
          </div>
        );
      });
    }
  };

  render() {
    const { isLoading, demos } = this.props;
    return (
      <div>
        <h1>DemosContainer</h1>
        {this.renderDemos(demos, isLoading)}
      </div>
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
