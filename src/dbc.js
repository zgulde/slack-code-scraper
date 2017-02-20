const { host, user, password, database } = require('./.env').database[process.env.APP_ENV];
const mysql = require('mysql');

module.exports = mysql.createConnection({
  host,
  user,
  password,
  database
});


