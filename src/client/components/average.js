import React, { Component } from 'react';

class AvgComponent extends Component {
  state = {
    data: {}
  };

  componentDidMount() {
    fetch(`/v1/${this.props.avgType}-average`)
      .then(res => res.json())
      .then(data => {
        this.setState({ data });
      });
  }

  render() {
    let { avgType } = this.props;
    let { data } = this.state;

    return (
      <div className="card">
        <div className="card-content">
          <p className="title">
            {avgType.charAt(0).toUpperCase() + avgType.slice(1)} Averages
          </p>
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
