const UserRepository = require("../repositories/userRepository");
const pool = require('../database/mysql_connection');

const unprotectedUrls = {
    '/auth/login': '/auth/login',
    '/auth/registration': '/auth/registration',
    //from here should be removed for production
}

const allowedUrls = {
    '/auth/login': '/auth/login',
    '/auth/registration': '/auth/registration',
    '/auth/refreshToken': '/auth/refreshToken',
    '/invitations/user/*': '/invitations/user/*'
}



async function verify(req, reply, done) {

    // if (!allowedUrls[req.url]) {
    //     return reply.code(404).send({ error: 'The route does not exist' });
    // }
    if (unprotectedUrls[req.url]) {
        return done();
    }
    const headers = req.headers;
    if (!headers['authorization']) {
        return reply.code(401).send({ error: 'Unauthorised' });
    }
    //set the user id in the request header
    const userId = await new UserRepository(pool).findByAccessToken(headers['authorization']);
    req.headers = {
        user_id: userId.id
    }
    done();
}


module.exports = {
    verify: verify,
};