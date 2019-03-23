import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import LowComponent from "../components/lows";
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

function Lows(props) {
  let { classes } = props;

  return (
    <Grid container spacing={0} className={classes.container}>
      <Grid item xs className={classes.gridItem}>
        <LowComponent lowType="daily" />
      </Grid>
      <Grid item xs className={classes.gridItem}>
        <LowComponent lowType="weekly" />
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(Lows);

// <Grid item xs className={classes.gridItem}>
//   <HighComponent avgType="daily" />
// </Grid>
