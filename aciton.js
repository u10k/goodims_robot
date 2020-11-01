const brow = require('./lib/brow');
// const puppeteer = require('puppeteer');
async function run() {
    const b = await brow.browser();
    const page = await b.newPage();
    // todo 你的脚本内容
    await page.goto('https://www.ebay.com/');
    // await page.waitFor('.saved');
    // await page.waitFor(1000);
    // await (await page.$('.saved')).click();
}

(async () => {
    // console.log(puppeteer.devices)
    await run();
})()
exports.run = run;

