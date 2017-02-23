/*globals describe test expect*/

const { getFile } = require('../fileUtils');

describe('getFile', () => {
  test('gets a file from the slack api', done => {
    // "url_private_download": "https://files.slack.com/files-pri/T029BRGN0-F49HN8ULX/download/-.js",
    let url = 'https://files.slack.com/files-pri/T029BRGN0-F49HN8ULX/download/-.js';
    getFile(url).then(body => {
      expect(body.trim()).toBe('hey there');
      done();
    }).catch(err => {
      console.log(err);
    });
  });
});
