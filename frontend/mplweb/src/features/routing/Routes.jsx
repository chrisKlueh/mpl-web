import React, { Component } from "react";
import { Routes, Route } from "react-router-dom";
import LogInContainer from "../login/LoginContainer";

export default class Routing extends Component {
  render() {
    return (
      <Routes>
        <Route path="/login" element={<LogInContainer isSignedUp={true} />} />
        <Route path="/signup" element={<LogInContainer isSignedUp={false} />} />
      </Routes>
    );
  }
}
