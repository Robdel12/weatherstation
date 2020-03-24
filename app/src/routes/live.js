import React, { Component, createRef } from 'react';

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import Loading from '../components/loading';

import OpacityIcon from '@material-ui/icons/Opacity';

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
    collection: [],
    rawData: {
      temp: 0,
      pressure: 0,
      humidity: 0,
      currentWindDirection: '',
      currentWindSpeed: 0
    }
  };

  hasLoaded() {
    if ($heading.current) {
      $heading.current.focus();
    }
  }

  updateWeather = ({ data }) => {
    let parsedData = JSON.parse(data);
    let { collection } = this.state;

    // Keep 15 recods around to avg (about 30 seconds of data)
    if (collection.length > 15) {
      collection = collection.slice(0, 14);
    }

    collection.push(parsedData);
    this.setState({ collection, rawData: parsedData });
  };

  componentDidMount() {
    let protocol = window.location.protocol === 'https' ? 'wss://' : 'ws://';
    let hasPort = !!window.location.port ? `:${window.location.port}` : '';
    let hostname = `${window.location.hostname}${hasPort}`;

    this.socket = new WebSocket(`${protocol}${hostname}/v1`);
    this.socket.addEventListener('message', this.updateWeather);
  }

  componentWillUnmount() {
    this.socket.close();
  }

  avgCollection() {
    let { collection, rawData } = this.state;

    if (collection.length < 3) {
      return rawData;
    }

    let sum = collection.reduce(
      (acc, cv, i, src) => {
        acc.temp += cv.temp;
        acc.pressure += cv.pressure;
        acc.humidity += cv.humidity;

        return acc;
      },
      {
        temp: 0,
        pressure: 0,
        humidity: 0
      }
    );

    return {
      temp: sum.temp / collection.length,
      pressure: sum.pressure / collection.length,
      humidity: sum.humidity / collection.length
    };
  }

  render() {
    let { rawData } = this.state;
    let { classes } = this.props;
    let data = this.avgCollection();

    return (
      <div className={classes.container} data-test-live-route>
        <Typography variant="h3" component="h1" gutterBottom className={classes.title}>
          <span tabIndex={-1} ref={$heading}>
            Live weather
          </span>
        </Typography>

        <Card data-test-live-card>
          <CardContent>
            <Typography variant="h4" gutterBottom data-test-temp>
              {parseInt(data.temp, 10)} F
            </Typography>
            <Typography variant="body1" gutterBottom data-test-humidity>
              <OpacityIcon /> {parseInt(data.humidity, 10)}%
            </Typography>
            <Typography variant="body1" gutterBottom data-test-pressure>
              {parseInt(data.pressure, 10)} hPa
            </Typography>
            <Typography variant="body1" gutterBottom data-test-wind>
              {rawData.currentWindSpeed.toFixed(2)} mph ({rawData.currentWindDirection})
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(LiveFeed);
