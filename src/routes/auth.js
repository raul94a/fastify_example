
const authController = require('../controllers/authControllers')

function registration(fastify, opts, done) {
    fastify.post('/auth/registration', (req, reply) => authController.registerHandler(fastify, req, reply));
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
function validate(fastify, opts, done) {
    fastify.get('/auth/user/:userId/validate/:validationCode', authController.validateUser);
    done();
}




module.exports = {
    validateUser:validate,
    registration: registration,
    login: login,
    refreshToken: refreshToken
}



