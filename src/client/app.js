import React, { Component } from "react";
import AvgComponent from "./components/average";
import WeatherAppBar from "./components/app-bar";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import "./global-styles.css";

import Home from "./routes/home";
import LiveFeed from "./routes/live";
import Averages from "./routes/averages";
import Highs from "./routes/highs";
import Lows from "./routes/lows";
import Issues from "./routes/issues";

let styles = theme => ({
  container: {
    [theme.breakpoints.down("sm")]: {
      margin: "8px"
    },
    margin: "20px"
  }
});

class App extends Component {
  state = {
    drawerIsOpen: false
  };

  toggleNavMenu = () => {
    this.setState({
      drawerIsOpen: !this.state.drawerIsOpen
    });
  };

  refresh() {
    window.location.reload();
  }

  render() {
    let { drawerIsOpen } = this.state;
    let { classes } = this.props;

    return (
      <Router>
        <div>
          <CssBaseline />
          <WeatherAppBar
            drawerIsOpen={drawerIsOpen}
            onMenuTap={this.toggleNavMenu}
            closeDrawer={this.toggleNavMenu}
            openDrawer={this.toggleNavMenu}
            onRefresh={this.refresh}
          />

          <div className={classes.container}>
            <Switch>
              <Route key="1" exact path="/" component={Home} />
              <Route key="2" exact path="/live" component={LiveFeed} />
              <Route key="3" exact path="/averages" component={Averages} />
              <Route key="4" exact path="/highs" component={Highs} />
              <Route key="5" exact path="/lows" component={Lows} />
              <Route key="6" exact path="/issues" component={Issues} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default withStyles(styles)(App);
