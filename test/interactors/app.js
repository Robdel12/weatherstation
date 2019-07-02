import { Interactor, scoped, collection } from "interactor.js";
import AvgComponent from "../../src/client/components/__tests__/averages.interactor";
import AppBar from "../../src/client/components/__tests__/app-bar.interactor";
import LowComponent from "../../src/client/components/__tests__/lows.interactor";
import HighComponent from "../../src/client/components/__tests__/highs.interactor";
import percySnapshot from "@interactor/percy";

let AppInteractor = Interactor.from({
  navBar: new AppBar(),
  tenMinAvg: new AvgComponent(),
  lows: collection("[data-test-low-component]", LowComponent),
  highs: collection("[data-test-high-component]", HighComponent),
  averages: collection("[data-test-avg-component]", AvgComponent),

  snapshot(title, options) {
    return percySnapshot(`Acceptance - ${title}`, options);
  }
});

export default AppInteractor;
