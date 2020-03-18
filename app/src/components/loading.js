import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

let styles = {
  container: {
    margin: '0 auto',
    display: 'block'
  }
};

function Loading({ classes }) {
  return <CircularProgress className={classes.container} data-test-loading-spinner />;
}

export default withStyles(styles)(Loading);
