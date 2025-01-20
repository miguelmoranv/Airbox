const mysql = require("mysql2/promise");
const config = require("./config");

const pool = mysql.createPool({
  ...config,
  connectionLimit: 20,
});

const Connect = async () => {
  const connect = await pool.getConnection();
  return connect;
};

module.exports = {Connect};