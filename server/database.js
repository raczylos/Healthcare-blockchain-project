const mysql = require('mysql');

// Connect to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'myuser',
  password: 'mypassword',
  database: 'mydatabase'
});

// Store the password in the database
exports.storePassword = function (hashedPassword) {
  const sql = 'INSERT INTO users (password) VALUES (?)';
  const values = [hashedPassword];
  connection.query(sql, values, function (error, results, fields) {
    if (error) throw error;
  });
}