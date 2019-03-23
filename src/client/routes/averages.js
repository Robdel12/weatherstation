import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import AvgComponent from "../components/average";
import { withStyles } from "@material-ui/core/styles";

let styles = {
  container: {
    marginTop: "20px"
  },
  gridItem: {
    padding: "10px",
    minWidth: "375px"
  }
};

function Averages(props) {
  let { classes } = props;

  return (
    <Grid container spacing={0} className={classes.container}>
      <Grid item xs className={classes.gridItem}>
        <AvgComponent avgType="ten-min" />
      </Grid>
      <Grid item xs className={classes.gridItem}>
        <AvgComponent avgType="hourly" />
      </Grid>
      <Grid item xs className={classes.gridItem}>
        <AvgComponent avgType="daily" />
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(Averages);
