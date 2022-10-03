// Import and require mysql2
const mysql = require('mysql2');

// import database details from .env file to avoid putting passwords on github
require('dotenv').config();

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  console.log(`Connected to the movies database.`)
);

// // Query database

// let deletedRow = 2;

// db.query(`DELETE FROM favorite_books WHERE id = ?`, deletedRow, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });

// // Query database
// db.query('SELECT * FROM favorite_books', function (err, results) {
//   console.log(results);
// });

app.get("/api/movies", (req, res) => {
  db.query('SELECT movie_name FROM movies', (err, results) => {
    if (!err) {
      res.json(results);
      console.log("successfully returned movies list")
    } else {
      console.log("ERROR:", err);
      res.send(`ERROR: ${err}`);
    }
  });
});

app.post("/api/movies", (req, res) => {
  db.query('SELECT movie_name FROM movies', (err, results) => {
    if (!err) {
      res.json(results);
      console.log("successfully returned movies list")
    } else {
      console.log("ERROR:", err);
      res.send(`ERROR: ${err}`);
    }
  });
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
