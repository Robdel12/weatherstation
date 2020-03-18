import React, { Component } from "react";
import { processResponse } from "../utils";

import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import DataCard, { DataConsumer } from "./data-card";

class AvgComponent extends Component {
  renderHeader() {
    let { avgType, noHeader } = this.props;

    if (noHeader) return null;

    return (
      <Typography variant="h5" component="h2" gutterBottom data-test-heading>
        {avgType.charAt(0).toUpperCase() + avgType.slice(1)} Averages
      </Typography>
    );
  }

  render() {
    return (
      <DataCard apiEndpoint={`${this.props.avgType}-average`} hasLoaded={this.props.hasLoaded}>
        <DataConsumer>
          {data => (
            <Card data-test-avg-component>
              <CardContent>
                {this.renderHeader()}
                <Typography variant="body1" gutterBottom data-test-temp>
                  Temp: {parseFloat(data.avgTemp).toFixed(2)} F
                </Typography>
                <Typography variant="body1" gutterBottom data-test-baro-temp>
                  Barometer Temp: {parseFloat(data.avgBarometerTemp).toFixed(2)} F
                </Typography>
                <Typography variant="body1" gutterBottom data-test-pressure>
                  Pressure: {parseFloat(data.avgPressure).toFixed(2)} hPa
                </Typography>
                <Typography variant="body1" gutterBottom data-test-humidity>
                  Humidity: {parseFloat(data.avgHumidity).toFixed(2)} %
                </Typography>
                <Typography variant="body1" gutterBottom data-test-wind>
                  Wind Speed: {parseFloat(data.avgWindSpeed).toFixed(2)} mph
                </Typography>
                <Typography variant="body1" data-test-rain>
                  Rain total: {parseFloat(data.totalRain).toFixed(2)} in
                </Typography>
              </CardContent>
            </Card>
          )}
        </DataConsumer>
      </DataCard>
    );
  }
}

export default AvgComponent;
