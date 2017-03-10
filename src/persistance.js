const dbc = require('./dbc');
const { getMySQLTimestamp } = require ('./util.js');

const queries = {
  insert: 'INSERT INTO code_samples(code, author, title, created_at) VALUES (?, ?, ?, ?)',
};

module.exports = {
  insert: (code, author, title, cb) => {
    const createdAt = getMySQLTimestamp();
    dbc.query(queries.insert, [code, author, title, createdAt], (err, results) => {
      if (err) {
        console.log('error in insert!');
        throw err;
      }
      cb(results.insertId);
    });
  }
};
