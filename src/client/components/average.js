import React, { Component } from "react";
import { processResponse } from "../utils";

class AvgComponent extends Component {
  state = {
    data: {},
    isLoading: true,
    error: null
  };

  componentDidMount() {
    fetch(`/v1/${this.props.avgType}-average`)
      .then(res => processResponse(res))
      .then(data => {
        this.setState({
          data,
          isLoading: false
        });
      })
      .catch(error => {
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
      <p className="title">
        {avgType.charAt(0).toUpperCase() + avgType.slice(1)} Averages
      </p>
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
      <div className="card">
        <div className="card-content">
          {this.renderHeader()}
          <div className="content">
            <p>Temp: {parseFloat(data.avgTemp).toFixed(2)} F</p>
            <p>
              Barometer Temp: {parseFloat(data.avgBarometerTemp).toFixed(2)} F
            </p>
            <p>Pressure: {parseFloat(data.avgPressure).toFixed(2)} hPa</p>
            <p>Humidity: {parseFloat(data.avgHumidity).toFixed(2)} %</p>
            <p>Wind Speed: {parseFloat(data.avgWindSpeed).toFixed(2)} mph</p>
          </div>
        </div>
      </div>
    );
  }
}

export default AvgComponent;
