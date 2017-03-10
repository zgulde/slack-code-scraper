/*globals describe test expect*/

const { getMySQLTimestamp } = require('../util.js');

describe.only('general utility functions', () => {

  describe('getMySQLTimestamp', () => {

    test('returns the current time formatted for MySQL', () => {
      const dateRe = /\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/;
      const timestamp = getMySQLTimestamp();

      expect(timestamp).toMatch(dateRe);
    });

  });

});
