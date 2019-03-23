import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import HighComponent from "../components/highs";
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

function Highs(props) {
  let { classes } = props;

  return (
    <Grid container spacing={0} className={classes.container}>
      <Grid item xs className={classes.gridItem}>
        <HighComponent highType="daily" />
      </Grid>
      <Grid item xs className={classes.gridItem}>
        <HighComponent highType="weekly" />
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(Highs);

// <Grid item xs className={classes.gridItem}>
//   <HighComponent avgType="daily" />
// </Grid>
