const puppeteer = require('puppeteer');
const fs = require('fs');
const launchConfig = {
    headless: false
};
exports.launch = async () => {
    const browser = await puppeteer.launch(launchConfig);
    const wsEPAddress = await browser.wsEndpoint();
    const w_data = new Buffer(wsEPAddress);
    await fs.writeFile(__dirname + '/wsa.txt', w_data, {flag: 'w+'}, function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log('写入成功');
        }
    });
}
