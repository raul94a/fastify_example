const mysql = require('mysql2/promise');
const pool = mysql.createPool(
    {
      user: 'fastify',
      port: 3306,
      host: '____________',
      database: 'FASTIFY_TEST',
      password: '_________________',
      connectionLimit: 100,
    }
  );


module.exports = pool;
