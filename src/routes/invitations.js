
const invitationsController = require('../controllers/invitationsController');

function getInvitationsOfUser(fastify, opts, done) {
    fastify.get('/invitations/user', invitationsController.getInvitationsOfUser);
    done();
}
function sendInvitationByEmail(fastify, opts, done) {
    fastify.post('/invitations/send', invitationsController.sendInvitationByEmail);
    done();
}


module.exports = {
    getInvitationsOfUser: getInvitationsOfUser,
    sendInvitationByEmail: sendInvitationByEmail
}
