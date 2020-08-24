import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import './global-styles.css';

import Home from './routes/home';
import LiveFeed from './routes/live';
import Issues from './routes/issues';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="lg:container lg:mx-auto mx-3">
          <nav>
            <ul className="flex space-x-6 my-5">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/live">Live</Link>
              </li>
              <li>
                <Link to="/issues">Issues</Link>
              </li>
            </ul>
            <Switch>
              <Route key="1" exact path="/" component={Home} />
              <Route key="2" exact path="/live" component={LiveFeed} />
              <Route key="3" exact path="/issues" component={Issues} />
            </Switch>
          </nav>
        </div>
      </Router>
    );
  }
}

export default App;
