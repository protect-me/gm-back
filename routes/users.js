var express = require('express');
var router = express.Router();
// Encryption
const bcrypt = require('bcryptjs'); // password
const { v4: uuidv4 } = require('uuid') // uuid
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
    'id': req.body.form.id,
    'password': req.body.form.password,
  };
  user.uuid = uuidv4()

  connection.query(`SELECT id FROM users WHERE id = '${user.id}'`, function (err, row) {
    if (err) throw err;
    if (row[0] == undefined) { //  동일한 아이디가 없을 경우,
      const salt = bcrypt.genSaltSync();
      const encryptedPassword = bcrypt.hashSync(user.password, salt);
      connection.query(
        `INSERT INTO users (uuid, id, password) 
          VALUES ('${user.uuid}', '${user.id}', '${encryptedPassword}')
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
    'id': req.body.form.id,
    'password': req.body.form.password
  };
  connection.query(`SELECT id, password FROM users WHERE id = '${user.id}'`,
    function (err, row) {
      if (err) throw err;
      if (row[0] == undefined) {
        res.json({ // 매칭되는 아이디가 없을 경우
          success: false,
          message: 'Login Failed, 아이디를 확인해주세요 🧙🏻‍♂️'
        })
      }
      if (row[0] !== undefined && row[0].id === user.id) {
        bcrypt.compare(user.password, row[0].password, function (err, res2) {
          if (err) throw err;
          if (res2) {
            res.json({ // 로그인 성공 
              success: true,
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