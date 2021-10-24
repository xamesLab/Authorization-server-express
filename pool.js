const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  password: "331707",
  host: "localhost",
  port: "5432",
  database: "testAuth",
});

module.exports = pool;
