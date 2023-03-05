
const authController = require('../controllers/authControllers')

function registration(fastify, opts, done) {
    fastify.post('/auth/register', (req, reply) => authController.registerHandler(fastify, req, reply));
    done();
}


function login(fastify, opts, done) {
    fastify.post('/auth/login', (req, rep) => authController.loginHandler(fastify, req, rep))
    done();
}


function refreshToken(fastify, opts, done) {
    fastify.post('/auth/refreshToken', (req, rep) => authController.refreshTokenHandler(fastify, req, rep))
    done();
}


module.exports = {
    registration: registration,
    login: login,
    refreshToken: refreshToken
}



