var express = require('express');
var router = express.Router();
var mysqlConnection = require('../utils/mysqlConnection');
var connection = mysqlConnection.getConnection()
const { v4: uuidv4 } = require('uuid') // uuid

// function getTimes(req, res, next) {
//   req.params
// }


router.get('/:userUuid', async (req, res) => {
  const userUuid = req.params.userUuid;
  try {
    connection.query(
      `SELECT 
      a.recordsUuid, a.routineGroupName, a.recordsGroupUuid, a.userUuid, a.exerciseUuid, 
      a.countOfExercise, a.countOfSet, a.plusWeight, a.minusWeight, a.lap, 
      a.timeMin, a.timeSec, a.status,
      b.name, b.category, b.target, b.note, c.startTime, c.endTime
      FROM records AS a
      LEFT JOIN exercise AS b
      ON a.exerciseUuid = b.exerciseUuid
      LEFT JOIN recordsMeta As c
      ON a.recordsGroupUuid = c.recordsGroupUuid
      WHERE a.userUuid = '${userUuid}'
      ORDER BY 
      a.createdAt DESC, a.recordsGroupUuid ASC, a.countOfExercise ASC, a.countOfSet ASC`
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

function registRecordsMeta(req, res, next) {
  const recordsGroupUuid = uuidv4() // 함께 Insert되는 routine을 한 그룹으로 묶음
  const newRoutine = req.body.reqData.newRoutine
  const startTime = req.body.reqData.startTime
  const endTime = req.body.reqData.endTime
  req.body.recordsGroupUuid = recordsGroupUuid
  newRoutine.forEach(item => {
    item.push(uuidv4(), recordsGroupUuid) // 개별 routine은 고유하게 세팅 / group은 동일하게 세팅
  })
  const query = `INSERT INTO recordsMeta (
                  startTime, endTime, recordsGroupUuid
                ) VALUES ('${startTime}', '${endTime}', '${recordsGroupUuid}')`
  try {
    connection.query(query, function (err, row) {
      if (!err) {
        next();
      } else {
        res.json({
          success: false,
          message: 'Records Meta Regist Failed(1) :(' + err
        })
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
  const query = `INSERT INTO records (
                  routineGroupName, userUuid, exerciseUuid, countOfExercise, countOfSet, 
                  plusWeight, minusWeight, lap, timeMin, timeSec, 
                  status, recordsUuid, recordsGroupUuid
                ) values ?;`;
  try {
    connection.query(query, [newRoutine], (err, row) => {
      if (!err) {
        res.json({
          success: true,
          message: 'Records Regist Success :)'
        })
      } else {
        res.json({
          success: false,
          message: 'Records Regist Failed :(' + err
        })
      }
    });
  } catch (err) {
    res.json({
      success: false,
      message: 'Records Regist Failed :(' + err
    })
  }
})

router.delete('/:recordsGroupUuid', function (req, res) {
  const recordsGroupUuid = req.params.recordsGroupUuid;
  const deleteRecordsQuery = `DELETE FROM records WHERE recordsGroupUuid = '${recordsGroupUuid}';`
  const deleteRecordsMetaQuery = `DELETE FROM recordsMeta WHERE recordsGroupUuid = '${recordsGroupUuid}';`
  try {
    connection.query(deleteRecordsQuery + deleteRecordsMetaQuery, (err, row) => {
      if (!err) {
        res.json({
          success: true,
          message: 'Records Delete Success :)'
        })
      } else {
        res.json({
          success: false,
          message: 'Records Delete Failed :(' + err
        })
      }
    });
  } catch (err) {
    res.json({
      success: false,
      message: 'Records Delete Failed :(' + err
    })
  }
})

router.put('/', function (req, res) {
  const recordsGroupUuid = req.body.recordsGroupInfo.recordsGroupUuid;
  const modifiedStartTime = req.body.recordsGroupInfo.modifiedStartTime;
  const modifiedEndTime = req.body.recordsGroupInfo.modifiedEndTime;
  const query = `UPDATE recordsMeta SET 
                startTime='${modifiedStartTime}', endTime='${modifiedEndTime}'
                WHERE recordsGroupUuid='${recordsGroupUuid}';`
  try {
    connection.query(query, (err, row) => {
      if (!err) {
        res.json({
          success: true,
          message: 'Records Regist Success :)'
        })
      } else {
        res.json({
          success: false,
          message: 'Records Delete Failed :(' + err
        })
      }
    });
  } catch (err) {
    res.json({
      success: false,
      message: 'Records Delete Failed :(' + err
    })
  }
})


module.exports = router;

