import React, { Component } from "react";
import { Routes, Route } from "react-router-dom";
import LoginContainer from "../login/LoginContainer";
import DemosContainer from "../demos/DemosContainer";
import InstanceContainer from "../instance/InstanceContainer";
import FeedbackContainer from "../feedback/FeedbackContainer";
import GroupsContainer from "../groups/GroupsContainer";

export default class Routing extends Component {
  render() {
    return (
      <Routes>
        <Route path="/login" element={<LoginContainer isSignedUp={true} />} />
        {/* <Route path="/signup" element={<LogInContainer isSignedUp={false} />} /> */}
        <Route path="/demos" element={<DemosContainer />} />
        <Route path="/instance/:id" element={<InstanceContainer />} />
        <Route path="/feedback" element={<FeedbackContainer />} />
        <Route path="/groups" element={<GroupsContainer />} />
        <Route path="*" element={<LoginContainer isSignedUp={true} />} />
      </Routes>
    );
  }
}
