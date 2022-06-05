const cron = require('node-cron');
const app = require('./app.js');


// app.run();

let task = cron.schedule('*/15 * * * * *', async () => {
  console.log('running the scheduled task');
  await app.run();
});

task.start();

