
const authController = require('../controllers/authControllers')

function registration(fastify, opts, done) {
    fastify.post('/auth/register', authController.registerHandler);
    done();
}


function login(fastify, opts, done) {
    fastify.post('/auth/login', authController.loginHandler)
    done();
}


function refreshToken(fastify, opts, done) {
    fastify.post('/auth/refreshToken', authController.refreshTokenHandler)
    done();
}


module.exports = {
    registration: registration,
   login: login,
   refreshToken: refreshToken
}



