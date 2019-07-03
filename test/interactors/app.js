import percySnapshot from "@interactor/percy";
import { Interactor, scoped, collection } from "interactor.js";
import AppBar from "../../src/client/components/__tests__/app-bar.interactor";
import DataCardInteractor from "../../src/client/components/__tests__/data-card.interactor";

let AppInteractor = Interactor.from({
  navBar: new AppBar(),
  tenMinAvg: new DataCardInteractor(),
  lows: collection("[data-test-low-component]", DataCardInteractor),
  highs: collection("[data-test-high-component]", DataCardInteractor),
  averages: collection("[data-test-avg-component]", DataCardInteractor),

  snapshot(title, options) {
    return percySnapshot(`Acceptance - ${title}`, options);
  }
});

export default AppInteractor;
