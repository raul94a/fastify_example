const pool = require('../database/mysql_connection');
const AccessTokenRepository = require('../repositories/accessTokenRepository');
const UserRepository = require('../repositories/userRepository');
const InvitationRepository = require('../repositories/invitationRepository');



async function getInvitationsOfUser(req,reply) {
    

    //The verification middleware retrieves the user_id
    //who trigger the request for us
    const {user_id} = req.headers;
    
    const invitationsRepo = new InvitationRepository(pool);

    const invitations = await invitationsRepo.findByUser(user_id);


    return reply.send(invitations);

    //Fetch invitations by email

}


async function acceptInvitation(req,reply){
    const body = req.body;
    if( !body['id'] || !body['event_id']){
        return reply.code(404).send({error: 'user not found'});
    }
    const invitationsRepo = new InvitationRepository(pool);
    const {email} = body;
    const {user_id} = req.headers;
    
    //fetch the invitation of the user, using the user_id from the verification middleware
    //Check the expiration date: double check with the database (bussiness logic should be written in the app)
    //Check if it is not accepted (another double check)
    //If not accepted, accept.
    //Include the user in the group (eventUserRepository)
    //From Now On the user can fetch the data from the event

    

}

module.exports = {
    getInvitationsOfUser: getInvitationsOfUser,
}