# youtube-scraping-puppeteer

example of using [Puppeteer](https://pptr.dev/) Chrome browser automation to scrape youtube content

see [`src/index.js`](src/index.js)

## Running

```sh
# install
npm install

# run
npm start

# output is stored as a json file for each channel in the `data/` directory
# create csv from json using `jq`
cat data/AmazonWebServices-channel-videos.json | jq -r '.[] | [.title, .url] | @csv' > data/AmazonWebServices-channel-videos.csv
cat data/AWSwebinars-channel-videos.json | jq -r '.[] | [.title, .url] | @csv' > data/AWSwebinars-channel-videos.csv
```