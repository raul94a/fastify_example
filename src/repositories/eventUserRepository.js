class EventUserRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async create(eventId, userId) {
    const query = `INSERT INTO user_events (event_id, user_id) VALUES (?, ?)`;
    const values = [eventId, userId];
    const [result] = await this.connection.execute(query, values);
    return result.insertId;
  }

  async delete(eventId, userId) {
    const query = `DELETE FROM user_events WHERE event_id = ? AND user_id = ?`;
    const values = [eventId, userId];
    const [result] = await this.connection.execute(query, values);
    return result.affectedRows > 0;
  }

  async getByEventId(eventId) {
    const query = `
        SELECT
          eu.event_id,
          eu.user_id,
          u.name as user_name,
          u.email as user_email
        FROM
          user_events eu
          JOIN users u ON u.id = eu.user_id
        WHERE
          eu.event_id = ?`;
    const values = [eventId];
    const [rows] = await this.connection.execute(query, values);
    return rows;
  }

  async getByUserId(userId) {
    const query = `
        SELECT
          eu.event_id,
          e.name as event_name,
          e.description as event_description,
          e.place as event_place,
          e.latitude as event_latitude,
          e.longitude as event_longitude,
          e.is_free as event_is_free,
          p.id as "permission_id",
          p.name as "status"
        FROM
          user_events eu
          JOIN events e ON e.id = eu.event_id
          INNER JOIN user_permissions_events upe ON upe.event_id = eu.event_id
          INNER JOIN permissions p ON p.id = upe.permission_id
        WHERE
          eu.user_id = ?`;
    const values = [userId];
    const [rows] = await this.connection.execute(query, values);
    return rows;
  }

  async getEventsByUserId(userId) {
    const query = `
        SELECT
          eu.event_id,
          e.name as event_name,
          e.description as event_description,
          e.place as event_place,
          e.latitude as event_latitude,
          e.longitude as event_longitude,
          e.is_free as event_is_free,
          p.*
        FROM
          user_events eu
          JOIN events e ON e.id = eu.event_id
          INNER JOIN user_permissions_events upe ON upe.event_id = eu.event_id
          INNER JOIN permissions p ON p.id = upe.permission_id
        WHERE
          eu.user_id = ?`;
    const values = [userId];
    const [rows] = await this.connection.execute(query, values);
    return rows;
  }

  async getUsersByEventId(eventId) {
    const sql = `select u.email, u.name, u.id , p.name ´permission_name´, p.id as ´permission_id´, p.description as ´permission_description´ from users u 
      inner join user_events eu on eu.user_id = u.id 
      INNER JOIN user_permissions_events upe ON upe.event_id = eu.event_id
      INNER JOIN permissions p ON p.id = upe.permission_id
      where eu.event_id = ?`;
   
    const values = [eventId];
    const [rows] = await this.connection.execute(sql, values);
 
    return rows;
  }
}

module.exports = EventUserRepository;
