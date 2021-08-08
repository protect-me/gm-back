var express = require('express');
var router = express.Router();
var mysqlConnection = require('../utils/mysqlConnection');
var connection = mysqlConnection.getConnection()
const { v4: uuidv4 } = require('uuid') // uuid

function registRecordsMeta(req, res, next) {
  const recordsGroupUuid = uuidv4() // 함께 Insert되는 routine을 한 그룹으로 묶음
  const newRoutine = req.body.reqData.newRoutine
  const startTime = req.body.reqData.startTime
  const endTime = req.body.reqData.endTime
  req.body.recordsGroupUuid = recordsGroupUuid
  newRoutine.forEach(item => {
    item.push(uuidv4(), recordsGroupUuid) // 개별 routine은 고유하게 세팅 / group은 동일하게 세팅
  })
  const query = `
    INSERT INTO recordsMeta (startTime, endTime, recordsGroupUuid) 
    VALUES ('${startTime}', '${endTime}', '${recordsGroupUuid}')`
  try {
    connection.query(query, function (err, row) {
      if (err) {
        res.json({
          success: false,
          message: 'Records Meta Regist Failed(1) :(' + err
        })
      } else {
        next();
      }
    })
  } catch (err) {
    res.json({
      success: false,
      message: 'Records Meta Regist Failed(2) :(' + err
    })
  }
}

router.post('/regist', registRecordsMeta, function (req, res) {
  const newRoutine = req.body.reqData.newRoutine
  const query = `INSERT INTO records
      (routineGroupName, userUuid, exerciseUuid, countOfExercise, countOfSet, plusWeight, minusWeight, lap, timeMin, timeSec, recordsUuid, recordsGroupUuid)
    values ?; `;
  try {
    connection.query(query, [newRoutine], (err, row) => {
      if (err) {
        res.json({
          success: false,
          message: 'Records Regist Failed :(' + err
        })
      } else {
        res.json({
          success: true,
          message: 'Records Regist Success :)'
        })
      }
    });
  } catch (err) {
    res.json({
      success: false,
      message: 'Records Regist Failed :(' + err
    })
  }
});


// update
// routineUuid로 뒤져서 기존에 있던거 다 삭제해줘야겠네.

module.exports = router;

