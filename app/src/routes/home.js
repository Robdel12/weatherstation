import React, { createRef } from 'react';
import AvgComponent from '../components/average';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

let styles = {
  heading: {
    marginLeft: '10px'
  }
};

let $heading = createRef();

function hasLoaded() {
  $heading.current.focus();
}

function Home({ classes }) {
  return (
    <>
      <Typography component="h1" variant="h3" gutterBottom>
        <span ref={$heading} tabIndex={-1} className={classes.header}>
          Current weather
        </span>
      </Typography>
      <AvgComponent avgType="ten-min" noHeader hasLoaded={hasLoaded} />
    </>
  );
}

export default withStyles(styles)(Home);
