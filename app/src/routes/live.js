import React, { useState, useEffect } from 'react';

import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';

import OpacityIcon from '@material-ui/icons/Opacity';

function avgCollection(collection) {
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

function focusRef(node) {
  // eslint-disable-next-line no-unused-expressions
  node?.focus();
}

function Live({ classes }) {
  let [collection, updateCollection] = useState([]);
  let [rawData, updateRawData] = useState({
    temp: 0,
    pressure: 0,
    humidity: 0,
    currentWindDirection: '',
    currentWindSpeed: 0
  });

  function updateWeather({ data }) {
    let parsedData = JSON.parse(data);
    updateRawData(parsedData);

    // Keep 15 recods around to avg (about 30 seconds of data)
    if (collection.length > 15) {
      collection = collection.slice(0, 14);
    }

    collection = collection.concat(parsedData);
    updateCollection(collection);
  }

  useEffect(() => {
    let protocol = window.location.protocol === 'https' ? 'wss://' : 'ws://';
    let hasPort = window.location.port ? `:${window.location.port}` : '';
    let hostname = `${window.location.hostname}${hasPort}`;
    // let socket = new WebSocket(`ws://weather.deluca.house/v1`);
    let socket = new WebSocket(`${protocol}${hostname}/v1`);

    socket.addEventListener('message', updateWeather);
    return () => socket.close();
  }, []);

  let data = collection.length < 3 ? rawData : avgCollection(collection);

  return (
    <div className={classes.container} data-test-live-route>
      <Typography variant="h3" component="h1" gutterBottom className={classes.title}>
        <span tabIndex={-1} ref={focusRef}>
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

export default withStyles(styles)(Live);
