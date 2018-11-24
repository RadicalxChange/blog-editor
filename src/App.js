import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Main from "./components/Main";
import Register from "./components/Register";

export default function App() {
  return (
    <Router>
      <React.Fragment>
        <Route path="/" exact component={Main} />
        <Route path="/register/" component={Register} />
      </React.Fragment>
    </Router>
  );
}
