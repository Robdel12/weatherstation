import React, { Component } from "react";
import { processResponse } from "../utils";

import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";

class LowComponent extends Component {
  static defaultProps = {
    hasLoaded: function() {}
  };

  state = {
    data: {},
    isLoading: true,
    error: null
  };

  componentDidMount() {
    fetch(`/v1/${this.props.lowType}-lows`)
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
    let { lowType, noHeader } = this.props;

    if (noHeader) return null;

    return (
      <Typography variant="h5" component="h2" gutterBottom>
        {lowType.charAt(0).toUpperCase() + lowType.slice(1)} Low
      </Typography>
    );
  }

  render() {
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
      <Card data-test-low-component>
        <CardContent>
          {this.renderHeader()}
          <Typography variant="body1" gutterBottom>
            Temp: {parseFloat(data.lowTemp).toFixed(2)} F
          </Typography>
          <Typography variant="body1" gutterBottom>
            Pressure: {parseFloat(data.lowPressure).toFixed(2)} hPa
          </Typography>
          <Typography variant="body1" gutterBottom>
            Humidity: {parseFloat(data.lowHumidity).toFixed(2)} %
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default LowComponent;
