const dbc = require('./dbc');

const queries = {
  insert: 'INSERT INTO code_samples(code, author, title) VALUES (?, ?, ?)',
};

module.exports = {
  insert: (code, author, title, cb) => {
    dbc.query(queries.insert, [code, author, title], (err, results) => {
      if (err) {
        console.log('error in insert!');
        throw err;
      }
      cb(results.insertId);
    });
  }
};
