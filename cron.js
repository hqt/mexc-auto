const config = require('config');
const cron = require('node-cron');
const app = require('./app.js');


app.run();

// let pattern = '*/15 * * * * *' // every 15 seconds
// let pattern = '*/15 * * * *'      // every 15 minutes

let pattern = config.get('time_pattern');

let task = cron.schedule(pattern, async () => {
  console.log(`running the scheduled task ${new Date()}`);
  await app.run();
});

task.start();

