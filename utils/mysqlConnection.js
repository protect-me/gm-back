var mysql = require('mysql');

exports.getConnection = () => {
  // Connection 객체 생성
  var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1008',
    database: 'gain_muscle'
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