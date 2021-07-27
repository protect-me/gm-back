var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
var mysqlConnection = require('../utils/mysqlConnection');
var connection = mysqlConnection.getConnection()

router.get('/', async (req, res) => {
  try {
    connection.query('SELECT * FROM exercise', function (err, rows) {
      if (err) throw err;
      res.send(rows);
    });
  } catch (err) {
    alert(err);
    console.log(err);
  }
});

module.exports = router;