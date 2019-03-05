import React, { Component } from "react";
import AvgComponent from "./components/average";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import Home from "./routes/home";
import LiveFeed from "./routes/live";
import Averages from "./routes/averages";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <nav
            className="navbar is-dark"
            role="navigation"
            aria-label="dropdown navigation"
            style={{ marginBottom: "20px" }}
          >
            <div className="navbar-start">
              <Link to="/" className="navbar-item">
                weather.deluca.house
              </Link>

              <Link to="live" className="navbar-item">
                Live weather
              </Link>

              <Link to="averages" className="navbar-item">
                Averages
              </Link>
            </div>
          </nav>

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
