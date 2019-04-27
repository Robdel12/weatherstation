const puppeteer = require("puppeteer");
const { percySnapshot } = require("@percy/puppeteer");

const ROOT_URL = `http://localhost:8080`;
const pages = [
  {
    title: "Home",
    path: "",
    async interaction(page) {
      await page.waitFor("[data-test-avg-component]");
    }
  },
  {
    title: "Live",
    path: "live",
    async interaction(page) {
      await page.waitFor("[data-test-live-route]");
    }
  },
  {
    title: "Averages",
    path: "averages",
    async interaction(page) {
      await page.waitFor("[data-test-avg-component]");
    }
  },
  {
    title: "Highs",
    path: "highs",
    async interaction(page) {
      await page.waitFor("[data-test-high-component]");
    }
  },
  {
    title: "Lows",
    path: "lows",
    async interaction(page) {
      await page.waitFor("[data-test-low-component]");
    }
  },
  {
    title: "Issues",
    path: "issues",
    async interaction(page) {
      await page.waitFor("[data-test-issues-list]");
      await page.waitFor(400);
    }
  }
];

(async () => {
  let browser = await puppeteer.launch({
    headless: true,
    args: ["–no-sandbox", "–disable-setuid-sandbox", "--single-process"]
  });

  let page = await browser.newPage();

  let snapshots = pages.map(route => {
    return async () => {
      let url = `${ROOT_URL}/${route.path}`;
      console.log(`Taking snapshot of ${url} ...`);

      await page.goto(url);

      if (route.interaction) {
        await route.interaction(page);
      }

      await percySnapshot(page, route.title);
      console.log("Snapshot complete.");
    };
  });

  // Snapshot these pages sequentially
  await snapshots.reduce((p, fn) => p.then(fn), Promise.resolve());
  await browser.close();
})();
