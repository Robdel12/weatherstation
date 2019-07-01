import { Interactor, collection } from "interactor.js";
import AppBar from "../../src/client/components/__tests__/app-bar.interactor";
import LowComponent from "../../src/client/components/__tests__/lows.interactor";
import percySnapshot from "@interactor/percy";

let LowsPage = Interactor.from({
  appBar: new AppBar(),
  lows: collection("[data-test-low-component]", LowComponent),

  snapshot(title, options) {
    return percySnapshot(`Lows Page - ${title}`, options);
  }
});

export default LowsPage;
