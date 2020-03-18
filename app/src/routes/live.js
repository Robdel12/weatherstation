import React, { Component, createRef } from 'react';
import WeatherModel from '../models/weather';
import { processResponse } from '../utils';

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import Loading from '../components/loading';

let styles = {
  container: {
    marginTop: '20px'
  },
  title: {
    marginLeft: '10px'
  },
  gridItem: {
    padding: '10px',
    minWidth: '275px'
  }
};

let $heading = createRef();

class LiveFeed extends Component {
  state = {
    data: [],
    isLoading: true,
    error: null
  };

  hasLoaded() {
    if ($heading.current) {
      $heading.current.focus();
    }
  }

  componentDidMount() {
    fetch('/v1/weather?limit=3')
      .then(res => processResponse(res))
      .then(weather => {
        let data = weather.map(point => new WeatherModel(point));

        this.setState({
          data,
          isLoading: false
        });

        this.hasLoaded();
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
        fetch('/v1/weather')
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
      return <Loading />;
    }

    if (error) {
      return (
        <span>
          Robert needs to fix this: {error.text} ({error.status})
        </span>
      );
    }

    return (
      <div className={classes.container} data-test-live-route>
        <Typography variant="h3" component="h1" gutterBottom className={classes.title}>
          <span tabIndex={-1} ref={$heading}>
            Live weather
          </span>
        </Typography>

        <Grid container spacing={0}>
          {data.map((dataPoint, index) => (
            <Grid item xs key={dataPoint.data._id} className={classes.gridItem}>
              <Card data-test-live-card>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom data-test-time>
                    {dataPoint.displayTime}
                  </Typography>
                  <Typography variant="body1" gutterBottom data-test-temp>
                    {dataPoint.temp} F
                  </Typography>
                  <Typography variant="body1" gutterBottom data-test-humidity>
                    {dataPoint.humidity}%
                  </Typography>
                  <Typography variant="body1" gutterBottom data-test-pressure>
                    {dataPoint.pressure} hPa
                  </Typography>
                  <Typography variant="body1" gutterBottom data-test-wind>
                    {dataPoint.currentWindSpeed} mph ({dataPoint.currentWindDirection})
                  </Typography>
                  <Typography variant="body1" gutterBottom data-test-rain>
                    {dataPoint.rain} in
                  </Typography>
                  <Typography variant="body1" gutterBottom data-test-baro-temp>
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
