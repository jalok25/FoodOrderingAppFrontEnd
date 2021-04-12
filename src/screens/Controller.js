import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "../screens/home/Home";
import Checkout from "../screens/checkout/Checkout"
import Details from "../screens/details/Details"
import Profile from "../screens/profile/Profile"

/**
 * Class component for controller
 * @class Controller
 * @extends {Component}
 */
class Controller extends Component {
  //will be replaced with actual url
  baseUrl = "http://localhost:8080/api/";

  render() {
    return (
      <Router>
        <div className="main-container">
          <Route
            exact
            path="/"
            render={props => <Home {...props} baseUrl={this.baseUrl} />}
          />
          <Route
            exact
            path="/restaurant/:id"
            render={props => <Details {...props} baseUrl={this.baseUrl} />}
          />                    
          <Route
            exact
            path="/checkout"
            render={props => <Checkout {...props} baseUrl={this.baseUrl} />}
          />
          <Route
            exact
            path="/profile"
            render={props => <Profile {...props} baseUrl={this.baseUrl} />}
          />          
        </div>
      </Router>
    );
  }
}

export default Controller;
