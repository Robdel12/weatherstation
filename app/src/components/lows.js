import React, { Component } from 'react';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import DataCard, { DataConsumer } from './data-card';

class LowComponent extends Component {
  renderHeader() {
    let { lowType, noHeader } = this.props;

    if (noHeader) return null;

    return (
      <Typography variant="h5" component="h2" gutterBottom data-test-heading>
        {lowType.charAt(0).toUpperCase() + lowType.slice(1)} Low
      </Typography>
    );
  }

  render() {
    return (
      <DataCard apiEndpoint={`${this.props.lowType}-lows`} hasLoaded={this.props.hasLoaded}>
        <DataConsumer>
          {data => (
            <Card data-test-low-component>
              <CardContent>
                {this.renderHeader()}
                <Typography variant="body1" gutterBottom data-test-temp>
                  Temp: {parseFloat(data.lowTemp).toFixed(2)} F
                </Typography>
                <Typography variant="body1" gutterBottom data-test-pressure>
                  Pressure: {parseFloat(data.lowPressure).toFixed(2)} hPa
                </Typography>
                <Typography variant="body1" gutterBottom data-test-humidity>
                  Humidity: {parseFloat(data.lowHumidity).toFixed(2)} %
                </Typography>
              </CardContent>
            </Card>
          )}
        </DataConsumer>
      </DataCard>
    );
  }
}

export default LowComponent;
