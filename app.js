const bot = require('./src/createBot.js');
const { shouldIgnoreEvent, containsCode } = require('./src/eventUtils.js');

bot.on('start', () => {
  console.log('Bot started!');
});

bot.on('message', event => {
  if (shouldIgnoreEvent(event)) {
    return;
  } else if (containsCode(event)) {
    // save(event);
    console.log('found some code!');
    console.log(event);
  }
});
