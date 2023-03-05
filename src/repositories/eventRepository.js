class EventRepository {
    constructor(connection) {
      this.connection = connection;
    }
  
    async getAllEvents() {
      try {
        const query = 'SELECT * FROM events';
        const result = await this.connection.query(query);
        return result[0];
      } catch (err) {
        throw err;
      }
    }
  
    async getEventById(eventId) {
      try {
        const query = 'SELECT * FROM events WHERE id = ?';
        const result = await this.connection.query(query, [eventId]);
        return result[0][0];
      } catch (err) {
        throw err;
      }
    }
  
    async createEvent(event) {
      try {
        const query = 'INSERT INTO events (name, description, place, latitude, longitude, is_free) VALUES (?, ?, ?, ?, ?, ?)';
        const result = await this.connection.query(query, [event.name, event.description, event.place, event.latitude, event.longitude, event.isFree]);
        return result[0].insertId;
      } catch (err) {
        throw err;
      }
    }
  
    async updateEvent(event) {
      try {
        const query = 'UPDATE events SET name = ?, description = ?, place = ?, latitude = ?, longitude = ?, is_free = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const result = await this.connection.query(query, [event.name, event.description, event.place, event.latitude, event.longitude, event.isFree, event.id]);
        return result[0].affectedRows;
      } catch (err) {
        throw err;
      }
    }
  
    async deleteEvent(eventId) {
      try {
        const query = 'DELETE FROM events WHERE id = ?';
        const result = await this.connection.query(query, [eventId]);
        return result[0].affectedRows;
      } catch (err) {
        throw err;
      }
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
            e.is_free as event_is_free
          FROM
            event_users eu
            JOIN events e ON e.id = eu.event_id
          WHERE
            eu.user_id = ?`;
        const values = [userId];
        const [rows] = await this.connection.execute(query, values);
        return rows;
      }

      async getUsersByEventId(eventId) {
        const query = `
          SELECT
            eu.event_id,
            u.id as user_id,
            u.name as user_name,
            u.email as user_email
          FROM
            event_users eu
            JOIN users u ON u.id = eu.user_id
          WHERE
            eu.event_id = ?`;
        const values = [eventId];
        const [rows] = await this.connection.execute(query, values);
        return rows;
      }
  }
  
  module.exports = EventRepository;