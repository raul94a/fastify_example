const pool = require('../database/mysql_connection');
const EventUserRepository = require('../repositories/eventUserRepository');
const EventRepository = require('../repositories/eventRepository');
const PermissionRepository = require('../repositories/permissionsRepository');
const UserPermissionEventRepository = require('../repositories/userPermissionsEventsRepository');




async function getUserEvents(req, reply) {
    try {
        const headers = req.headers;
        const { user_id } = headers;
        const eventUserRepository = new EventUserRepository(pool);
        const events = await eventUserRepository.getByUserId(user_id);
        return reply.send(events);
    } catch (ex) {
        console.log(ex)
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
        const users = await eventUserRepository.getUsersByEventId(event_id);
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
        let isFreePresent = true;
        if (!body['is_free']) {
            isFreePresent = false;
        }


        const event = isFreePresent ? body : {...body, is_free: false}; 
        const eventRepository = new EventRepository(pool);
        const eventId = await eventRepository.cr
        eateEvent(event)
        const eventUserRepository = new EventUserRepository(pool);
        //insert into permissions
        const permissionEventRepository = new UserPermissionEventRepository(pool);
        permissionEventRepository.addPermissionToUserForEvent(user_id, 1, eventId);
        eventUserRepository.create(eventId, user_id);

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






