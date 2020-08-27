import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { createClient, Provider } from 'urql';

import './global-styles.css';

import Home from './routes/home';
import LiveFeed from './routes/live';
import Issues from './routes/issues';

let protocol = `${window.location.protocol}//`;
let hasPort = window.location.port ? `:${window.location.port}` : '';
let hostname = `${window.location.hostname}${hasPort}`;

let client = createClient({
  url: `${protocol}${hostname}/v2/graphql`
});

class App extends Component {
  render() {
    return (
      <Provider value={client}>
        <Router>
          <div className="lg:container lg:mx-auto mx-3">
            <nav data-test-nav>
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
      </Provider>
    );
  }
}

export default App;
