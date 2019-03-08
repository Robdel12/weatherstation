import React, { Component } from "react";
import WeatherModel from "../models/weather";
import { processResponse } from "../utils";

class LiveFeed extends Component {
  state = {
    data: [],
    isLoading: true,
    error: null
  };

  componentDidMount() {
    fetch("/v1/weather?limit=3")
      .then(res => processResponse(res))
      .then(weather => {
        let data = weather.map(point => new WeatherModel(point));

        this.setState({
          data,
          isLoading: false
        });

        this.pollForData();
      })
      .catch(error => {
        this.setState({
          error
        });
      });
  }

  pollForData() {
    this.poller = window.setInterval(() => {
      if (!document.hidden) {
        fetch("/v1/weather")
          .then(res => processResponse(res))
          .then(weather => {
            let data = weather.map(point => new WeatherModel(point));

            this.setState({ data });
          })
          .catch(error => {
            this.setState({
              error
            });
          });
      }
    }, 3500);
  }

  componentWillUnmount() {
    window.clearTimeout(this.poller);
  }

  render() {
    let { data, error, isLoading } = this.state;

    if (isLoading) {
      return <h3>Loading...</h3>;
    }

    if (error) {
      return (
        <span>
          Robert needs to fix this: {error.text} ({error.status})
        </span>
      );
    }

    return (
      <>
        <h1 className="title">Live Feed</h1>

        <div className="cardWrapper">
          {data.map((dataPoint, index) => (
            <div
              className={index === 0 ? "first card" : "card"}
              key={dataPoint.displayTime}
            >
              <div className="card-content">
                <p className="title">{dataPoint.displayTime}</p>
                <div className="content">
                  <p>{dataPoint.temp} F</p>
                  <p>{dataPoint.humidity}%</p>
                  <p>{dataPoint.pressure} hPa</p>
                  <p>
                    {dataPoint.currentWindSpeed} mph (
                    {dataPoint.currentWindDirection})
                  </p>
                  <p>{dataPoint.hourlyRain} in/hr</p>
                  <p>{dataPoint.dailyRain} in/day</p>
                  <p>Barometer temp {dataPoint.barometerTemp} F</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
}

export default LiveFeed;
