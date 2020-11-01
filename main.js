const puppeteer = require('puppeteer');
const proxyChain = require('proxy-chain');
// const devices = require('puppeteer/DeviceDescriptors')  //引入手机设备ua 设置
let browser;
(async () => {
    // change username & password
    // const oldProxyUrl = 'http://192.168.3.3:1080';
    // const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);

    browser = await puppeteer.launch({
        headless: false,
        // slowMo: 250, // slow down by 250ms
        devtools: true,
        // defaultViewport: {
        //     isMobile: true,
        //     // width: 1280,
        //     // height: 760
        // },
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--start-maximized',
            '--allow-running-insecure-content',
            '--disable-web-security',
            '--auto-open-devtools-for-tabs',
            // `--proxy-server=${newProxyUrl}`,
            // `--proxy-server=http://localhost:1080`,
        ]
    });
    const page = await browser.newPage();
    // await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1')
    // await page.emulate(devices['iPhone X'])
    await page.setViewport({
        width: 360,
        height: 640
    });
    await page.goto('https://www.ebay.com/');
    await page.waitFor('.gh-header-item__profile');
    await page.waitFor(1000);
    await (await page.$('.gh-header-item__profile')).click();

})();

let isFree = false;
let mainFunc = async () => {
    if (isFree) return;
    console.log("ok")
    isFree = true;

    if (!browser) return;
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1')
    // await page.emulate(devices['iPhone X'])
    await page.setViewport({
        width: 360,
        height: 640
    });
    await page.goto('https://www.ebay.com/');

    // await browser.close();
    // isFree = false;
};
// setInterval(mainFunc, 1000);