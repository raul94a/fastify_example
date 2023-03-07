const pool = require('../database/mysql_connection');
const UsersRepository = require('../repositories/userRepository');


const usersRoute = (fastify, opts, done) => {
    fastify.get('/users', async (req, reply) => {
        console.log(req.headers);
        console.log(reply.headers);
        const usersRepo = new UsersRepository(pool);
        try {
            const users = await usersRepo.findAll();
            reply.send(users)
        } catch (exception) {
            reply.send(exception);
        }
    });
    done();
}

module.exports = usersRoute;