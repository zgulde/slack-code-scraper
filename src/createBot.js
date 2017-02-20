const { token } = require('./.env.js');
const SlackBot = require('slackbots');

module.exports = new SlackBot({
  token,
  name: 'Code Sample Scraper Bot'
});
