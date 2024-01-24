const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const moment = require('moment');

const dbConfig = {
  host: 'sql6.freesqldatabase.com',
  user: 'sql6679456',
  password: '4RgDQaZzwL',
  database: 'sql6679456',
};

// Display current week leaderboard (Top 200)
router.get('/leaderboard/currentWeek', async (req, res) => {
  const startOfWeek = moment().startOf('week').format('YYYY-MM-DD');
  const endOfWeek = moment().endOf('week').format('YYYY-MM-DD');

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      `SELECT * FROM sql6679456.MYSQL
       WHERE TimeStamp BETWEEN ? AND ?
       ORDER BY Score DESC
       LIMIT 200`,
      [startOfWeek, endOfWeek]
    );

    connection.end();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Display last week leaderboard given a country by the user (Top 200)
router.get('/leaderboard/lastWeek/:country', async (req, res) => {
  const startOfLastWeek = moment().subtract(1, 'week').startOf('week').format('YYYY-MM-DD');
  const endOfLastWeek = moment().subtract(1, 'week').endOf('week').format('YYYY-MM-DD');
  const country = req.params.country;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      `SELECT * FROM sql6679456.MYSQL
       WHERE TimeStamp BETWEEN ? AND ? AND Country = ?
       ORDER BY Score DESC
       LIMIT 200`,
      [startOfLastWeek, endOfLastWeek, country]
    );

    connection.end();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch user rank, given the userId
router.get('/userRank/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      `SELECT ID, Score, FIND_IN_SET(Score, (SELECT GROUP_CONCAT(Score ORDER BY Score DESC) FROM sql6679456.MYSQL)) AS Rank
       FROM sql6679456.MYSQL
       WHERE UID = ?`,
      [userId]
    );

    connection.end();
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
