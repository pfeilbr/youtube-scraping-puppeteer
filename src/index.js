const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs-extra");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const dataPath = filename => path.resolve(__dirname, "..", "data", filename);

const autoScroll = async page => {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 200;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        let elements = document.querySelectorAll("#video-title");
        for (const e of elements) {
          const item = {
            title: e.text,
            url: `${e.href}`
          };
          console.log(JSON.stringify(item));
        }

        // if (totalHeight >= scrollHeight) {
        //   clearInterval(timer);
        //   resolve();
        // }
      }, 100);
    });
  });
};

const getVideosForChannel = async channelName => {
  const cache = {};
  const videos = [];
  const filePath = dataPath(`${channelName}-channel-videos.json`);
  fs.removeSync(filePath);
  fs.outputJSONSync(filePath, [], { spaces: "\t" });

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  let counter = 0;
  page.on("console", msg => {
    try {
      const item = JSON.parse(msg.text());
      console.log(item);

      if (!cache[item.url]) {
        cache[item.url] = true;
        videos.push(item);
        fs.outputJSONSync(filePath, videos, { spaces: "\t" });
        counter++;
      }
    } catch (e) {}

    //console.log(msg.text());
  });
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`https://www.youtube.com/user/${channelName}/videos`);
  await sleep(1000);
  await autoScroll(page);
  await browser.close();
};

const run = async () => {
  await Promise.all([
    getVideosForChannel("AmazonWebServices"),
    getVideosForChannel("AWSwebinars")
  ]);
};

(async () => {
  await run();
})();
