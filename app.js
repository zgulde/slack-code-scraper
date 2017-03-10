const bot = require('./src/createBot');
const dbc = require('./src/dbc');
const { shouldIgnoreEvent, containsCode, save } = require('./src/eventUtils.js');
const { getMySQLTimestamp } = require('./src/util');

bot.on('start', () => {
  console.log(`${getMySQLTimestamp()} - Bot started!`);
});

bot.on('message', event => {
  if (shouldIgnoreEvent(event)) {
    return;
  } else if (containsCode(event)) {
    save(event, id => {
      console.log(`${getMySQLTimestamp()} - inserted code sample # ${id}!`);
    });
  }
});

/**
 * mysql will close a connection if it is not active for a certain amount of
 * time (8 hours by default), this would kill our application, so we will
 * ping the server every so often to keep the connection up and healthy
 **/
const PING_TIME = ( // every hour
  1000 * // ms -> seconds
  60 *   // seconds -> minutes
  60     // minutes -> hours
);
setInterval(() => {
  dbc.ping(err => {
    if (err) throw err;
    console.log(`${getMySQLTimestamp()} - mysql server responded to ping`);
  });
}, PING_TIME);

