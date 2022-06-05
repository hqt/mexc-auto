const puppeteer = require('puppeteer');
const fs = require('fs');
const notifier = require('node-notifier');

class Coin {
  constructor(name, changed) {
    this.name = name;
    this.changed = changed;
  }
}

async function serializeCookies(page) {
  const cookies = await page.cookies()
    console.info("cookies are ", cookies);

    fs.writeFile('session.json', JSON.stringify(cookies, null, 2), function(err) {
        if (err) throw err;
        console.log('completed write of cookies');
    });
}

async function deserializeCookies(page) {
  const cookiesString = fs.readFileSync('./session.json', 'utf8');
  console.log("cookiesString are ", cookiesString);
  const cookies = JSON.parse(cookiesString);
  console.log("cookies are ", cookies);
  await page.setCookie.apply(page, cookies);
}

async function run () {
  console.log("call app.js");
  // const wsChromeEndpointurl = 'ws://127.0.0.1:9222/devtools/browser/92c69ac'; 
  // const browser = await puppeteer.connect({
  //   browserWSEndpoint: wsChromeEndpointurl,
  // });

  const browser = await puppeteer.launch({headless: false,
    userDataDir: 'puppeteer_data',
    defaultViewport: null,
  });

  
  const page = await browser.newPage();
  page.waitFor(1000);

  await deserializeCookies(page);
  //await serializeCookies(page);

  await page.goto("https://futures.mexc.com/exchange",  {waitUntil: 'networkidle2'});

  // open popup
  const popup = await page.$(".pages-contract-contractdetail-contractdetail-contractName");
  await popup.hover();

  // sort
  await page.waitForSelector(".pages-contract-pairs-pairList .pages-contract-pairs-col3");
  const sort = await page.$(".pages-contract-pairs-pairList .pages-contract-pairs-col3");
  await sort.click();
  page.waitFor(500);
  await sort.click();
  page.waitFor(500);

  // get data
  await page.waitForSelector(".pages-contract-pairs-symbolInfo");
  
  const names = await page.$$eval(".pages-contract-pairs-symbolInfo .pages-contract-pairs-col1", elements=> elements.map(item=>item.textContent));
  const prices = await page.$$eval(".pages-contract-pairs-symbolInfo .pages-contract-pairs-col3", elements=> elements.map(item=>item.textContent));
  console.log("total items: " + names.length);

  let coins = [];
  for (let i = 0; i < names.length; i++) {
    let txt = prices[i];
    let price = Number(txt.substring(1, txt.length-1));
    coins.push(new Coin(names[i], price));
  }
  console.log(coins);
  
  let msg = `${coins[0].name} increased ${coins[0].changed}%`;
  notifier.notify({
    title: 'Price Alert',
    message: msg,
    sound: true,
    wait: true
  });

  await page.screenshot({path: 'screenshot.png'});
  await browser.close();
}

// run();

module.exports = {
  run
};
