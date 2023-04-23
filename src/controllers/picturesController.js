const pool = require('../database/mysql_connection');
const EventUserRepository = require('../repositories/eventUserRepository');
const EventRepository = require('../repositories/eventRepository');
const PermissionRepository = require('../repositories/permissionsRepository');
const UserPermissionEventRepository = require('../repositories/userPermissionsEventsRepository');
const PicturesRepository = require('../repositories/picturesRepository');

const fs = require('fs');
const pipeline = require('stream').pipeline;
const util = require('util');
const uuid = require('uuid');

const path = require('path');


async function sendPictureToEvent(req, reply) {
    const { user_id } = req.headers;
    const paths = [];
    const datum = req.files();
    let eventIdRead = false;
    // console.log('DATA',data)
    for await (const data of datum) {
        console.log('MYDATA', data)
        const filename = data.filename;
        const ext = path.extname(filename)
        const fields = data.fields;
        if (!fields.event_id && !eventIdRead) {
            return reply.code(401).send({ error: 'Bad request' });
        }
        eventIdRead = true;

        const event_id = fields.event_id;

        const id = uuid.v4();
        //paths to save the file
        const direction = `./files/${id}${ext}`;
        const p = `/files/${id}${ext}`;

        let bytes = 0.0;
        const pump = util.promisify(pipeline)
        await pump(data.file.on('data', (data) => {
            bytes += data.length
        }), fs.createWriteStream(direction));

        const picturesRepo = new PicturesRepository(pool);
        paths.push({path: p})
        picturesRepo.create({ filepath: p, size: bytes, user_id: user_id, event_id: event_id.value });
    }
    return reply.send(paths);
}

module.exports = {
    sendPictureToEvent: sendPictureToEvent
}