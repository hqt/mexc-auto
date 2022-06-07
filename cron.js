const config = require('config');
const cron = require('node-cron');
const app = require('./app.js');
const api = require('./api.js');


api.run();

let pattern = config.get('time_pattern');

let task = cron.schedule(pattern, async () => {
  console.log(`running the scheduled task ${new Date()}`);
  await api.run();
});

task.start();

