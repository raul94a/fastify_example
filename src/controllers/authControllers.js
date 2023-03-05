const bcrypt = require('bcrypt');
const pool = require('../database/mysql_connection');
const AccessTokenRepository = require('../repositories/accessTokenRepository');

const UserRepository = require('../repositories/userRepository');



async function registerHandler(req, reply) {
    const userRepository = new UserRepository(pool);
    const acessTokenRepository = new AccessTokenRepository(pool)
    //request the body
    const body = req.body;
    const { name, email, password } = body;
    try {
        //1. Check if users exists
        const user = await userRepository.findByEmail(email);
        if (user) {
            reply.code(403)
            return reply.send({ 'error': 'Email is registered' })
        }
        //2. users does not exists: let's register it 
        const hash = await bcrypt.hash(password, 10);
        const userId = await userRepository.createUser(name, email, hash);
        //3. create an access Token
        const myAccessToken = 'ze655987411.kkkfifff55f0f1';
        acessTokenRepository.createAccessToken(myAccessToken, userId);
        return reply.send({
            name: name,
            email: email,
            password: password,
            hash: hash,
            accessToken: myAccessToken


        })



    } catch (exception) {
        reply.code(500).send({ 'error': 'Internal server error' })
    }
}


async function loginHandler(req, reply) {
    const userRepository = new UserRepository(pool);
    const acessTokenRepository = new AccessTokenRepository(pool)
    //request the body
    const body = req.body;
    const { email, password } = body;
    try {

        const user = await userRepository.findByEmail(email);
        if (!user) {
            return reply.code(404).send({ 'error': 'alguna de las credenciales no es correcta' })
        }
        const hashedPassword = user.password;
        const result = await bcrypt.compare(password, hashedPassword);
        if (!result) {
            return reply.code(404).send({ 'error': 'alguna de las credenciales no es correcta' })

        }
        const accessToken = await acessTokenRepository.findAccessTokenByUser(user.id);
        delete user['created_at'];
        delete user['updated_at'];
        return reply.send({
            ...user, credentials: {
                access_token: accessToken.token,
                expiration_date: accessToken['expiration_date']
            }
        });


    } catch (exception) {
        reply.code(500).send({ 'error': 'Internal server error' })
    }

}

async function refreshTokenHandler(req,reply){
    const acessTokenRepository = new AccessTokenRepository(pool)

    const body = req.body;
    const {access_token} = body;
    const accessToken = await acessTokenRepository.refresh(access_token);

    return reply.send({refreshed: true});
}


module.exports = {
    registerHandler: registerHandler,
    loginHandler: loginHandler,
    refreshTokenHandler: refreshTokenHandler
}