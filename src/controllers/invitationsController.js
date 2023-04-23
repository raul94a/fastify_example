const pool = require('../database/mysql_connection');
const AccessTokenRepository = require('../repositories/accessTokenRepository');
const UserRepository = require('../repositories/userRepository');
const InvitationRepository = require('../repositories/invitationRepository');
const EventUserRepository = require('../repositories/eventUserRepository');
const { sendInvitationEmail } = require('./emailController');
const EventRepository = require('../repositories/eventRepository');



async function getInvitationsOfUser(req, reply) {


    //The verification middleware retrieves the user_id
    //who trigger the request for us
    const { user_id } = req.headers;

    const invitationsRepo = new InvitationRepository(pool);

    const invitations = await invitationsRepo.findByUser(user_id);


    return reply.send(invitations);

    //Fetch invitations by email

}


async function acceptInvitation(req, reply) {
    try {

        const body = req.body;
        if (!body['id'] || !body['event_id']) {
            return reply.code(404).send({ error: 'user not found' });
        }
        const invitationsRepo = new InvitationRepository(pool);
        const { id, event_id } = body;
        const { user_id } = req.headers;

        const invitation = await invitationsRepo.findById(id);
        if (invitation.accepted) {
            return reply.code(403).send({ error: 'The invitation has been accepted yet' });
        }
        invitationsRepo.acceptInvitation(id).then(function addUserToEvent(_) {
            const eventUserRepository = new EventUserRepository(pool);
            eventUserRepository.create(event_id, user_id);
        });

        return reply.code(201).send();


    } catch (ex) {
        return reply.code(500).send({ error: 'Internal server error' });
    }
    //fetch the invitation of the user, using the user_id from the verification middleware
    //Check the expiration date: double check with the database (bussiness logic should be written in the app)
    //Check if it is not accepted (another double check)
    //If not accepted, accept.
    //Include the user in the group (eventUserRepository)
    //From Now On the user can fetch the data from the event
}

//create invitation link

//create invitation QR???

//send invitation
async function sendInvitationByEmail(req, reply) {
    const body = req.body;
    if (!body['email'] || !body['event_id'] || !body['user_id']) {
        return reply.code(403).send({ error: 'Bad request' })
    }
    const { email, event_id, user_id } = body;
    const invitorId = req.headers['user_id'];
    const invitor = await new UserRepository(pool).getUserById(invitorId);
    const event = await new EventRepository(pool).getEventById(event_id);
    // const invitedUser = await new UserRepository().findByEmail(email);
    const secret  = createSecret(6);
    try{

        await new InvitationRepository(pool).create({
            secret:secret, invitedBy:invitorId, userId:user_id, eventId:event_id,email:email
        })
        sendInvitationEmail(email, invitor.name,event.name, secret)
        
        return reply.code(200).send({ success: true });
    }catch(exception){
        console.log(exception)
        return reply.code(401).send({error: 'User has been invited previously'})
    }

}

/**
 * 
 * @param {number} secretSize 
 * @returns {string}
 */
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

module.exports = {
    sendInvitationByEmail:sendInvitationByEmail,
    getInvitationsOfUser: getInvitationsOfUser,
    acceptInvitation: acceptInvitation,
}