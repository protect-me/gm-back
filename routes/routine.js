var express = require('express');
var router = express.Router();
var mysqlConnection = require('../utils/mysqlConnection');
var connection = mysqlConnection.getConnection()
const { v4: uuidv4 } = require('uuid') // uuid


router.get('/:userUuid', async (req, res) => {
  const userUuid = req.params.userUuid;
  console.log(userUuid);
  res.json({
    success: true,
    message: 'get 🧙🏻‍♂️'
  })
  // const userUuid = req.queryd
  // try {
  //   connection.query(`SELECT * FROM routine WHERE userUuid = ${}`, function (err, rows) {
  //     if (err) throw err;
  //     res.send(rows);
  //   });
  // } catch (err) {
  //   res.json({
  //     success: false,
  //     message: '조회 실패 🧙🏻‍♂️'
  //   })
  // }
});

router.post('/regist', function (req, res) {
  const routineGroupUuid = uuidv4() // 함께 Insert되는 routine을 한 그룹으로 묶음
  const newRoutine = req.body.newRoutine
  newRoutine.forEach(item => {
    item.push(uuidv4(), routineGroupUuid) // 개별 routine line은 고유하게 세팅
  })
  const query = `INSERT INTO routine 
  (userUuid, exerciseUuid, countOfExercise, countOfSet, plusWeight, minusWeight, lap, timeMin, timeSec, routineUuid, routineGroupUuid)
  values ?;`;
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

