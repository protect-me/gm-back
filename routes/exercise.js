var express = require('express');
var router = express.Router();
var mysqlConnection = require('../utils/mysqlConnection');
var connection = mysqlConnection.getConnection()
const { v4: uuidv4 } = require('uuid') // uuid


router.get('/', async (req, res) => {
  try {
    connection.query('SELECT * FROM exercise', function (err, rows) {
      if (err) throw err;
      res.json({
        success: true,
        rows: rows,
        message: 'μ‘°ν μ±κ³΅ π§π»ββοΈ'
      })
    })
  } catch (err) {
    res.json({
      success: false,
      message: 'μ‘°ν μ€ν¨ π§π»ββοΈ'
    })
  }
});

router.post('/regist', async (req, res) => {
  const exercise = {
    'userId': req.body.form.userId,
    'userUuid': req.body.form.userUuid,
    'name': req.body.form.name,
    'category': req.body.form.category,
    'target': req.body.form.target,
    'note': req.body.form.note,
    'admin': req.body.form.admin
  };
  exercise.exerciseUuid = uuidv4()

  try {
    connection.query(
      `INSERT INTO exercise (exerciseUuid,userUuid,name,category,target,note,admin) 
        VALUES ('${exercise.exerciseUuid}', '${exercise.userUuid}', '${exercise.name}', '${exercise.category}',
         '${exercise.target}', '${exercise.note}', ${exercise.admin})`,
      exercise, function (err, row) {
        console.log(row);
        if (err) throw err;
        res.json({
          success: true,
          exerciseUuid: exercise.exerciseUuid,
          message: 'Regist Success :)'
        })
      }
    )
  } catch (err) {
    res.json({
      success: false,
      message: 'Regist Failed :('
    })
  }
});

router.post('/edit', async (req, res) => {
  const exercise = {
    'userId': req.body.form.userId,
    'exerciseUuid': req.body.form.exerciseUuid,
    'name': req.body.form.name,
    'category': req.body.form.category,
    'target': req.body.form.target,
    'note': req.body.form.note,
  };

  if (exercise.userId != "admin") {
    res.json({
      success: false,
      message: 'κΆνμ΄ μμ΅λλ€ π§π»ββοΈ'
    })
  } else {
    try {
      connection.query(`SELECT exerciseUuid FROM exercise WHERE exerciseUuid = '${exercise.exerciseUuid}'`, function (err, row) {
        if (err) throw err;
        if (row[0] != undefined) { // ν΄λΉνλ exerciseκ° μμ κ²½μ°,
          connection.query(
            `UPDATE exercise SET
            name='${exercise.name}', 
            category='${exercise.category}', 
            target='${exercise.target}', 
            note='${exercise.note}'
          WHERE exerciseUuid = '${exercise.exerciseUuid}'
          `, function (err, row2) {
            if (err) throw err;
          });
          res.json({
            success: true,
            message: 'Edit Success! π§π»ββοΈ'
          })
        } else { // ν΄λΉνλ exerciseκ° μμ κ²½μ°,
          res.json({
            success: false,
            message: 'ν΄λΉνλ Exerciseκ° μμ΅λλ€ π§π»ββοΈ'
          })
        }
      });
    } catch (err) {
      res.json({
        success: false,
        message: 'Edit Failed :('
      })
    }
  }
});


router.delete('/delete/:exerciseUuid', async (req, res) => {
  const exerciseUuid = req.params.exerciseUuid
  // console.log(exerciseUuid);
  try {
    connection.query(
      `DELETE FROM exercise WHERE exerciseUuid = '${exerciseUuid}'`, function (err, row) {
        if (err) throw err;
        res.json({
          success: true,
          message: 'μ­μ  μ±κ³΅ π§π»ββοΈ'
        })
      })
  } catch (err) {
    res.json({
      success: false,
      message: 'μ­μ  μ€ν¨ π§π»ββοΈ'
    })
  }
})

module.exports = router;