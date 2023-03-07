const unprotectedUrls = {
    '/auth/login': '/auth/login',
    '/auth/registration': '/auth/registration'
}

const allowedUrls  = {
    '/auth/login': '/auth/login',
    '/auth/registration': '/auth/registration',
    '/auth/refreshToken': '/auth/refreshToken'
}



async function verify(req, reply, done) {

    if(!allowedUrls[req.url]){
        return reply.code(404).send({error: 'The route does not exist'});
    }
    if(unprotectedUrls[req.url]){
       return done();
    }
    const headers  = req.headers;
    if(!headers['authorization']){
        return reply.code(401).send({error: 'Unauthorised'});
    }
    done();
}


module.exports = {
    verify: verify,
};