const { run } = require("@percy/script");
const ROOT_URL = `http://localhost:8080`;

run(
  async (page, snapshot) => {
    await page.goto(`${ROOT_URL}`);
    await page.waitFor("[data-test-avg-component]");
    await snapshot("Home");

    await page.goto(`${ROOT_URL}/live`);
    await page.waitFor("[data-test-live-route]");
    await snapshot("Live");

    await page.goto(`${ROOT_URL}/averages`);
    await page.waitFor("[data-test-avg-component]");
    await snapshot("Averages");

    await page.goto(`${ROOT_URL}/highs`);
    await page.waitFor("[data-test-high-component]");
    await snapshot("Highs");

    await page.goto(`${ROOT_URL}/lows`);
    await page.waitFor("[data-test-low-component]");
    await snapshot("Lows");

    await page.goto(`${ROOT_URL}/issues`);
    await page.waitFor("[data-test-issues-list]");
    await snapshot("Issues");

    await page.click('button[aria-label="Navigation"]');
  },
  { headless: false }
);
