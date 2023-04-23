const User = require('../models/User')
class UserRepository {
    constructor(connection) {
      this.connection = connection;
    }

    async findByAccessToken(accessToken) {
      const sql = 'SELECT u.id, a.expiration_date from users u INNER JOIN access_token a on a.user_id = u.id where a.token = ?';
      try{
        const [rows] = await this.connection.query(sql,[accessToken]);
        return rows[0];
      }
      catch(ex){
        throw ex;
      }
    }

    async findAll() {
        const sql = 'SELECT * FROM users';
        try{
            const [rows, fields] = await this.connection.query(sql);
            return rows;
        }catch(err){
            throw err;
        }
    }
    /**
     * 
     * @param {string} userId 
     * @returns {Promise<any>}
     */
    async getUserById(userId) {
      try {
        const query = 'SELECT * FROM users WHERE id = ?';
        const result = await this.connection.query(query, [userId]);
        return result[0][0];
      } catch (err) {
        throw err;
      }
    }
  
    async findByEmail(email) {
      try {
        const query = 'SELECT * FROM users WHERE email = ?';
        const result = await this.connection.query(query, [email]);
        return result[0][0];
      } catch (err) {
        throw err;
      }
    }
  
    async createUser(name, email, secret, password) {
      try {
     
        const query = 'INSERT INTO users (name, email, valid_code, password) VALUES (?, ?, ?, ?)';
        const result = await this.connection.query(query, [name, email, secret, password]);
       
        return result[0].insertId;
      } catch (err) {
        throw err;
      }
    }

    async validateUser(id){
      try{
        const query = 'update users set validated = true where id = ?';
        await this.connection.query(query, [id])
      }
      catch(err){
        throw err;
      }
    }
  
    async updateUser(userId, name, email, password) {
      try {
        const query = 'UPDATE users SET name = ?, email = ?, password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const result = await this.connection.query(query, [name, email, password, userId]);
        return result[0].affectedRows;
      } catch (err) {
        throw err;
      }
    }
  
    async deleteUser(userId) {
      try {
        const query = 'DELETE FROM users WHERE id = ?';
        const result = await this.connection.query(query, [userId]);
        return result[0].affectedRows;
      } catch (err) {
        throw err;
      }
    }
  }


  
  module.exports = UserRepository;