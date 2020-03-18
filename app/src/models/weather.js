import dayjs from 'dayjs';

export default class WeatherModel {
  constructor(data) {
    this.data = data;
  }

  get raw() {
    return this.data;
  }

  get temp() {
    return parseInt(this.data.temp, 10);
  }

  get barometerTemp() {
    return parseInt(this.data.barometerTemp, 10);
  }

  get pressure() {
    return parseFloat(this.data.pressure).toFixed(2);
  }

  get humidity() {
    return parseFloat(this.data.humidity).toFixed(2);
  }

  get altitude() {
    return parseInt(this.data.altitude, 10);
  }

  get rain() {
    return parseFloat(this.data.rain).toFixed(2);
  }

  get currentWindSpeed() {
    return parseFloat(this.data.currentWindSpeed).toFixed(2);
  }

  get currentWindDirection() {
    return this.data.currentWindDirection;
  }

  get displayTime() {
    return dayjs(this.data.createdAt).format('h:mm:ss a (MM/DD)');
  }
}
