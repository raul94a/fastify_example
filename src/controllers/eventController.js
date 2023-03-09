const pool = require('../database/mysql_connection');
const EventUserRepository = require('../repositories/eventUserRepository');
const EventRepository = require('../repositories/eventRepository');


async function getUserEvents(req, reply) {
    try {
        const headers = req.headers;
        const { user_id } = headers;
        const eventUserRepository = new EventUserRepository(pool);
        const events = await eventUserRepository.getByUserId(user_id);
        return reply.send(events);
    } catch (ex) {
        return reply.code(500).send({ error: 'Internal server error' });
    }
}

async function getEventUsers(req, reply) {
    try {
        const params = req.params;
        if (!params['event_id']) {
            return reply.code(403).send({ error: 'bad request' });
        }
        const eventUserRepository = new EventUserRepository(pool);
        const { event_id } = params;
        const users = await  eventUserRepository.getUsersByEventId(event_id);
        return reply.send(users);
    } catch (ex) {
        console.log(ex);
        return reply.code(500).send({ error: 'Internal server error' });

    }
}

async function createEvent(req, reply) {
    try {
        const headers = req.headers;
        const body = req.body;
        const { user_id } = headers;
        if (!body['name'] || !body['description'] || !body['place']) {
            return reply.code(401).send({ error: 'Bad request' });
        }
        if(!body['is_free']){
            body['is_free'] = false;
        }

        const eventRepository = new EventRepository(pool);
        const eventId = await eventRepository.createEvent(body)
        const eventUserRepository = new EventUserRepository(pool);
        eventUserRepository.create(eventId,user_id);

        return reply.send({ event_id: eventId });
    } catch (ex) {
        return reply.code(500).send({ error: 'Internal server error' });

    }
}

module.exports = {
    createEvent: createEvent,
    getEventUsers: getEventUsers,
    getUserEvents: getUserEvents
}






