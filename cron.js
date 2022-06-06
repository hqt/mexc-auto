const cron = require('node-cron');
const app = require('./app.js');


app.run();

// let pattern = '*/15 * * * * *' // every 15 seconds
let pattern = '*/15 * * * *'      // every 15 minutes

let task = cron.schedule(pattern, async () => {
  console.log('running the scheduled task');
  await app.run();
});

task.start();

