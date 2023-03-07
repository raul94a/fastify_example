class AccessTokenRepository {
    constructor(connection) {
        this.connection = connection;
    }

    async refresh(token, newToken, newExpirationDate){
        try{    
           
           
             await this.connection.query(
                'UPDATE access_token set token = ?, expiration_date = ? where token = ?', [newToken, newExpirationDate,token]);
         
        }catch(ex){
            throw ex;
        }
    }

    async refreshByUserId(userId, token){
        try{    
            const d =  new Date(Date.now() + 3600 * 1000);
         
             await this.connection.query(
                'UPDATE access_token set token = ?, expiration_date = ? where user_id = ?', [token, d, userId]);
           return {'expiration_date': d, 'access_token': token};
        }catch(ex){
            throw ex;
        }
    }

    async createAccessToken(token, userId) {
        try {
            const query = 'INSERT INTO access_token (token, user_id) VALUES (?, ?)';
            const result = await this.connection.query(query, [token, userId]);
            return result[0].insertId;
        } catch (err) {
            throw err;

        }
    }

    async AccessTokenById(id) {
        try {
            const query = 'SELECT * FROM access_token WHERE id = ?';
            const [rows] = await this.connection.query(query, [id]);
            if (rows.length === 0) {
                return null;
            }
            return rows[0];
        } catch (err) {
            throw err;
        }
    }

    async findAccessTokenByToken(token) {
        try {
            const query = 'SELECT * FROM access_token WHERE token = ?';
            const [rows] = await this.connection.query(query, [token]);
            if (rows.length === 0) {
                return null;
            }
            return rows[0];
        } catch (err) {
            throw err;
        }
    }
    async findAccessTokenByUser(userId) {
        try {
            const query = 'SELECT * FROM access_token WHERE user_id = ?';
            const [rows] = await this.connection.query(query, [userId]);
            if (rows.length === 0) {
                return null;
            }
            return rows[0];
        } catch (err) {
            throw err;
        }
    }


    async deleteAccessTokenById(id) {
        try {
            const query = 'DELETE FROM access_token WHERE id = ?';
            await this.connection.query(query, [id]);
        } catch (err) {
            throw err;
        }
    }
    async deleteAccessTokenByUser(userId) {
        try {
          const query = 'DELETE FROM access_token WHERE user_id = ?';
          await this.connection.query(query, [userId]);
        } catch (err) {
          throw err;
        }
      }
}

module.exports = AccessTokenRepository;
