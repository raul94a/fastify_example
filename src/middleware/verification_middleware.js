const UserRepository = require("../repositories/userRepository");
const pool = require('../database/mysql_connection');

const unprotectedUrls = {
    '/auth/login': '/auth/login',
    '/auth/registration': '/auth/registration',
    '/auth/user/:userId/validate/:validationCode': '/auth/user/:userId/validate/:validationCode'
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
    console.log('verificationmiddleware',headers)
    if (!headers['authorization'] && !req.url.includes('validate')) {
        return reply.code(401).send({ error: 'Unauthorised' });
    }
    //set the user id in the request header
    const result = await new UserRepository(pool).findByAccessToken(headers['authorization']);
    console.log(result)
    //activar para el desarrollo! TODO: ACTIVAR
    // if(Date.now() > result.expiration_date){
    //     return reply.code(401).send({error: 'Credentials have expired'})
    // }
    if(!req.url.includes('validate')){

        req.headers = {
            user_id: result?.id
        }
    }
    done();
}


module.exports = {
    verify: verify,
};