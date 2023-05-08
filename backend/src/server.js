const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./src/db/database.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err);
});

const app = express();
const port = 3004;

app.use(cors({
  origin: '*'
}));

app.use(bodyParser.json());

db.serialize(() => {
// izveido Ideas tabulu
  db.run(`
    CREATE TABLE IF NOT EXISTS quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      score REAL,
      date TEXT
    );
  `);
})

// Add middleware to parse JSON requests
app.use(express.json());

app.get('/quiz-results', (req, res) => {
  db.all('SELECT * FROM quiz_results', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch quiz results' });
    } else {
      res.json(rows);
    }
  });
});

// API endpoint to add quiz results
app.post('/quiz-results', (req, res) => {
  const { username, score, date } = req.body;

  console.log('Received request body:', req.body);

  db.run(
    'INSERT INTO quiz_results (username, score, date) VALUES (?, ?, ?)',
    [username, score, date],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add quiz results' });
      } else {
        res.status(201).json({ message: 'Quiz results added successfully' });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})