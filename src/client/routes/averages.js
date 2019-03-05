import React, { Component } from "react";
import AvgComponent from "../components/average";

function Averages() {
  return (
    <div className="container columns">
      <div className="column">
        <AvgComponent avgType="hourly" />
      </div>
      <div className="column">
        <AvgComponent avgType="daily" />
      </div>
      <div className="column">
        <AvgComponent avgType="ten-min" />
      </div>
    </div>
  );
}

export default Averages;
