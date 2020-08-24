import React, { Component, createRef } from 'react';
import { processResponse } from '../utils';

import Loading from '../components/loading';

let $heading = createRef();

class Issues extends Component {
  static defaultProps = {
    hasLoaded: function () {}
  };

  state = {
    issues: [],
    isLoading: true
  };

  hasLoaded() {
    if ($heading.current) {
      $heading.current.focus();
    }
  }

  componentDidMount() {
    this._isMounted = true;

    fetch('/v1/issues')
      .then((res) => processResponse(res))
      .then(({ issues }) => {
        if (!this._isMounted) return;
        this.hasLoaded();
        this.setState({
          issues,
          isLoading: false
        });
      })
      .catch(() => {
        this.hasLoaded();
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  renderList() {
    let { issues } = this.state;

    return (
      <div data-test-issues-list>
        {issues.map((data) => {
          let issue = data.node;
          let firstLabel = issue.labels.edges[0].node;

          return (
            <a key={issue.id} href={issue.url} data-test-issue>
              <h3 data-test-issue-title>
                <span data-test-issue-icon={firstLabel.name}>{firstLabel.name}</span>
                {issue.title} (#{issue.number})
              </h3>
              <span
                dangerouslySetInnerHTML={{
                  __html: issue.bodyHTML
                }}
                data-test-issue-body
              ></span>
            </a>
          );
        })}
      </div>
    );
  }

  render() {
    let { isLoading } = this.state;

    return (
      <div>
        <h1 data-test-heading ref={$heading} className="text-5xl font-semibold mb-6">
          Known issues
        </h1>

        <p className="mb-6">
          These are currently known issues with the weather station. If you notice anything and would like to
          report it, you can{' '}
          <a
            href="https://github.com/robdel12/weatherstation-server/issues/new"
            rel="noopener noreferrer"
            target="_blank"
          >
            open an issue here.
          </a>
        </p>

        {isLoading ? <Loading /> : this.renderList()}
      </div>
    );
  }
}

export default Issues;
