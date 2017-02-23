const { readFilesToken } = require('./.env');
const request = require('request');

module.exports = {
  getFile: url => {
    const headers = { 'Authorization': `Bearer ${readFilesToken}` };
    return new Promise((resolve, reject) => {
      request({url, headers}, (err, response, body) => {
        if (err) { reject(err); }
        resolve(body);
      });
    });
  },
};
