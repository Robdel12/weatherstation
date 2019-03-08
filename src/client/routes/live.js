import React, { Component } from "react";
import WeatherModel from "../models/weather";
import { processResponse } from "../utils";

class LiveFeed extends Component {
  state = {
    data: [],
    error: null
  };

  componentDidMount() {
    fetch("/v1/weather?limit=3")
      .then(res => processResponse(res))
      .then(weather => {
        let data = weather.map(point => new WeatherModel(point));

        this.setState({ data });
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
    let { data, error } = this.state;

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
            <div className={index === 0 ? "first card" : "card"}>
              <div className="card-content">
                <p className="title">{dataPoint.displayTime}</p>
                <div className="content">
                  <p>{dataPoint.temp} F</p>
                  <p>{dataPoint.humidity}%</p>
                  <p>{dataPoint.altitude} ft</p>
                  <p>{dataPoint.pressure} hPa</p>
                  <p>
                    {dataPoint.currentWindSpeed} mph ($
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
