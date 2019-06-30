import React from "react";
import { mount } from "testing-hooks/react-dom";
import { MemoryRouter } from "react-router";
import AppBar from "../app-bar";
import AppBarInteractor from "./app-bar.interactor.js";

describe("AppBar Component", () => {
  let navBar = new AppBarInteractor();

  it("renders", async () => {
    await mount(<AppBar drawerIsOpen={false} closeDrawer={() => {}} openDrawer={() => {}} />);

    await navBar.assert.header.exists().snapshot("closed");
  });

  it("fires the onMenuTap action onClick", async () => {
    let isOpen = false;

    await mount(
      <AppBar
        drawerIsOpen={isOpen}
        closeDrawer={() => {}}
        openDrawer={() => {
          isOpen = true;
        }}
        onMenuTap={() => {
          isOpen = true;
        }}
      />
    );

    await navBar.hamburgerMenu.click().assert(() => isOpen === true);
  });

  it("renders the list open", async () => {
    await mount(
      <MemoryRouter>
        <AppBar drawerIsOpen={true} closeDrawer={() => {}} openDrawer={() => {}} onMenuTap={() => {}} />
      </MemoryRouter>
    );

    await navBar.assert.drawer.exists();
  });

  it("fires the close action with the escape key", async () => {
    let isOpen = true;

    await mount(
      <MemoryRouter>
        <AppBar
          drawerIsOpen={isOpen}
          openDrawer={() => {}}
          closeDrawer={() => {
            isOpen = false;
          }}
          onMenuTap={() => {}}
        />
      </MemoryRouter>
    );

    // Material UI attaches the key event to the modal outer wrapper
    await navBar.modalWrapper.press("Escape").assert(() => isOpen === false);
  });

  it("fires the close action with an outside click", async () => {
    let isOpen = true;

    await mount(
      <MemoryRouter>
        <AppBar
          drawerIsOpen={isOpen}
          openDrawer={() => {}}
          closeDrawer={() => {
            isOpen = false;
          }}
          onMenuTap={() => {}}
        />
      </MemoryRouter>
    );

    // Material UI attaches the click event to the modal backdrop
    await navBar.modalBackdrop.click().assert(() => isOpen === false);
  });

  it("fires the onRefresh action when clicking the refresh button", async () => {
    let isRefreshing = false;

    await mount(
      <AppBar
        drawerIsOpen={false}
        openDrawer={() => {}}
        closeDrawer={() => {}}
        onRefresh={() => (isRefreshing = true)}
      />
    );

    await navBar.refreshButton.click().assert(() => isRefreshing === true);
  });

  it("has 6 links with the correct label", async () => {
    let isRefreshing = false;

    await mount(
      <MemoryRouter>
        <AppBar
          drawerIsOpen={true}
          openDrawer={() => {}}
          closeDrawer={() => {}}
          onRefresh={() => (isRefreshing = true)}
        />
      </MemoryRouter>
    );

    // prettier-ignore
    await navBar.assert.links().count(6)
      .assert.links(0).text("Home")
      .assert.links(1).text('Live')
      .assert.links(1).text("Live")
      .assert.links(2).text("Averages")
      .assert.links(3).text("Highs")
      .assert.links(4).text("Lows")
      .assert.links(5).text("Known issues")
      .snapshot('open');
  });
});
