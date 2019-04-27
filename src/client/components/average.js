import React, { Component } from "react";
import { processResponse } from "../utils";

import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";

class AvgComponent extends Component {
  static defaultProps = {
    hasLoaded: function() {}
  };

  state = {
    data: {},
    isLoading: true,
    error: null
  };

  componentDidMount() {
    fetch(`/v1/${this.props.avgType}-average`)
      .then(res => processResponse(res))
      .then(data => {
        this.props.hasLoaded();
        this.setState({
          data,
          isLoading: false
        });
      })
      .catch(error => {
        this.props.hasLoaded();
        this.setState({
          isLoading: false,
          error
        });
      });
  }

  renderHeader() {
    let { avgType, noHeader } = this.props;

    if (noHeader) return null;

    return (
      <Typography variant="h5" component="h2" gutterBottom>
        {avgType.charAt(0).toUpperCase() + avgType.slice(1)} Averages
      </Typography>
    );
  }

  render() {
    let { avgType } = this.props;
    let { data, isLoading, error } = this.state;

    if (isLoading) {
      return <h1>Loading...</h1>;
    }

    if (error) {
      return (
        <span>
          Robert needs to fix this: {error.text} ({error.status})
        </span>
      );
    }

    return (
      <Card>
        <CardContent>
          {this.renderHeader()}
          <Typography variant="body1" gutterBottom>
            Temp: {parseFloat(data.avgTemp).toFixed(2)} F
          </Typography>
          <Typography variant="body1" gutterBottom>
            Barometer Temp: {parseFloat(data.avgBarometerTemp).toFixed(2)} F
          </Typography>
          <Typography variant="body1" gutterBottom>
            Pressure: {parseFloat(data.avgPressure).toFixed(2)} hPa
          </Typography>
          <Typography variant="body1" gutterBottom>
            Humidity: {parseFloat(data.avgHumidity).toFixed(2)} %
          </Typography>
          <Typography variant="body1" gutterBottom>
            Wind Speed: {parseFloat(data.avgWindSpeed).toFixed(2)} mph
          </Typography>
          <Typography variant="body1">
            Rain total: {parseFloat(data.totalRain).toFixed(2)} in
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default AvgComponent;
