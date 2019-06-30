import { Interactor, scoped } from "interactor.js";
import percySnapshot from "@interactor/percy";

let HighsInteractor = Interactor.from({
  static: {
    defaultScope: "[data-test-high-component]"
  },
  temp: scoped("[data-test-temp]"),
  wind: scoped("[data-test-wind]"),
  rain: scoped("[data-test-rain]"),
  error: scoped("[data-test-error]"),
  heading: scoped("[data-test-heading]"),
  humidity: scoped("[data-test-humidity]"),
  pressure: scoped("[data-test-pressure]"),
  loading: scoped("[data-test-loading-spinner]"),

  snapshot(title, options) {
    return percySnapshot(`Highs - ${title}`, options);
  }
});

export default HighsInteractor;
