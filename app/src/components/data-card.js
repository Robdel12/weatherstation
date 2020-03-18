import React, { Component, createContext } from 'react';
import { processResponse } from '../utils';

import Loading from './loading';

let DataContext = createContext({});

export let DataProvider = DataContext.Provider;
export let DataConsumer = DataContext.Consumer;

class DataCard extends Component {
  static defaultProps = {
    hasLoaded: function() {}
  };

  state = {
    data: {},
    error: null,
    isLoading: true,
    apiEndpoint: null
  };

  componentDidMount() {
    this._isMounted = true;
    fetch(`/v1/${this.props.apiEndpoint}`)
      .then(res => processResponse(res))
      .then(data => {
        if (!this._isMounted) return;
        this.props.hasLoaded();
        this.setState({
          data,
          isLoading: false
        });
      })
      .catch(error => {
        if (!this._isMounted) return;
        this.props.hasLoaded();
        this.setState({
          isLoading: false,
          error
        });
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let { data, isLoading, error } = this.state;

    return (
      <div data-test-data-card>
        {isLoading ? (
          <span data-test-data-card-loading>
            <Loading />
          </span>
        ) : error ? (
          <span data-test-data-card-error>
            Robert needs to fix this: {error.text} ({error.status})
          </span>
        ) : (
          <DataProvider value={{ ...data }}>{this.props.children}</DataProvider>
        )}
      </div>
    );
  }
}

export default DataCard;
