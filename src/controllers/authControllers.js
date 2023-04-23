const bcrypt = require('bcrypt');
const pool = require('../database/mysql_connection');
const AccessTokenRepository = require('../repositories/accessTokenRepository');

const UserRepository = require('../repositories/userRepository');
const emailController = require('./emailController');
const { sendInvitationByEmail } = require('./invitationsController');



async function registerHandler(fastify, req, reply) {
    const userRepository = new UserRepository(pool);
    const acessTokenRepository = new AccessTokenRepository(pool)
    //request the body
    const body = req.body;
    if (!body['password'] || !body['email'] || !body['name']) {
        return reply.code(401).send({ 'error': 'bad request' });
    }
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
        const secret = createSecret(6);
        const userId = await userRepository.createUser(name, email, secret,hash);
        //3. create an access Token
        const token = fastify.jwt.sign({ email })


        await acessTokenRepository.createAccessToken(token, userId);
        
        emailController.sendValidationEmail(email,secret,userId)


        return reply.send({
            name: name,
            email: email,
            password: password,
            hash: hash,
            accessToken: token
        })



    } catch (exception) {
        console.log(exception)
        reply.code(500).send({ 'error': 'Internal server error' })
    }
}


async function loginHandler(fastify, req, reply) {
    const userRepository = new UserRepository(pool);
    const acessTokenRepository = new AccessTokenRepository(pool)
    //request the body
    const body = req.body;
    if (!body['password'] || !body['email']) {
        return reply.code(401).send({ 'error': 'bad request' });
    }
    const { email, password } = body;
    try {

        const user = await userRepository.findByEmail(email);
        if (!user) {
            return reply.code(404).send({ 'error': 'alguna de las credenciales no es correcta' })
        }
        if(user.validated !==true){
            return reply.code(404).send({ 'error': 'User has not been validated' })

        }
        const hashedPassword = user.password;
        const result = await bcrypt.compare(password, hashedPassword);
        if (!result) {
            return reply.code(404).send({ 'error': 'alguna de las credenciales no es correcta' })
        }
        const accessToken = await acessTokenRepository.findAccessTokenByUser(user.id);
        let tokenData = {
            access_token: accessToken.token,
            expiration_date: accessToken['expiration_date']
        };
        const accessTokenExpirationDate = accessToken['expiration_date'];
        const expirationDate = new Date(accessTokenExpirationDate);
        const currentDate = new Date(Date.now());

        if (expirationDate.getTime() < currentDate.getTime()) {
            const token = fastify.jwt.sign({ email })
            tokenData = await acessTokenRepository.refreshByUserId(user.id, token);
        }

        delete user['password'];
        delete user['created_at'];
        delete user['updated_at'];

        return reply.send({
            ...user, credentials: {
                ...tokenData
            }
        });


    } catch (exception) {
        reply.code(500).send({ 'error': 'Internal server error' })
    }

}

async function refreshTokenHandler(fastify, req, reply) {
    try {

        const acessTokenRepository = new AccessTokenRepository(pool)
        const body = req.body;
        const headers = req.headers;
        const {authorization} = headers;
        console.log(authorization);
        if (!body['email']) {
            return reply.code(401).send({ 'error': 'bad request' });
        }
        const { email } = body;
        
        const verification = fastify.jwt.verify(authorization);
        const isVerified = verification.email === email;
        if (!isVerified) {
            console.log('no token', 'NOT VERIFIED');

            return reply.code(401).send({ 'error': 'Unauthorized' });
        }

        const newToken = fastify.jwt.sign({ email })

        const newExpirationDate =  new Date(Date.now() + 3600 * 1000);
        acessTokenRepository.refresh(authorization,newToken, newExpirationDate );
        const refresh = {
            access_token: newToken,
            expiration_date: newExpirationDate
        };

        return reply.send(refresh);
    } catch (ex) {
        return reply.code(500).send({ 'error': 'Internal server error' });
    }

}


async function validateUser(req,reply) {
    try {
            
        const params = req.params;
        const {userId, validationCode} = params;
        const userRepo = new UserRepository(pool);
        const user = await  userRepo.getUserById(userId);
        if(validationCode !== user['valid_code']){
            return reply.code(403).send({error: 'Bad request'})
        }
        if(user['valid_code'] === true){
            return reply.code(403).send({error: 'The user has been validated previously.'})
        }


        await userRepo.validateUser(userId);

        return reply.send({success:true, message: 'The user has been validated successfuly'});
    } catch (ex) {
        return reply.code(500).send({ 'error': 'Internal server error' });
    }
}

module.exports = {
    registerHandler: registerHandler,
    loginHandler: loginHandler,
    refreshTokenHandler: refreshTokenHandler,
    validateUser: validateUser
}




function createSecret(secretSize){
    const array = '0123456789asdfghjklqwertyuiopzxcvbnmASDFGHJKLZXCVBNMQWERTYUIOP'
    const length = array.length;
    let secret = '';
    for(let i = 0; i < secretSize; i++){
        const randomNumber = Math.floor((Math.random() * (length - 1)));
        const char = array[randomNumber];
        secret += char;
    }
    return secret;
}