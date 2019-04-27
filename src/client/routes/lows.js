import React, { Component, createRef } from "react";
import Grid from "@material-ui/core/Grid";
import LowComponent from "../components/lows";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

let styles = {
  container: {
    marginTop: "20px"
  },
  gridItem: {
    padding: "10px",
    minWidth: "375px"
  },
  heading: {
    marginLeft: "10px"
  }
};

let $heading = createRef();

function hasLoaded() {
  if ($heading.current) {
    $heading.current.focus();
  }
}

function Lows({ classes }) {
  return (
    <>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        className={classes.heading}
      >
        <span tabIndex={-1} ref={$heading}>
          Lows
        </span>
      </Typography>
      <Grid container spacing={0} className={classes.container}>
        <Grid item xs className={classes.gridItem}>
          <LowComponent lowType="daily" hasLoaded={hasLoaded} />
        </Grid>
        <Grid item xs className={classes.gridItem}>
          <LowComponent lowType="weekly" />
        </Grid>
      </Grid>
    </>
  );
}

export default withStyles(styles)(Lows);
