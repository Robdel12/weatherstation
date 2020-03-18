import React, { Component, createRef } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import HighComponent from "../components/highs";
import { withStyles } from "@material-ui/core/styles";

let styles = {
  container: {
    marginTop: "20px"
  },
  gridItem: {
    padding: "10px",
    minWidth: "275px"
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

function Highs({ classes }) {
  return (
    <>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        className={classes.heading}
      >
        <span tabIndex={-1} ref={$heading}>
          Highs
        </span>
      </Typography>
      <Grid container spacing={0} className={classes.container}>
        <Grid item xs className={classes.gridItem}>
          <HighComponent highType="daily" hasLoaded={hasLoaded} />
        </Grid>
        <Grid item xs className={classes.gridItem}>
          <HighComponent highType="weekly" />
        </Grid>
      </Grid>
    </>
  );
}

export default withStyles(styles)(Highs);
