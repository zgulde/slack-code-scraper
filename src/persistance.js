const dbc = require('./dbc');

const queries = {
  insert: 'INSERT INTO code_samples(code, author) VALUES (?, ?)',
};

module.exports = {
  insert: (code, author, cb) => {
    dbc.query(queries.insert, [code, author], (err, results) => {
      if (err) {
        console.log('error in insert!');
        throw err;
      }
      cb(results.insertId);
    });
  }
};
