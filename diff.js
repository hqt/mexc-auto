// const binance = "https://api.binance.com/api/v3/exchangeInfo";
const binance = "https://www.binance.com/dapi/v1/ticker/24hr";
const mexc = "https://futures.mexc.com/api/v1/contract/ticker";

class Coin {
    constructor(name, mexc, binance) {
      this.name = name;
      this.binance = binance;
      this.mexc = mexc;
    }
  }

async function run() {
    let dict = {};

    await fetch(mexc)
    .then(res => res.json())
    .then(response => {
      let data = response['data'];
      for (let item of data) {
        // AAVE_USDT
        let symbol = item['symbol'];
        let token = symbol.substring(0, symbol.indexOf('_')); 
        let price = item['lastPrice'];
        let coin = new Coin(token, price, 0);
        dict[token] = coin;
      }

      // console.log(dict);

    });

    await fetch(binance)
    .then(res => res.json())
    .then(response => {

      for (let item of response) {
        // BCHUSD_220624k
        let symbol = item['symbol'];
        let token = symbol.substring(0, symbol.indexOf('_')); 
        token = token.substring(0, token.length-3);
        let price = item['lastPrice'];
        
        if (token in dict) {
            let coin = dict[token];
            coin.binance = Number(price);
            dict[token] = coin;
        } else {
            console.log(`coin ${token} is not available on mexc`);
        }
      }

      // console.log(dict);
    });

    res = [];
    for (key in dict) {
        let token = dict[key];
        if (token.binance == 0) {
            console.log(`coin ${token.name} is not available on binance`);
        } else {
            token.diff = Math.abs(token.binance - token.mexc)/token.binance * 100;
            res.push(token);
        }
    }

    res.sort(function(a, b){return a.diff-b.diff});
    console.log(res);
}

run();