import React, { Component } from "react";
import { mount } from "testing-hooks/react-dom";
import { Interactor, scoped, click, press, collection, text } from "interactor.js";
import { MemoryRouter } from "react-router";
import AppBar from "../../src/client/components/app-bar";

let AppBarInteractor = Interactor.from({
  links: collection("[data-test-app-drawer] a")
});

describe("AppBar Component", () => {
  let navBar = new AppBarInteractor();

  it("renders", async () => {
    await mount(<AppBar drawerIsOpen={false} closeDrawer={() => {}} openDrawer={() => {}} />);

    await scoped("header").assert.exists();
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

    await click('button[aria-label="Navigation"]').assert(() => isOpen === true);
  });

  it("renders the list open", async () => {
    await mount(
      <MemoryRouter>
        <AppBar drawerIsOpen={true} closeDrawer={() => {}} openDrawer={() => {}} onMenuTap={() => {}} />
      </MemoryRouter>
    );

    await scoped("[data-test-app-drawer]").assert.exists();
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
    await press('div[role="presentation"]', "Escape").assert(() => isOpen === false);
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
    await click('div[role="presentation"] div').assert(() => isOpen === false);
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

    await click('button[aria-label="Refresh page"]').assert(() => isRefreshing === true);
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

    await navBar.assert.links().count(6);
    await navBar.assert.links(0).text("Home");
    await navBar.assert.links(1).text("Live");
    await navBar.assert.links(2).text("Averages");
    await navBar.assert.links(3).text("Highs");
    await navBar.assert.links(4).text("Lows");
    await navBar.assert.links(5).text("Known issues");
  });
});
