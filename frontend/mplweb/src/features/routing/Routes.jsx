import React, { Component } from "react";
import { Routes, Route } from "react-router-dom";
import LogInContainer from "../login/LoginContainer";
import DemosContainer from "../demos/DemosContainer";
import InstanceContainer from "../instance/InstanceContainer";
import FeedbackContainer from "../feedback/FeedbackContainer";

export default class Routing extends Component {
  render() {
    return (
      <Routes>
        <Route path="/login" element={<LogInContainer isSignedUp={true} />} />
        {/* <Route path="/signup" element={<LogInContainer isSignedUp={false} />} /> */}
        <Route path="/demos" element={<DemosContainer />} />
        <Route path="/instance/:id" element={<InstanceContainer />} />
        <Route path="/feedback" element={<FeedbackContainer />} />
      </Routes>
    );
  }
}
