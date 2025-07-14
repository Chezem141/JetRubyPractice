const { Pool } = require("pg");
const pool = new Pool({
  user: "dev_user",
  host: "127.0.0.1",
  database: "github_trends",
  password: "1234",
  port: 5432,
});

module.exports = pool;
