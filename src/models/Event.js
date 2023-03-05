
// Define the Event model
class Event {
    static async getAll(fastify) {
      const conn = await fastify.mysql.getConnection();
      const [rows] = await conn.execute('SELECT * FROM events');
      conn.release();
      return rows;
    }
  
    static async getById(fastify, id) {
      const conn = await fastify.mysql.getConnection();

    }

}