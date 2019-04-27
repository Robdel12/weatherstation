import React, { Component, createRef } from "react";
import Grid from "@material-ui/core/Grid";
import AvgComponent from "../components/average";
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

function Averages(props) {
  let { classes } = props;

  return (
    <>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        className={classes.heading}
      >
        <span tabIndex={-1} ref={$heading}>
          Averages
        </span>
      </Typography>
      <Grid container spacing={0} className={classes.container}>
        <Grid item xs className={classes.gridItem}>
          <AvgComponent avgType="ten-min" hasLoaded={hasLoaded} />
        </Grid>
        <Grid item xs className={classes.gridItem}>
          <AvgComponent avgType="hourly" />
        </Grid>
        <Grid item xs className={classes.gridItem}>
          <AvgComponent avgType="daily" />
        </Grid>
      </Grid>
    </>
  );
}

export default withStyles(styles)(Averages);
