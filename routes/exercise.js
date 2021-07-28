var express = require('express');
var router = express.Router();
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

router.post('/regist', async (req, res) => {
  const exercise = {
    'name': req.body.form.name,
    'category': req.body.form.category,
    'target': req.body.form.target,
    'note': req.body.form.note,
  };

  try {
    connection.query(
      `INSERT INTO exercise (exerciseUuid,name,category,target,note) 
        VALUES (uuid(), '${exercise.name}', '${exercise.category}', '${exercise.target}', '${exercise.note}')`,
      exercise, function (err, row) {
        if (err) throw err;
      }
    )
    res.json({
      success: true,
      message: 'Regist Success :)'
    })
  } catch (err) {
    res.json({
      success: false,
      message: 'Regist Failed :('
    })
  }
});

module.exports = router;