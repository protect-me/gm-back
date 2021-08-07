var express = require('express');
var router = express.Router();
var mysqlConnection = require('../utils/mysqlConnection');
var connection = mysqlConnection.getConnection()
const { v4: uuidv4 } = require('uuid') // uuid


router.get('/:userUuid', async (req, res) => {
  const userUuid = req.params.userUuid;
  try {
    connection.query(
      // `SELECT * FROM routine WHERE userUuid = '${userUuid}'
      // ORDER BY createdAt DESC, routineGroupUuid ASC, countOfExercise ASC, countOfSet ASC`
      `SELECT 
      a.routineUuid, a.routineGroupName, a.routineGroupUuid, a.userUuid, a.exerciseUuid, 
      a.countOfExercise, a.countOfSet, a.plusWeight, a.minusWeight, a.lap, a.timeMin, a.timeSec,
      b.name, b.category, b.target, b.note
      FROM routine AS a
      LEFT JOIN exercise AS b
      ON a.exerciseUuid = b.exerciseUuid
      WHERE a.userUuid = '${userUuid}'
      ORDER BY 
      a.createdAt DESC, a.routineGroupUuid ASC, a.countOfExercise ASC, a.countOfSet ASC`
      , function (err, rows) {
        if (err) throw err;
        res.json({
          success: true,
          rows: rows,
          message: '조회 성공 🧙🏻‍♂️'
        })
      })
  } catch (err) {
    res.json({
      success: false,
      message: '조회 실패 🧙🏻‍♂️'
    })
  }
});

router.post('/regist', function (req, res) {
  const routineGroupUuid = uuidv4() // 함께 Insert되는 routine을 한 그룹으로 묶음
  const newRoutine = req.body.newRoutine
  newRoutine.forEach(item => {
    item.push(uuidv4(), routineGroupUuid) // 개별 routine line은 고유하게 세팅
  })
  const query = `INSERT INTO routine
      (routineGroupName, userUuid, exerciseUuid, countOfExercise, countOfSet, plusWeight, minusWeight, lap, timeMin, timeSec, routineUuid, routineGroupUuid)
    values ?; `;
  try {
    connection.query(query, [newRoutine], (err, row) => {
      if (err) {
        res.json({
          success: false,
          message: 'Regist Failed :(' + err
        })
      } else {
        res.json({
          success: true,
          message: 'Regist Success :)'
        })
      }
    });
  } catch (err) {
    res.json({
      success: false,
      message: 'Regist Failed :(' + err
    })
  }
});


// update
// routineUuid로 뒤져서 기존에 있던거 다 삭제해줘야겠네.

module.exports = router;

