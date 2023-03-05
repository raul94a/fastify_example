const mysql = require('mysql2/promise');
const pool = mysql.createPool(
    {
      user: 'fastify',
      port: 3306,
      host: '172.24.77.48',
      database: 'FASTIFY_TEST',
      password: '26052027L',
      connectionLimit: 100,
    }
  );


module.exports = pool;