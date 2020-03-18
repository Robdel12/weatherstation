import percySnapshot from '@interactor/percy';
import interactor, { scoped, collection } from 'interactor.js';
import AppBar from '../../src/components/__tests__/app-bar.interactor';
import DataCardInteractor from '../../src/components/__tests__/data-card.interactor';

@interactor
class AppInteractor {
  navBar = new AppBar();
  pageHeading = scoped('h1', {
    nested: scoped('span')
  });

  tenMinAvg = new DataCardInteractor();
  lows = collection('[data-test-low-component]', DataCardInteractor);
  highs = collection('[data-test-high-component]', DataCardInteractor);
  averages = collection('[data-test-avg-component]', DataCardInteractor);
  live = collection('[data-test-live-card]', DataCardInteractor);

  snapshot(title, options) {
    return percySnapshot(`Acceptance - ${title}`, options);
  }
}

export default AppInteractor;
