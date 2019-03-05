import React, { Component } from "react";

class AvgComponent extends Component {
  state = {
    data: {},
    isLoading: true
  };

  componentDidMount() {
    fetch(`/v1/${this.props.avgType}-average`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          data,
          isLoading: false
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
    let { data, isLoading } = this.state;

    if (isLoading) {
      return <h1>Loading...</h1>;
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
