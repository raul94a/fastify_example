
const invitationsController = require('../controllers/invitationsController');

function getInvitationsOfUser(fastify, opts, done) {
    fastify.get('/invitations/user', invitationsController.getInvitationsOfUser);
    done();
}



module.exports = {
    getInvitationsOfUser: getInvitationsOfUser
}
