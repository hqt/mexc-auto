const notifier = require('node-notifier');

class Coin {
  constructor(symbol, price, changed) {
    this.symbol = symbol;
    this.price = price;
    this.changed = changed;
  }
}

function run() {
  fetch('https://futures.mexc.com/api/v1/contract/ticker')
  .then(res => res.json())
  .then(response => {
    let data = response['data'];
    
    let coins = [];
    for (let item of data) {
      let symbol = item['symbol'];
      let price = item['lastPrice'];
      let rate = (item['riseFallRate']*100).toFixed(3);;
      coins.push(new Coin(symbol, price, rate));
    }
    
    coins.sort(function(a, b){
      return b.changed-a.changed
    });

    console.log(coins.slice(0, 15));
    console.log("----------------");
    console.log(coins.slice(coins.length-15, coins.length));

    let msg = `${coins[0].symbol} increased ${coins[0].changed}% \nPrice: ${coins[0].price}`;
    notifier.notify(
      {
      title: 'Price Alert',
      message: msg,
      sound: true,
      wait: true
      },
      function (err, response, metadata) {
        // console.log(err + "--" + response + "--" + metadata);
        // Response is response from notification
        // Metadata contains activationType, activationAt, deliveredAt
      }
    );
  });
}

module.exports = {
  run
};
