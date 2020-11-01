const brow = require('./lib/brow');
const randomUseragent = require('random-useragent');
let page = null
let btn_position = null
let times = 3 // 执行重新滑动的次数
const distanceError = [-5, -2, 3, 5] // 距离误差

let timeout = function (delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(1)
            } catch (e) {
                reject(0)
            }
        }, delay);
    })
}


/**
 * 计算按钮需要滑动的距离
 * */
async function calculateDistance() {
    const distance = await page.evaluate(() => {

        // 比较像素,找到缺口的大概位置
        function compare(document) {
            const ctx1 = document.querySelector('.geetest_canvas_fullbg'); // 完成图片
            const ctx2 = document.querySelector('.geetest_canvas_bg');  // 带缺口图片
            const pixelDifference = 30; // 像素差
            let res = []; // 保存像素差较大的x坐标

            // 对比像素
            for (let i = 57; i < 260; i++) {
                for (let j = 1; j < 160; j++) {
                    const imgData1 = ctx1.getContext("2d").getImageData(1 * i, 1 * j, 1, 1)
                    const imgData2 = ctx2.getContext("2d").getImageData(1 * i, 1 * j, 1, 1)
                    const data1 = imgData1.data;
                    const data2 = imgData2.data;
                    const res1 = Math.abs(data1[0] - data2[0]);
                    const res2 = Math.abs(data1[1] - data2[1]);
                    const res3 = Math.abs(data1[2] - data2[2]);
                    if (!(res1 < pixelDifference && res2 < pixelDifference && res3 < pixelDifference)) {
                        if (!res.includes(i)) {
                            res.push(i);
                        }
                    }
                }
            }
            // 返回像素差最大值跟最小值，经过调试最小值往左小7像素，最大值往左54像素
            return {min: res[0] - 7, max: res[res.length - 1] - 54}
        }

        return compare(document)
    })
    console.log(distance);
    return distance;
}

/**
 * 计算滑块位置
 */
async function getBtnPosition() {
    await page.waitForSelector('.geetest_slider_button');
    const btn_position = await page.evaluate(() => {
        const btn = document.querySelector('.geetest_slider_button');
        const {clientWidth, clientHeight} = btn;
        const left = btn.getBoundingClientRect().left;
        const top = btn.getBoundingClientRect().top;
        const p = {btn_left: clientWidth / 2 + left, btn_top: clientHeight / 2 + top}
        console.log(p);
        return p;
    })
    return btn_position;
}

/**
 * 尝试滑动按钮
 * @param distance 滑动距离
 * */
async function tryValidation(distance) {
    //将距离拆分成两段，模拟正常人的行为
    const distance1 = distance - 10
    const distance2 = 10

    page.mouse.click(btn_position.btn_left, btn_position.btn_top, {delay: 2000})
    page.mouse.down(btn_position.btn_left, btn_position.btn_top)
    page.mouse.move(btn_position.btn_left + distance1, btn_position.btn_top, {steps: 30})
    await timeout(800);
    page.mouse.move(btn_position.btn_left + distance1 + distance2, btn_position.btn_top, {steps: 20})
    await timeout(800);
    page.mouse.up()
    await timeout(4000);

    // 判断是否验证成功
    const isSuccess = await page.evaluate(() => {
        return document.querySelector('.geetest_success_radar_tip_content') && document.querySelector('.geetest_success_radar_tip_content').innerHTML
    })
    await timeout(1000);
    // 判断是否需要重新计算距离
    const reDistance = await page.evaluate(() => {
        return document.querySelector('.geetest_result_content') && document.querySelector('.geetest_result_content').innerHTML
    })
    await timeout(1000);
    return {isSuccess: isSuccess === '验证成功', reDistance: reDistance.includes('怪物吃了拼图')}
}

/**
 * 拖动滑块
 * @param distance 滑动距离
 * */
async function drag(distance) {
    distance = distance || await calculateDistance();
    const result = await tryValidation(distance.min)
    if (result.isSuccess) {
        await timeout(1000);
        //登录
        console.log('验证成功')
        // page.click('#modal-member-login button')
    } else if (result.reDistance) {
        console.log('重新计算滑距离录，重新滑动')
        times = 0
        await drag(null)
    } else {
        if (distanceError[times]) {
            times++
            console.log('重新滑动')
            await drag({min: distance.max, max: distance.max + distanceError[times]})
        } else {
            console.log('滑动失败')
            times = 0
            await run()
        }
    }
}


async function fuckRobotVerify() {
    try {
        let radar = await page.waitForSelector('.geetest_radar_tip', {timeout: 20000});
        if (radar) {
            await (await page.$('.geetest_radar_tip')).click();
        }

        btn_position = await getBtnPosition();

        // 5.滑动
        await drag(null)
    } catch (e) {
// 没有发现人机验证程序，不做处理
    }
}

async function run() {
    const b = await brow.browser();
    page = await b.newPage();
    // await page.setUserAgent(randomUseragent.getRandom(function (ua) {
    //     return ua.toString().indexOf('Mobile') === -1;
    // }));

    await page.goto('https://www.ebay.com/');

    await page.waitForTimeout(1000);
    await page.waitForSelector('.saved');
    await (await page.$('.saved')).click();

    await page.waitForTimeout(1000);
    try {
        await page.waitForSelector('#userid', {timeout: 3000});
    } catch (e) {
        await fuckRobotVerify();
    }

    await page.waitForTimeout(1000);
    await (await page.$('#userid')).type('ybkk1027@gmail.com');

    await page.waitForTimeout(1000);
    await page.waitForSelector('#signin-continue-btn');
    await (await page.$('#signin-continue-btn')).click();

    await page.waitForTimeout(1000);
    await page.waitForSelector('#pass');
    await (await page.$('#pass')).type('Yinbin.1027');

    await page.waitForTimeout(1000);
    await page.waitForSelector('#sgnBt');
    await (await page.$('#sgnBt')).click();

    await page.waitForTimeout(1000);
    await fuckRobotVerify();

}

(async () => {
    await run();
})()
exports.run = run;

