import React, { Component } from "react";
import AvgComponent from "../components/average";

function Home() {
  return (
    <>
      <h1 className="title">Weather right now</h1>
      <AvgComponent avgType="ten-min" noHeader />
    </>
  );
}

export default Home;
