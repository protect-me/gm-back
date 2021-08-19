var mysql = require('mysql');
require("dotenv").config();


exports.getConnection = () => {
  // Connection 객체 생성
  var connection = mysql.createConnection({
    host: process.env.host,
    port: process.env.port,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
  });
  // Connect
  connection.connect(function (err) {
    if (err) {
      console.error('mysql connection error');
      console.error(err);
      throw err;
    }
  });
  return connection
}