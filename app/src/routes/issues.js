import React, { Component, createRef } from 'react';
import { processResponse } from '../utils';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';

import HealingIcon from '@material-ui/icons/Healing';
import FiberNewIcon from '@material-ui/icons/FiberNew';
import BugReportIcon from '@material-ui/icons/BugReport';
import Loading from '../components/loading';

let styles = {
  container: {
    margin: '20px'
  },
  inline: {
    display: 'inline-block'
  },
  gridItem: {
    padding: '10px',
    minWidth: '275px'
  },
  primaryText: {
    fontSize: '1.5rem'
  },
  secondaryText: {
    color: '#383838',
    'word-break': 'break-word'
  }
};

let $heading = createRef();

class Issues extends Component {
  static defaultProps = {
    hasLoaded: function() {}
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
      .then(res => processResponse(res))
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
    let { classes } = this.props;

    return (
      <List data-test-issues-list>
        {issues.map(data => {
          let issue = data.node;
          let firstLabel = issue.labels.edges[0].node;

          return (
            <ListItem
              button
              divider
              role={null}
              component="a"
              key={issue.id}
              disableGutters
              tabIndex={null}
              href={issue.url}
              data-test-issue
            >
              <ListItemText
                primary={
                  <>
                    <Typography
                      variant="h3"
                      className={classes.primaryText}
                      color="textPrimary"
                      data-test-issue-title
                    >
                      <Typography
                        component="span"
                        className={classes.inline}
                        data-test-issue-icon={firstLabel.name}
                      >
                        {this.renderIcon(firstLabel.name)}
                      </Typography>
                      {issue.title} (#
                      {issue.number})
                    </Typography>
                  </>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      className={classes.secondaryText}
                      dangerouslySetInnerHTML={{
                        __html: issue.bodyHTML
                      }}
                      data-test-issue-body
                    />
                  </>
                }
                classes={{
                  primary: classes.primaryText,
                  secondary: classes.secondaryText
                }}
              />
            </ListItem>
          );
        })}
      </List>
    );
  }

  renderIcon(labelText) {
    if (labelText === 'enhancement') {
      return <FiberNewIcon />;
    } else if (labelText === 'bug') {
      return <BugReportIcon />;
    } else if (labelText === 'chore') {
      return <HealingIcon />;
    } else {
      return <BugReportIcon />;
    }
  }

  render() {
    let { classes } = this.props;
    let { isLoading } = this.state;

    return (
      <div className={classes.container}>
        <Typography component="h1" variant="h3" gutterBottom data-test-heading>
          <span tabIndex={-1} ref={$heading}>
            Known issues
          </span>
        </Typography>

        <Typography paragraph gutterBottom>
          These are currently known issues with the weather station. If you notice anything and would like to
          report it, you can{' '}
          <a
            href="https://github.com/robdel12/weatherstation-server/issues/new"
            rel="noopener noreferrer"
            target="_blank"
          >
            open an issue here.
          </a>
        </Typography>

        {isLoading ? <Loading /> : this.renderList()}
      </div>
    );
  }
}

export default withStyles(styles)(Issues);
