const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "db4free.net",
  user: "smechkov",
  password: "smechkovAdmin",
  database: "smechkovdb",
});

module.exports = connection;
