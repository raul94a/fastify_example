class InvitationsRepository {
    constructor(connection) {
        this.connection = connection;
    }

    async create(invitation) {
        const { secret, invitedBy, userId, eventId } = invitation;
        const result = await this.pool.query(
            'INSERT INTO invitations (secret, invited_by, user_id, event_id) VALUES (?, ?, ?, ?)',
            [secret, invitedBy, userId, eventId]
        );
        return result.insertId;
    }


    async findById(id) {
        const sql = 'SELECT * FROM invitations WHERE id = ?';
        const values = [id];

        try {
            const [rows] = await this.connection.execute(sql, values);
            const invitation = rows[0];
            return invitation;
        } catch (error) {
            console.error('Error finding invitation by id:', error);
            throw error;
        }
    }

    async findByEmail(email){
        const sql = 'SELECT * FROM invitations WHERE email = ? and accepted = FALSE AND expiration_time < NOW()';
        const values = [email];

        try {
            const [rows] = await this.connection.execute(sql, values);
            const invitations = rows;
            return invitations;
        } catch (error) {
            console.error('Error finding invitation by id:', error);
            throw error;
        }

    }

    async deleteById(id) {
        const sql = 'DELETE FROM invitations WHERE id = ?';
        const values = [id];

        try {
            await this.connection.execute(sql, values);
        } catch (error) {
            console.error('Error deleting invitation by id:', error);
            throw error;
        }
    }

    async findByUser(userId) {
        const sql = 'SELECT * FROM invitations WHERE user_id = ?';
        const values = [userId];

        try {
            const [rows] = await this.connection.execute(sql, values);
            const invitations = rows;
            return invitations;
        } catch (error) {
            console.error('Error finding invitations by user:', error);
            throw error;
        }
    }

    async findByInvitator(invitedBy) {
        const sql = 'SELECT * FROM invitations WHERE invited_by = ?';
        const values = [invitedBy];

        try {
            const [rows] = await this.connection.execute(sql, values);
            const invitations = rows;
            return invitations;
        } catch (error) {
            console.error('Error finding invitations by invitator:', error);
            throw error;
        }
    }

    async findByEvent(eventId) {
        const sql = 'SELECT * FROM invitations WHERE event_id = ?';
        const values = [eventId];

        try {
            const [rows] = await this.connection.execute(sql, values);
            const invitations = rows;
            return invitations;
        } catch (error) {
            console.error('Error finding invitations by event:', error);
            throw error;
        }
    }

    async findByEmail(email) {
        const query = `SELECT invitations.id, invitations.secret, invitations.invited_by, invitations.event_id, invitations.created_at, invitations.updated_at, invitations.user_id, events.name as event_name, events.description as event_description, events.place as event_place, events.latitude as event_latitude, events.longitude as event_longitude, events.is_free as event_is_free, events.created_at as event_created_at, events.updated_at as event_updated_at
                       FROM invitations
                       INNER JOIN events ON invitations.event_id = events.id
                       WHERE invitations.user_id = (SELECT id FROM users WHERE email = ?)`;
        const values = [email];
      
        const [rows] = await this.pool.query(query, values);
        return rows;
      }
}

module.exports = InvitationsRepository;