const Pool = require("pg").Pool;

const pool = new Pool({
  user: "dev001",
  database: "postgres",
  host: "commissioner-db.c9xko61pg0xi.ap-south-1.rds.amazonaws.com",
  port: 5432,
  username: "dev001",
  password: "dev001",
});

module.exports = pool;
