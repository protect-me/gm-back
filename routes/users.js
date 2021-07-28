var express = require('express');
var router = express.Router();
// Encryption
const bcrypt = require('bcryptjs'); // password
// mysql
var mysqlConnection = require('../utils/mysqlConnection');
var connection = mysqlConnection.getConnection()

router.get('/', function (req, res) {
  connection.query('SELECT * FROM users', function (err, rows) {
    if (err) throw err;
    res.send(rows);
  });
});

router.post('/signUp', function (req, res) {
  const user = {
    'userId': req.body.form.userId,
    'password': req.body.form.password,
  };

  connection.query(`SELECT userId FROM users WHERE userId = '${user.userId}'`, function (err, row) {
    if (err) throw err;
    if (row[0] == undefined) { //  동일한 아이디가 없을 경우,
      const salt = bcrypt.genSaltSync();
      const encryptedPassword = bcrypt.hashSync(user.password, salt);
      connection.query(
        `INSERT INTO users (userUuid, userId, password) 
          VALUES (uuid(), '${user.userId}', '${encryptedPassword}')
        `, function (err, row2) {
        if (err) throw err;
      });
      res.json({
        success: true,
        message: 'Sign Up Success! 🧙🏻‍♂️'
      })
    }
    else {
      res.json({
        success: false,
        message: 'Sign Up Failed. Please use anoter ID 🧙🏻‍♂️'
      })
    }
  });
});

router.post('/login', function (req, res) {
  const user = {
    'userId': req.body.form.userId,
    'password': req.body.form.password
  };
  connection.query(`SELECT userUuid, userId, password FROM users WHERE userId = '${user.userId}'`,
    function (err, row) {
      if (err) throw err;
      if (row[0] == undefined) {
        res.json({ // 매칭되는 아이디가 없을 경우
          success: false,
          message: 'Login Failed, 아이디를 확인해주세요 🧙🏻‍♂️'
        })
      }
      if (row[0] !== undefined && row[0].userId === user.userId) {
        bcrypt.compare(user.password, row[0].password, function (err, res2) {
          if (err) throw err;
          if (res2) {
            res.json({ // 로그인 성공 
              success: true,
              userUuid: row[0].userUuid,
              message: 'Login Successful! 🧙🏻‍♂️'
            })
          }
          else {
            res.json({ // 매칭되는 아이디는 있으나, 비밀번호가 틀린 경우
              success: false,
              message: 'Login Failed, 비밀번호를 확인해주세요 🧙🏻‍♂️'
            })
          }
        })
      }
    })
});

module.exports = router;