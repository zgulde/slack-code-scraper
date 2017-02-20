const dbc = require('./dbc');

module.exports = {
  run: (cb) => {
    dbc.query('TRUNCATE code_samples', cb);
  }
};
