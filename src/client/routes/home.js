import React, { Component } from "react";
import AvgComponent from "../components/average";
import Typography from "@material-ui/core/Typography";

function Home() {
  return (
    <div style={{ margin: "18px"}}>
      <Typography variant="h4" gutterBottom>Weather right now</Typography>
      <AvgComponent avgType="ten-min" noHeader />
    </div>
  );
}

export default Home;
