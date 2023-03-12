class PermissionRepository {
    constructor(connection) {
      this.connection = connection;
    }
  
    async getAll() {
      const query = 'SELECT * FROM permissions';
      const [rows] = await this.connection.execute(query);
      return rows;
    }
  
    async getById(id) {
      const query = 'SELECT * FROM permissions WHERE id = ?';
      const [rows] = await this.connection.execute(query, [id]);
      return rows[0];
    }
  
    async create(name, description) {
      const query = 'INSERT INTO permissions (name, description) VALUES (?, ?)';
      const [result] = await this.connection.execute(query, [name, description]);
      const id = result.insertId;
      const createdPermission = await this.getById(id);
      return createdPermission;
    }
  
    async update(id, name, description) {
      const query = 'UPDATE permissions SET name = ?, description = ? WHERE id = ?';
      await this.connection.execute(query, [name, description, id]);
      const updatedPermission = await this.getById(id);
      return updatedPermission;
    }
  
    async delete(id) {
      const query = 'DELETE FROM permissions WHERE id = ?';
      await this.connection.execute(query, [id]);
    }
  }



  module.exports = PermissionRepository;
  