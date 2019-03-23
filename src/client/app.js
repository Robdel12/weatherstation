import React, { Component } from "react";
import AvgComponent from "./components/average";
import WeatherAppBar from "./components/app-bar";
import CssBaseline from "@material-ui/core/CssBaseline";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import Home from "./routes/home";
import LiveFeed from "./routes/live";
import Averages from "./routes/averages";

class App extends Component {
  state = {
    drawerIsOpen: false
  };

  toggleNavMenu = () => {
    this.setState({
      drawerIsOpen: !this.state.drawerIsOpen
    });
  };

  render() {
    let { drawerIsOpen } = this.state;

    return (
      <Router>
        <div>
          <CssBaseline />
          <WeatherAppBar
            drawerIsOpen={drawerIsOpen}
            onMenuTap={this.toggleNavMenu}
            closeDrawer={this.toggleNavMenu}
            openDrawer={this.toggleNavMenu}
          />

          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/live" component={LiveFeed} />
              <Route exact path="/averages" component={Averages} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
