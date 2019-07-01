import { Interactor, scoped, collection } from "interactor.js";
import AppBar from "../../src/client/components/__tests__/app-bar.interactor";
import percySnapshot from "@interactor/percy";

let KnownIssues = Interactor.from({
  heading: scoped("[data-test-heading]"),
  appBar: new AppBar(),

  issues: collection("[data-test-issue]", {
    title: scoped("[data-test-issue-title]"),
    body: scoped("[data-test-issue-body]"),
    icon: scoped("[data-test-issue-icon]")
  }),

  snapshot(title, options) {
    return percySnapshot(`Known issues - ${title}`, options);
  }
});

export default KnownIssues;
