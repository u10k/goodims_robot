const puppeteer = require('puppeteer');
const wsa = require('./wsa');

async function browser() {
    const b = await puppeteer.connect({
        browserWSEndpoint: await wsa.getWSAddress()
    });
    return b;
}

module.exports = {browser : browser};