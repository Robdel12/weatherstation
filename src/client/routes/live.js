import React, { Component } from "react";
import WeatherModel from "../models/weather";
import { processResponse } from "../utils";

import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";

let styles = {
  container: {
    marginTop: "20px"
  },
  title: {
    marginLeft: "10px"
  },
  gridItem: {
    padding: "10px",
    minWidth: "375px"
  }
};

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
    let { classes } = this.props;

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
      <div className={classes.container}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          className={classes.title}
        >
          Live weather
        </Typography>

        <Grid container spacing={0}>
          {data.map((dataPoint, index) => (
            <Grid
              item
              xs
              key={dataPoint.displayTime}
              className={classes.gridItem}
            >
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {dataPoint.displayTime}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {dataPoint.temp} F
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {dataPoint.humidity}%
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {dataPoint.pressure} hPa
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {dataPoint.currentWindSpeed} mph (
                    {dataPoint.currentWindDirection})
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {dataPoint.hourlyRain} in/hr
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {dataPoint.dailyRain} in/day
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Barometer temp {dataPoint.barometerTemp} F
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(LiveFeed);
