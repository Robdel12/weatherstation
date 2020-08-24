import percySnapshot from '@interactor/percy';
import interactor, { scoped, collection } from 'interactor.js';

@interactor
class AppInteractor {
  navBar = scoped('[data-test-nav]', {
    link: collection('li a')
  });

  pageHeading = scoped('h1', {
    nested: scoped('span')
  });

  live = scoped('[data-test-live-route]', {
    wind: scoped('[data-test-wind]'),
    temp: scoped('[data-test-temperature]'),
    pressure: scoped('[data-test-pressure]'),
    humidity: scoped('[data-test-humidity]')
  });

  snapshot(title, options) {
    return percySnapshot(`Acceptance - ${title}`, options);
  }
}

export default AppInteractor;
