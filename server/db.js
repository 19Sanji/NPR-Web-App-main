const mysql = require("mysql2");

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "db_test",
//   port: "3306",
// });

const connection = mysql.createConnection({
  host: "176.57.215.24",
  user: "db_test_admin",
  password: "Montekristo19ru19_",
  database: "db_test",
  port: "3306",
});

console.log("БД успешно подключена");

module.exports = connection;
