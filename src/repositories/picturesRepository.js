class PictureRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async create(picture) {
    console.log(picture);
    const { filepath, size, user_id, event_id } = picture;

    const query = 'INSERT INTO pictures (filepath, size, user_id, event_id) VALUES (?, ?, ?, ?)';
    const values = [filepath, size, user_id, event_id];

    const result = await this.connection.execute(query, values);
  }

  async findById(id) {
    const query = 'SELECT * FROM pictures WHERE id = ?';
    const [rows] = await this.connection.execute(query, [id]);
    return rows[0];
  }

  async findByUserId(userId) {
    const query = 'SELECT * FROM pictures WHERE user_id = ?';
    const [rows] = await this.connection.promise().execute(query, [userId]);
    return rows;
  }

  async findByEventId(eventId) {
    const query = 'SELECT * FROM pictures WHERE event_id = ?';
    const [rows] = await this.connection.promise().execute(query, [eventId]);
    return rows;
  }

  async deleteById(id) {
    const query = 'DELETE FROM pictures WHERE id = ?';
    const [result] = await this.connection.promise().execute(query, [id]);
    return result.affectedRows > 0;
  }
}
module.exports = PictureRepository;