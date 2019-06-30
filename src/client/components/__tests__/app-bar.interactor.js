import { Interactor, collection, scoped } from "interactor.js";
import percySnapshot from "@interactor/percy";

let AppBarInteractor = Interactor.from({
  header: scoped("header"),
  drawer: scoped("[data-test-app-drawer]"),
  links: collection("[data-test-app-drawer] a"),
  modalWrapper: scoped("[data-test-modal-wrapper]"),
  modalBackdrop: scoped("[data-test-modal-wrapper] div"),
  hamburgerMenu: scoped('button[aria-label="Navigation"]'),
  refreshButton: scoped('button[aria-label="Refresh page"]'),

  snapshot(title, options) {
    return percySnapshot(`AppBar - ${title}`, options);
  }
});

export default AppBarInteractor;
