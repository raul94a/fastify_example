
const eventController = require('../controllers/eventController')

function createEvent(fastify, opts, done) {
    fastify.post('/event/create',  eventController.createEvent);
    done();
}

function getEventsOfUser(fastify, opts, done) {
    fastify.get('/user/events',  eventController.getUserEvents);
    done();
}

function getUsersOfEvent(fastify, opts, done) {
    fastify.get('/event/:event_id/users',  eventController.getEventUsers);
    done();
}

module.exports = {
    createEvent: createEvent,
    getEventsOfUser: getEventsOfUser,
    getUsersOfEvent: getUsersOfEvent
}