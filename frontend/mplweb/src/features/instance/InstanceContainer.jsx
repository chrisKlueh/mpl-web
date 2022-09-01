import React, { useEffect } from "react";
import { connect } from "react-redux";

import WrapperContainer from "../general/WrapperContainer";
import {
  showInstanceRequest,
  resetInstanceState,
} from "../../slices/instanceSlice";

const InstanceContainer = (props) => {
  const { showInstanceRequest, resetInstanceState } = props;
  useEffect(() => {
    //equals componentDidMount
    showInstanceRequest();
    //return statement equals componentWillUnmount
    return () => {
      resetInstanceState();
    };
  }, [showInstanceRequest, resetInstanceState]);

  const renderInstance = (isLoading, instanceObj) => {
    return isLoading ? (
      <div>isLoading</div>
    ) : (
      <div>
        <p>
          {instanceObj.id} {instanceObj.user} {instanceObj.demo}{" "}
          {instanceObj.host} {instanceObj.port}
        </p>
      </div>
    );
  };

  const renderDemo = (isLoading, demoObj) => {
    return isLoading ? (
      <div>isLoading</div>
    ) : (
      <div>
        <p>
          {demoObj.id} {demoObj.created_at} {demoObj.created_by} {demoObj.title}{" "}
          {demoObj.short_desc} {demoObj.detail_desc}
        </p>
      </div>
    );
  };

  const { isLoading, instance, demo } = props;
  return (
    <WrapperContainer pageTitle={isLoading ? "Instance" : demo.title}>
      {renderInstance(isLoading, instance)}
      {renderDemo(isLoading, demo)}
    </WrapperContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    instance: state.instance.instance,
    demo: state.demo.demo,
    isLoading: state.instance.isGettingInstance || state.demo.isGettingDemo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetInstanceState: () => dispatch(resetInstanceState()),
    showInstanceRequest: (id) => dispatch(showInstanceRequest(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InstanceContainer);
