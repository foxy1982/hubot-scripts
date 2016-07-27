var roomSanitizer = require('../lib/roomSanitizer');

module.exports = function (robot) {
    robot.router.post('/hubot/say/:room', function (req, res) {
        var room = roomSanitizer(eq.params.room || '#general');

        var data;

        if (req.body.message) {
            data =req.body. message;
        } else {
            data = req.body;
        }

        var envelope = {
            room: room
        };

        robot.send(envelope, data);

        res.send('OK');
    });
}
