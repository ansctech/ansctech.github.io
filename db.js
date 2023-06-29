const Pool = require("pg").Pool;

// const pool = new Pool({
//   user: "dev001",
//   database: "postgres",
//   host: "commissioner-db.c9xko61pg0xi.ap-south-1.rds.amazonaws.com",
//   port: 5432,
//   username: "dev001",
//   password: "dev001",
// });

const pool = new Pool({
  user: "default",
  database: "verceldb",
  host: "ep-misty-flower-504515.us-east-1.postgres.vercel-storage.com",
  port: 5432,
  username: "default",
  password: "CAN2tyoS5ZVT",
  ssl: {
    sslmode: "require",
  },
});

module.exports = pool;
