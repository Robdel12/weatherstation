import interactor, { scoped } from 'interactor.js';
import percySnapshot from '@interactor/percy';

@interactor
class DataCardInteractor {
  static defaultScope = '[data-test-data-card]';

  temp = scoped('[data-test-temp]');
  wind = scoped('[data-test-wind]');
  rain = scoped('[data-test-rain]');
  heading = scoped('[data-test-heading]');
  humidity = scoped('[data-test-humidity]');
  pressure = scoped('[data-test-pressure]');
  baroTemp = scoped('[data-test-baro-temp]');
  error = scoped('[data-test-data-card-error]');
  loading = scoped('[data-test-data-card-loading]');

  snapshot(title, options) {
    return percySnapshot(`Data card - ${title}`, options);
  }
}

export default DataCardInteractor;
