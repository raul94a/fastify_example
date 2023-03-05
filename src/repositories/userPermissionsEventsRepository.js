class UserPermissionsEventRepository {
    constructor(connection) {
      this.connection = connection;
    }
  
    async addPermissionToUserForEvent(userId, permissionId, eventId) {
      const sql = `
        INSERT INTO user_permissions_events (user_id, permission_id, event_id)
        VALUES (?, ?, ?)
      `;
      const params = [userId, permissionId, eventId];
      const [result] = await this.connection.execute(sql, params);
      return result.insertId;
    }
  
    async removePermissionFromUserForEvent(userId, permissionId, eventId) {
      const sql = `
        DELETE FROM user_permissions_events
        WHERE user_id = ? AND permission_id = ? AND event_id = ?
      `;
      const params = [userId, permissionId, eventId];
      const [result] = await this.connection.execute(sql, params);
      return result.affectedRows > 0;
    }
  
    async getUsersWithPermissionForEvent(permissionId, eventId) {
      const sql = `
        SELECT u.*
        FROM users u
        JOIN user_permissions_events upe ON u.id = upe.user_id
        WHERE upe.permission_id = ? AND upe.event_id = ?
      `;
      const params = [permissionId, eventId];
      const [rows] = await this.connection.execute(sql, params);
      return rows;
    }
  
    async getPermissionsForUserAtEvent(userId, eventId) {
      const sql = `
        SELECT p.*
        FROM permissions p
        JOIN user_permissions_events upe ON p.id = upe.permission_id
        WHERE upe.user_id = ? AND upe.event_id = ?
      `;
      const params = [userId, eventId];
      const [rows] = await this.connection.execute(sql, params);
      return rows;
    }
  
    async getEventsForUserWithPermission(userId, permissionId) {
      const sql = `
        SELECT e.*
        FROM events e
        JOIN user_permissions_events upe ON e.id = upe.event_id
        WHERE upe.user_id = ? AND upe.permission_id = ?
      `;
      const params = [userId, permissionId];
      const [rows] = await this.connection.execute(sql, params);
      return rows;
    }
  }
  

  module.exports = UserPermissionsEventRepository;