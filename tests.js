const puppeteer = require("puppeteer");
const { percySnapshot } = require("@percy/puppeteer");

const ROOT_URL = `http://localhost:8080`;
const pages = [
  {
    title: "Home",
    path: ""
  },
  {
    title: "Live",
    path: "live"
  },
  {
    title: "Averages",
    path: "averages"
  },
  {
    title: "Highs",
    path: "highs"
  },
  {
    title: "Lows",
    path: "lows"
  },
  {
    title: "Issues",
    path: "issues"
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

      await percySnapshot(page, route.title);
      console.log("Snapshot complete.");
    };
  });

  // Snapshot these pages sequentially
  await snapshots.reduce((p, fn) => p.then(fn), Promise.resolve());
  await browser.close();
})();
