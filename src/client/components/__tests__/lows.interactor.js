import { Interactor, scoped } from "interactor.js";
import percySnapshot from "@interactor/percy";

let LowsInteractor = Interactor.from({
  static: {
    defaultScope: "[data-test-low-component]"
  },
  temp: scoped("[data-test-temp]"),
  error: scoped("[data-test-error]"),
  heading: scoped("[data-test-heading]"),
  humidity: scoped("[data-test-humidity]"),
  pressure: scoped("[data-test-pressure]"),
  loading: scoped("[data-test-loading-spinner]"),

  snapshot(title, options) {
    return percySnapshot(`Lows - ${title}`, options);
  }
});

export default LowsInteractor;
