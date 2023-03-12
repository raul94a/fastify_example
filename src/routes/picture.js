const picturesController = require('../controllers/picturesController');



function sendPicture(fastify, opts, done) {
    
    fastify.post('/picture/event',  picturesController.sendPictureToEvent);
    done();
}



module.exports = {
    sendPicture: sendPicture
}