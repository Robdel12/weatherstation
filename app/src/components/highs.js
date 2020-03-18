import React, { Component } from 'react';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import DataCard, { DataConsumer } from './data-card';

class HighComponent extends Component {
  renderHeader() {
    let { highType, noHeader } = this.props;

    if (noHeader) return null;

    return (
      <Typography variant="h5" component="h2" gutterBottom data-test-heading>
        {highType.charAt(0).toUpperCase() + highType.slice(1)} High
      </Typography>
    );
  }

  render() {
    return (
      <DataCard apiEndpoint={`${this.props.highType}-highs`} hasLoaded={this.props.hasLoaded}>
        <DataConsumer>
          {data => (
            <Card data-test-high-component>
              <CardContent>
                {this.renderHeader()}
                <Typography variant="body1" gutterBottom data-test-temp>
                  Temp: {parseFloat(data.highTemp).toFixed(2)} F
                </Typography>
                <Typography variant="body1" gutterBottom data-test-pressure>
                  Pressure: {parseFloat(data.highPressure).toFixed(2)} hPa
                </Typography>
                <Typography variant="body1" gutterBottom data-test-humidity>
                  Humidity: {parseFloat(data.highHumidity).toFixed(2)} %
                </Typography>
                <Typography variant="body1" gutterBottom data-test-wind>
                  Wind Speed: {parseFloat(data.highWindSpeed).toFixed(2)} mph
                </Typography>
                <Typography variant="body1" data-test-rain>
                  Total Rain: {parseFloat(data.totalRain).toFixed(2)} in
                </Typography>
              </CardContent>
            </Card>
          )}
        </DataConsumer>
      </DataCard>
    );
  }
}

export default HighComponent;
