const bot = require('./createBot.js');

const instructorNames = [
  'zach',
  'fernando',
  'montealegreluis',
  'ryanorsinger',
  'jreich5'
];

bot.on('start', () => {
  bot.getUsers().then(users => {
    let ids = users.members
      .filter(user => instructorNames.includes(user.name))
      .map(user => ({[user.id]: user.name}));
    console.log(Object.assign(...ids));
    process.exit(0);
  });
});

